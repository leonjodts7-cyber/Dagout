"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resolveProvider } from "@/lib/providers";
import { formatBelgianDate } from "@/lib/date-format";
import {
  closeVoteSession,
  getVoteCounts,
  getVotesForSession,
  getWinnerProviderId,
  type Vote,
  type VoteSession,
} from "@/lib/voting";

interface VoteResultsClientProps {
  session: VoteSession;
}

export default function VoteResultsClient({ session }: VoteResultsClientProps) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [closed, setClosed] = useState(session.closed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getVotesForSession(session.id).then(setVotes).catch(() => {});
  }, [session.id]);

  const counts = getVoteCounts(votes, session.provider_ids);
  const winnerId = getWinnerProviderId(counts);
  const maxCount = Math.max(...Object.values(counts), 1);

  const providers = session.provider_ids
    .map((id) => ({
      id,
      provider: resolveProvider(id),
      count: counts[id] ?? 0,
      voters: votes
        .filter((v) => v.provider_id === id)
        .map((v) => v.voter_name),
    }))
    .filter((x) => x.provider)
    .sort((a, b) => b.count - a.count);

  async function handleCloseSession() {
    setLoading(true);
    setError(null);

    try {
      await closeVoteSession(session.id);
      setClosed(true);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stemronde sluiten mislukt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Resultaten stemronde
        </h1>
        <p className="mt-2 text-gray-500">
          {session.company_name} &middot; {votes.length}{" "}
          {votes.length === 1 ? "stem" : "stemmen"} ontvangen
        </p>
        {session.deadline && (
          <p className="mt-1 text-sm text-gray-400">
            Deadline: {formatBelgianDate(`${session.deadline}T12:00:00`)}
          </p>
        )}
      </div>

      <section className="space-y-6">
        {providers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Geen activiteiten in deze stemronde.
          </div>
        ) : (
          providers.map(({ id, provider, count, voters }) => {
            if (!provider) return null;
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const isWinner = id === winnerId && count > 0;

            return (
              <div
                key={id}
                className={`rounded-2xl bg-white p-6 shadow-sm ${
                  isWinner
                    ? "border-2 border-[#1D9E75]"
                    : "border border-gray-200"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {provider.name}
                      {isWinner && (
                        <span className="ml-2 rounded-full bg-[#1D9E75] px-2.5 py-0.5 text-xs font-semibold text-white">
                          Winnaar
                        </span>
                      )}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">{provider.city}</p>
                  </div>
                  <span className="text-2xl font-bold text-[#1D9E75]">
                    {count}
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isWinner ? "bg-[#1D9E75]" : "bg-[#1D9E75]/60"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Stemmers
                  </p>
                  {voters.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-400">
                      Nog geen stemmen voor deze activiteit.
                    </p>
                  ) : (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {voters.map((name) => (
                        <li
                          key={name}
                          className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-6 rounded-xl bg-[#1D9E75]/10 px-4 py-4 text-sm font-medium text-[#1D9E75]">
          De stemronde is gesloten. Er kunnen geen nieuwe stemmen meer worden
          uitgebracht.
        </p>
      )}

      {!closed && !success && (
        <button
          type="button"
          disabled={loading}
          onClick={handleCloseSession}
          className="mt-8 w-full rounded-xl border border-red-200 bg-white py-3.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          {loading ? "Bezig..." : "Sluit stemronde"}
        </button>
      )}

      {closed && !success && (
        <p className="mt-6 text-center text-sm text-gray-500">
          Deze stemronde is gesloten.
        </p>
      )}

      <div className="mt-8 text-center">
        <Link
          href={`/stemmen/${session.id}`}
          className="text-sm font-medium text-[#1D9E75] hover:underline"
        >
          Ga naar stempagina
        </Link>
      </div>
    </div>
  );
}
