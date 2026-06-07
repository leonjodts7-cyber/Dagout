export interface PlanningItem {
  time: string;
  name: string;
  duration: number;
  price_per_person: number;
  provider_id: string;
}

export interface PlanningJson {
  items: PlanningItem[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function parsePlanningJson(text: string): PlanningJson | null {
  const marker = "PLANNING_JSON:";
  const idx = text.indexOf(marker);
  if (idx === -1) return null;

  const jsonPart = text.slice(idx + marker.length).trim();
  const jsonMatch = jsonPart.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const normalized = jsonMatch[0].replace(/'/g, '"');
    const parsed = JSON.parse(normalized) as PlanningJson;
    if (!parsed.items || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as PlanningJson;
      if (!parsed.items || !Array.isArray(parsed.items)) return null;
      return parsed;
    } catch {
      return null;
    }
  }
}

export function stripPlanningJson(text: string): string {
  const marker = "PLANNING_JSON:";
  const idx = text.indexOf(marker);
  if (idx === -1) return text.trim();
  return text.slice(0, idx).trim();
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function calculatePlanningTotal(
  items: PlanningItem[],
  groupSize: number
): number {
  return items.reduce(
    (sum, item) => sum + item.price_per_person * groupSize,
    0
  );
}
