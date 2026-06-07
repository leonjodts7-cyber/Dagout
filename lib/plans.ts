import { createBrowserSupabase } from "@/lib/supabase/client";
import type { PlanningItem } from "@/lib/planning-types";

export interface SavedPlan {
  id: string;
  name: string | null;
  group_size: number | null;
  items: PlanningItem[];
  total_budget: number | null;
  created_at: string;
}

export async function savePlan(data: {
  name: string;
  groupSize: number;
  items: PlanningItem[];
  totalBudget: number;
  userId?: string | null;
}) {
  const supabase = createBrowserSupabase();
  const { error } = await supabase.from("plans").insert({
    name: data.name,
    group_size: data.groupSize,
    items: data.items,
    total_budget: data.totalBudget,
    user_id: data.userId ?? null,
  });

  if (error) throw error;
}

export async function getPlans(userId: string): Promise<SavedPlan[]> {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("plans")
    .select("id, name, group_size, items, total_budget, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string | null,
    group_size: row.group_size as number | null,
    items: (row.items as PlanningItem[]) ?? [],
    total_budget: row.total_budget as number | null,
    created_at: row.created_at as string,
  }));
}

export async function deletePlan(planId: string) {
  const supabase = createBrowserSupabase();
  const { error } = await supabase.from("plans").delete().eq("id", planId);
  if (error) throw error;
}
