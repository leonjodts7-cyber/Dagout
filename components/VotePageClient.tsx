"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ConfettiBurst from "@/components/ConfettiBurst";
import { resolveProvider } from "@/lib/providers";
import { CATEGORY_IMAGES } from "@/lib/constants";
import {
  formatCountdown,
  formatDeadlineNl,
  getVoteSessionStatus,
  isDeadlinePassed,
} from "@/lib/voting-utils";
import {
  getVoteCounts,
  getVotesForSession,
  submitVote,
  type Vote,
  type VoteSession,
} from "@/lib/voting";

interface VotePageClientProps {
  session: VoteSession;
}

export default function VotePageClient({ session }: VotePageClientProps) {
  const router = useRouter();
  const [voterName, setVoterName] = useState("");
  const [votes, setVotes] = useState<Vote[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null
  );
  const [countdown, setCountdown] = useState("");
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const providers = useMemo(
    () =>
      session.provider_ids
        .map((id) => resolveProvider(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [session.provider_ids]
  );

  const sessionStatus = getVoteSessionStatus(session);
  const votingClosed = sessionStatus !== "actief";
  const voteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/stemmen/${session.id}`
      : "";

  useEffect(() => {
    getVotesForSession(session.id)
      .then(setVotes)
      .catch(() => {})
      .finally(() => setInitialLoading(false));
  }, [session.id]);

  useEffect(() => {
    if (!session.deadline) return;

    function updateCountdown() {
      if (isDeadlinePassed(session.deadline)) {
        setCountdown("");
        return;
      }
      setCountdown(formatCountdown(session.deadline!));
    }

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 60_000);
    return () => window.clearInterval(interval);
  }, [session.deadline]);

  useEffect(() => {
    if (session.closed) return;
    if (session.deadline && isDeadlinePassed(session.deadline)) {
      router.replace(`/stemmen/${session.id}/resultaten`);
    }
  }, [session.closed, session.deadline, session.id, router]);

  async function handleVote(providerId: string) {
    if (!voterName.trim()) {
      setError("Vul je naam in om te stemmen.");
      return;
    }
    if (votingClosed) {
      setError("Deze stemronde is gesloten.");
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedProviderId(providerId);

    try {
      await submitVote(session.id, providerId, voterName.trim());

      fetch("/api/votes/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          voterName: voterName.trim(),
          providerId,
        }),
      }).catch(() => {});

      const updated = await getVotesForSession(session.id);
      setVotes(updated);
      setHasVoted(true);
      setShowConfetti(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stemmen mislukt.");
    } finally {
      setLoading(false);
      setSelectedProviderId(null);
    }
  }

  async function copyLink() {
    if (!voteUrl) return;
    await navigator.clipboard.writeText(voteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const counts = getVoteCounts(votes, session.provider_ids);
  const maxCount = Math.max(...Object.values(counts), 1);
  const winnerId = Object.entries(counts).reduce<string | null>(
    (best, [id, count]) => {
      if (count === 0) return best;
      if (!best || count > (counts[best] ?? 0)) return id;
      return best;
    },
    null
  );

  const inputClass =
    "mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  if (initialLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="space-y-4">
          <div className="h-10 w-72 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (votingClosed && !hasVoted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-10">
          <h2 className="text-2xl font-bold text-gray-900">Stemronde gesloten</h2>
          <p className="mt-3 text-gray-600">
            Deze stemronde is niet meer open voor stemmen.
          </p>
          <Link
            href={`/stemmen/${session.id}/resultaten`}
            className="mt-6 inline-flex rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
          >
            Bekijk resultaten
          </Link>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <>
        <ConfettiBurst active={showConfetti} />
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl border border-[#1D9E75]/30 bg-[#1D9E75]/5 p-8 text-center">
            <div className="checkmark-animate mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1D9E75]/20">
              <svg
                className="h-8 w-8 text-[#1D9E75]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Bedankt voor je stem!
            </h2>
            <p className="mt-2 text-gray-600">
              Je stem is geregistreerd. Hieronder zie je de live stand van zaken.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Live resultaten
            </h3>
            {providers.map((provider) => {
              const count = counts[provider.id] ?? 0;
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const isWinner = provider.id === winnerId && count > 0;

              return (
                <div
                  key={provider.id}
                  className={`rounded-xl p-4 ${
                    isWinner
                      ? "border-2 border-[#1D9E75] bg-[#1D9E75]/5"
                      : "border border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      {provider.name}
                      {isWinner && (
                        <span className="ml-2 rounded-full bg-[#1D9E75] px-2 py-0.5 text-xs text-white">
                          Winnaar
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-[#1D9E75]">
                      {count} {count === 1 ? "stem" : "stemmen"}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#1D9E75] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              disabled
              className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-400"
            >
              Stem opnieuw
            </button>
            <Link
              href={`/stemmen/${session.id}/resultaten`}
              className="rounded-xl bg-[#1D9E75] px-6 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#178a66]"
            >
              Bekijk volledige resultaten
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-[#1D9E75]">
              Aangemaakt door {session.company_name ?? "jullie organisator"}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
              Stem op jullie favoriet
            </h1>
            {session.message && (
              <p className="mx-auto mt-4 max-w-xl rounded-xl bg-white px-5 py-4 text-sm leading-relaxed text-gray-600 shadow-sm sm:mx-0">
                {session.message}
              </p>
            )}
            {session.deadline && (
              <p className="mt-4 text-sm font-medium text-amber-700">
                Stemmen mogelijk tot {formatDeadlineNl(session.deadline)}
              </p>
            )}
            {countdown && (
              <p className="mt-2 text-sm font-semibold text-[#1D9E75]">
                {countdown}
              </p>
            )}
            <p className="mt-3 text-sm text-gray-500">
              {votes.length}{" "}
              {votes.length === 1
                ? "persoon heeft"
                : "personen hebben"}{" "}
              al gestemd
            </p>
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#1D9E75] hover:text-[#1D9E75]"
          >
            {copied ? "Link gekopieerd!" : "Deel stemlink"}
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <label htmlFor="voter-name" className="block text-sm font-medium text-gray-700">
          Jouw naam *
        </label>
        <input
          id="voter-name"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
          placeholder="Vul je naam in"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-8">
        {providers.map((provider) => {
          const imageUrl =
            provider.image_url ?? CATEGORY_IMAGES[provider.category] ?? null;

          return (
            <article
              key={provider.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {imageUrl && (
                <div className="relative h-52 w-full sm:h-64">
                  <Image
                    src={imageUrl}
                    alt={provider.name}
                    fill
                    className="object-cover"
                    sizes="768px"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {provider.name}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {provider.city} &middot; Vanaf &euro;{provider.price_from}/pers
                </p>
                <p className="mt-4 leading-relaxed text-gray-600">
                  {provider.description}
                </p>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVote(provider.id)}
                  className="mt-6 w-full rounded-xl bg-[#1D9E75] py-4 text-base font-semibold text-white transition-colors hover:bg-[#178a66] disabled:opacity-50"
                >
                  {loading && selectedProviderId === provider.id
                    ? "Stemmen..."
                    : "Stem op deze activiteit"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
