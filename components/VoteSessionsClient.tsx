"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import {
  deleteVoteSession,
  getUserVoteSessions,
  getVoteCountsForSessions,
  type VoteSession,
} from "@/lib/voting";
import {
  formatDeadlineNl,
  getVoteSessionStatus,
  type VoteSessionStatus,
} from "@/lib/voting-utils";
import { Skeleton } from "@/components/ui/Skeleton";

const STATUS_LABELS: Record<VoteSessionStatus, string> = {
  actief: "Actief",
  verlopen: "Verlopen",
  gesloten: "Gesloten",
};

const STATUS_COLORS: Record<VoteSessionStatus, string> = {
  actief: "bg-green-100 text-green-800",
  verlopen: "bg-amber-100 text-amber-800",
  gesloten: "bg-gray-100 text-gray-600",
};

export default function VoteSessionsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<VoteSession[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadSessions() {
    const supabase = createBrowserSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/inloggen?redirect=/dashboard/stemrondes");
      return;
    }

    const data = await getUserVoteSessions(user.id);
    const counts = await getVoteCountsForSessions(data.map((s) => s.id));
    setSessions(data);
    setVoteCounts(counts);
    setLoading(false);
  }

  useEffect(() => {
    loadSessions().catch(() => setLoading(false));
  }, []);

  async function copyLink(sessionId: string) {
    const url = `${window.location.origin}/stemmen/${sessionId}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleDelete(sessionId: string) {
    if (!confirm("Weet je zeker dat je deze stemronde wilt verwijderen?")) {
      return;
    }

    setDeletingId(sessionId);
    try {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await deleteVoteSession(sessionId, user.id);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch {
      alert("Verwijderen mislukt. Probeer het opnieuw.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Skeleton className="h-10 w-64" />
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mijn stemrondes</h1>
          <p className="mt-2 text-gray-500">
            Beheer je teambuilding stemrondes en volg de resultaten
          </p>
        </div>
        <Link
          href="/stemmen/nieuw"
          className="rounded-xl bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
        >
          Nieuwe stemronde
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-lg font-medium text-gray-800">
            Je hebt nog geen stemrondes aangemaakt
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Laat je team meestemmen over de perfecte teambuilding activiteit.
          </p>
          <Link
            href="/stemmen/nieuw"
            className="mt-6 inline-flex rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
          >
            Maak je eerste stemronde
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {sessions.map((session) => {
            const status = getVoteSessionStatus(session);
            const voteCount = voteCounts[session.id] ?? 0;

            return (
              <div
                key={session.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {session.company_name ?? "Stemronde"}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[status]}`}
                      >
                        {STATUS_LABELS[status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Aangemaakt door {session.creator_name ?? "jou"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                      {session.deadline && (
                        <span>
                          Deadline: {formatDeadlineNl(session.deadline)}
                        </span>
                      )}
                      <span>
                        {voteCount}{" "}
                        {voteCount === 1 ? "stem" : "stemmen"}
                      </span>
                      <span>{session.provider_ids.length} activiteiten</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/stemmen/${session.id}/resultaten`}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#1D9E75] hover:text-[#1D9E75]"
                    >
                      Bekijk resultaten
                    </Link>
                    <button
                      type="button"
                      onClick={() => copyLink(session.id)}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#1D9E75] hover:text-[#1D9E75]"
                    >
                      {copiedId === session.id ? "Gekopieerd!" : "Kopieer link"}
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === session.id}
                      onClick={() => handleDelete(session.id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === session.id ? "Bezig..." : "Verwijder"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
