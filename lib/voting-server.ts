import { getSupabase } from "@/lib/supabase";
import type { VoteSession } from "@/lib/voting";

export async function getVoteSessionServer(id: string): Promise<VoteSession | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("vote_sessions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return null;
    return data as VoteSession | null;
  } catch {
    return null;
  }
}
