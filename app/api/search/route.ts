import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROVIDERS, resolveProvider } from "@/lib/providers";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function indoorLabel(value: string): string {
  if (value === "indoor") return "binnen";
  if (value === "outdoor") return "buiten";
  return "beide";
}

function enrichRecommendations(
  recommendations: Array<{
    id?: string;
    name?: string;
    reason?: string;
    match_score?: number;
  }>
) {
  return recommendations.slice(0, 3).map((rec) => {
    const provider = rec.id ? resolveProvider(rec.id) : undefined;
    return {
      id: provider?.id ?? rec.id ?? "",
      slug: provider?.slug ?? rec.id ?? "",
      name: rec.name ?? provider?.name ?? "",
      reason: rec.reason ?? "",
      match_score: Math.min(
        100,
        Math.max(0, Math.round(rec.match_score ?? 80))
      ),
    };
  }).filter((rec) => rec.slug && rec.name);
}

export async function POST(request: NextRequest) {
  try {
    const { query, region } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Geen zoekopdracht opgegeven" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI niet beschikbaar", fallback: true },
        { status: 200 }
      );
    }

    const providersContext = [...MOCK_PROVIDERS]
      .filter((p) => p.active)
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .map(
        (p) =>
          `- slug: ${p.slug} | ${p.name} (${p.category}, ${p.city}, €${p.price_from}/pers, ${p.min_persons}-${p.max_persons} personen, ${indoorLabel(p.indoor_outdoor)}${p.featured ? ", PRO/featured" : ""})`
      )
      .join("\n");

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Je bent de AI-assistent van Dagout.be, een Belgisch teambuilding platform voor Vlaanderen.

Beschikbare activiteiten:
${providersContext}

Zoekopdracht van de gebruiker: "${query}"
${region && region !== "alle" ? `Regio voorkeur: ${region}` : ""}

Analyseer de zoekopdracht en kies de beste 3 activiteiten. Geef prioriteit aan PRO/featured activiteiten wanneer ze passen bij de vraag. Gebruik het slug-veld als id. Antwoord ALLEEN als geldige JSON zonder markdown, geen uitleg erbuiten:
{
  "recommendations": [
    {
      "id": "slug van de activiteit",
      "name": "naam",
      "reason": "één zin waarom dit perfect past",
      "match_score": 95
    }
  ],
  "summary": "twee zinnen over waarom deze activiteiten goed passen bij de zoekopdracht"
}`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: {
      recommendations?: Array<{
        id?: string;
        name?: string;
        reason?: string;
        match_score?: number;
      }>;
      summary?: string;
    };

    try {
      const cleaned = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        {
          error: "AI kon geen resultaten genereren",
          fallback: true,
        },
        { status: 200 }
      );
    }

    const recommendations = enrichRecommendations(parsed.recommendations ?? []);

    if (recommendations.length === 0) {
      return NextResponse.json(
        {
          error: "AI kon geen resultaten genereren",
          fallback: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      recommendations,
      summary:
        parsed.summary ??
        "Deze activiteiten passen het best bij jullie zoekopdracht.",
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        error: "AI niet beschikbaar",
        fallback: true,
      },
      { status: 200 }
    );
  }
}
