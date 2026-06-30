import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getProvidersForAi } from "@/lib/providers-unified";
import { parsePlanningJson, stripPlanningJson } from "@/lib/planning-types";

const EMPTY_REPLY =
  "Nog geen activiteiten beschikbaar om een dagplanning samen te stellen. Kom terug zodra er aanbieders zijn aangesloten op Dagout.";

const SYSTEM_PROMPT = `Je bent de AI dagassistent van Dagout.be. Je helpt bedrijven een perfecte teambuilding dag plannen in Vlaanderen.
Je hebt toegang tot deze activiteiten: [wordt dynamisch ingevuld].
Als iemand een dag wil plannen, stel je een concrete dagplanning voor met:
- Ochtendactiviteit (09:00-12:00)
- Lunch aanbeveling in de buurt
- Namiddagactiviteit (13:30-16:30)
- Optionele borrel/afsluiting
Geef altijd concrete tijden, namen van activiteiten uit jouw lijst, en een totaal budget.
Antwoord in het Nederlands, vriendelijk en professioneel.
Als je een dagplanning voorstelt, geef die ook terug als JSON in dit formaat aan het einde van je bericht:
PLANNING_JSON:{"items":[{"time":"09:00","name":"...","duration":180,"price_per_person":35,"provider_id":"..."}]}`;

function buildFallbackResponse(
  messages: Array<{ role: string; content: string }>,
  activities: Awaited<ReturnType<typeof getProvidersForAi>>
): { reply: string; planning: ReturnType<typeof parsePlanningJson> } {
  if (activities.length === 0) {
    return { reply: EMPTY_REPLY, planning: null };
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUser?.content ?? "";

  const groupMatch = query.match(/(\d+)\s*(mensen|personen)/i);
  const groupSize = groupMatch ? parseInt(groupMatch[1], 10) : 20;

  const morning = activities[0];
  const afternoon = activities[1] ?? activities[0];

  const items = [
    {
      time: "09:00",
      name: morning.name,
      duration: morning.duration_minutes,
      price_per_person: morning.price_from,
      provider_id: morning.id,
    },
    {
      time: "12:30",
      name: "Lunch in de buurt",
      duration: 60,
      price_per_person: 15,
      provider_id: "lunch",
    },
    {
      time: "13:30",
      name: afternoon.name,
      duration: afternoon.duration_minutes,
      price_per_person: afternoon.price_from,
      provider_id: afternoon.id,
    },
  ];

  const total = items.reduce((s, i) => s + i.price_per_person * groupSize, 0);

  const reply = `Hier is een voorstel voor jullie teambuilding dag (${groupSize} personen):

**Ochtend (09:00)** — ${morning.name} in ${morning.city}. Duur: ${Math.round(morning.duration_minutes / 60)} uur, €${morning.price_from}/pers.

**Lunch (12:30)** — Gezamenlijke lunch in een restaurant in de buurt, reken op €15/pers.

**Namiddag (13:30)** — ${afternoon.name}. Duur: ${Math.round(afternoon.duration_minutes / 60)} uur, €${afternoon.price_from}/pers.

**Totaal indicatief budget:** €${total.toFixed(2)} voor ${groupSize} personen.

PLANNING_JSON:${JSON.stringify({ items })}`;

  return { reply: stripPlanningJson(reply), planning: { items } };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const groupSize = typeof body.groupSize === "number" ? body.groupSize : 20;

    if (messages.length === 0) {
      return NextResponse.json({ error: "Berichten zijn verplicht" }, { status: 400 });
    }

    const activities = await getProvidersForAi();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (activities.length === 0) {
      return NextResponse.json({
        reply: EMPTY_REPLY,
        planning: null,
        source: "empty",
      });
    }

    if (!apiKey) {
      const fallback = buildFallbackResponse(messages, activities);
      return NextResponse.json({
        reply: fallback.reply,
        planning: fallback.planning,
        source: "fallback",
      });
    }

    const anthropic = new Anthropic({ apiKey });
    const systemWithActivities = SYSTEM_PROMPT.replace(
      "[wordt dynamisch ingevuld]",
      JSON.stringify(activities, null, 2)
    );

    const anthropicMessages = messages
      .filter((m: { role?: string; content?: string }) => m.role && m.content)
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: `${systemWithActivities}\n\nGroepsgrootte voor budgetberekening: ${groupSize} personen.`,
      messages: anthropicMessages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const fullText = textBlock?.type === "text" ? textBlock.text : "";
    const planning = parsePlanningJson(fullText);
    const reply = stripPlanningJson(fullText);

    return NextResponse.json({
      reply: reply || "Ik heb een dagplanning voor je samengesteld.",
      planning,
      source: "ai",
    });
  } catch (error) {
    console.error("Dagassistent API error:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het verwerken van je vraag." },
      { status: 500 }
    );
  }
}
