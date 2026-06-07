import { createBrowserSupabase } from "@/lib/supabase/client";
import { getVoteSessionStatus, isDeadlinePassed } from "@/lib/voting-utils";

export interface VoteSession {
  id: string;
  creator_name: string | null;
  creator_user_id: string | null;
  company_name: string | null;
  message: string | null;
  deadline: string | null;
  provider_ids: string[];
  closed: boolean;
  created_at: string;
}

export interface Vote {
  id: string;
  session_id: string;
  provider_id: string;
  voter_name: string;
  created_at: string;
}

export function generateSessionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function createVoteSession(data: {
  id: string;
  creatorUserId: string;
  creatorName: string;
  companyName: string;
  message: string;
  deadline: string;
  providerIds: string[];
}) {
  const supabase = createBrowserSupabase();
  const { error } = await supabase.from("vote_sessions").insert({
    id: data.id,
    creator_user_id: data.creatorUserId,
    creator_name: data.creatorName,
    company_name: data.companyName,
    message: data.message || null,
    deadline: data.deadline || null,
    provider_ids: data.providerIds,
  });

  if (error) throw error;
}

export async function getVoteSession(id: string): Promise<VoteSession | null> {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("vote_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as VoteSession | null;
}

export async function getUserVoteSessions(
  userId: string
): Promise<VoteSession[]> {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("vote_sessions")
    .select("*")
    .eq("creator_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as VoteSession[]) ?? [];
}

export async function getActiveVoteSessionForUser(
  userId: string
): Promise<VoteSession | null> {
  const sessions = await getUserVoteSessions(userId);
  return (
    sessions.find((session) => getVoteSessionStatus(session) === "actief") ??
    null
  );
}

export async function getVoteCountsForSessions(
  sessionIds: string[]
): Promise<Record<string, number>> {
  if (sessionIds.length === 0) return {};

  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("votes")
    .select("session_id")
    .in("session_id", sessionIds);

  if (error) throw error;

  const counts: Record<string, number> = {};
  sessionIds.forEach((id) => {
    counts[id] = 0;
  });
  (data ?? []).forEach((row) => {
    const sessionId = row.session_id as string;
    counts[sessionId] = (counts[sessionId] ?? 0) + 1;
  });

  return counts;
}

export async function addProviderToVoteSession(
  sessionId: string,
  providerId: string,
  userId: string
) {
  const supabase = createBrowserSupabase();
  const session = await getVoteSession(sessionId);

  if (!session) throw new Error("Stemronde niet gevonden.");
  if (session.creator_user_id !== userId) {
    throw new Error("Je hebt geen toegang tot deze stemronde.");
  }
  if (getVoteSessionStatus(session) !== "actief") {
    throw new Error("Deze stemronde is niet meer actief.");
  }
  if (session.provider_ids.includes(providerId)) {
    throw new Error("Deze activiteit staat al in je stemronde.");
  }
  if (session.provider_ids.length >= 5) {
    throw new Error("Je stemronde heeft al het maximum van 5 activiteiten.");
  }

  const { error } = await supabase
    .from("vote_sessions")
    .update({ provider_ids: [...session.provider_ids, providerId] })
    .eq("id", sessionId);

  if (error) throw error;
}

export async function deleteVoteSession(sessionId: string, userId: string) {
  const supabase = createBrowserSupabase();
  const session = await getVoteSession(sessionId);

  if (!session) throw new Error("Stemronde niet gevonden.");
  if (session.creator_user_id !== userId) {
    throw new Error("Je hebt geen toegang tot deze stemronde.");
  }

  const { error } = await supabase
    .from("vote_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) throw error;
}

export async function getVotesForSession(sessionId: string): Promise<Vote[]> {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Vote[]) ?? [];
}

export async function submitVote(
  sessionId: string,
  providerId: string,
  voterName: string
) {
  const supabase = createBrowserSupabase();
  const session = await getVoteSession(sessionId);

  if (!session) throw new Error("Stemronde niet gevonden.");
  if (session.closed || isDeadlinePassed(session.deadline)) {
    throw new Error("Deze stemronde is gesloten.");
  }

  const normalized = voterName.trim();
  const { data: existing } = await supabase
    .from("votes")
    .select("id")
    .eq("session_id", sessionId)
    .eq("voter_name", normalized)
    .maybeSingle();

  if (existing) {
    throw new Error("Deze naam heeft al gestemd in deze stemronde.");
  }

  const { error } = await supabase.from("votes").insert({
    session_id: sessionId,
    provider_id: providerId,
    voter_name: normalized,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("Deze naam heeft al gestemd in deze stemronde.");
    }
    throw error;
  }
}

export async function closeVoteSession(sessionId: string) {
  const supabase = createBrowserSupabase();
  const { error } = await supabase
    .from("vote_sessions")
    .update({ closed: true })
    .eq("id", sessionId);

  if (error) throw error;
}

export function getVoteCounts(
  votes: Vote[],
  providerIds: string[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  providerIds.forEach((id) => {
    counts[id] = 0;
  });
  votes.forEach((vote) => {
    if (counts[vote.provider_id] !== undefined) {
      counts[vote.provider_id] += 1;
    }
  });
  return counts;
}

export function getWinnerProviderId(
  counts: Record<string, number>
): string | null {
  let winner: string | null = null;
  let max = 0;
  Object.entries(counts).forEach(([id, count]) => {
    if (count > max) {
      max = count;
      winner = id;
    }
  });
  return max > 0 ? winner : null;
}
