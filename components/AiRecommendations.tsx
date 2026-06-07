"use client";

import { useEffect, useState } from "react";
import AiResultCards from "@/components/AiResultCards";

export interface AiRecommendation {
  id: string;
  name: string;
  slug: string;
  reason: string;
  match_score: number;
}

interface AiRecommendationsProps {
  query: string;
  region: string;
}

export default function AiRecommendations({
  query,
  region,
}: AiRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>(
    []
  );
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setRecommendations([]);
      setSummary("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchRecommendations() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim(), region }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (data.fallback) {
          setError(data.error ?? "AI tijdelijk niet beschikbaar");
          setRecommendations([]);
          setSummary("");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.error ?? "AI-zoekfunctie tijdelijk niet beschikbaar"
          );
        }

        setRecommendations(
          (data.recommendations ?? []).map(
            (rec: {
              id: string;
              slug?: string;
              name: string;
              reason: string;
              match_score: number;
            }) => ({
              id: rec.id,
              slug: rec.slug ?? rec.id,
              name: rec.name,
              reason: rec.reason,
              match_score: rec.match_score,
            })
          )
        );
        setSummary(data.summary ?? "");
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error
            ? err.message
            : "AI is momenteel niet beschikbaar. Probeer het later opnieuw."
        );
        setRecommendations([]);
        setSummary("");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchRecommendations();
    return () => controller.abort();
  }, [query, region]);

  if (!query.trim()) return null;

  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-[#1D9E75]/30 bg-[#1D9E75] shadow-lg">
      <div className="px-6 py-5 text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">AI Aanbevelingen</h2>
        {summary && !loading && (
          <p className="mt-3 text-sm leading-relaxed text-white/90">{summary}</p>
        )}
        {!summary && (
          <p className="mt-2 text-sm text-white/80">
            Op basis van: &ldquo;{query}&rdquo;
            {region && ` in ${region}`}
          </p>
        )}
      </div>

      <div className="bg-white p-6">
        {loading && (
          <div className="flex items-center gap-4 rounded-xl bg-[#1D9E75]/5 px-5 py-4">
            <div className="ai-loader shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                AI is aan het zoeken...
              </p>
              <p className="text-xs text-gray-500">
                We analyseren groepsgrootte, regio, budget en type activiteit
              </p>
            </div>
          </div>
        )}

        {!loading && (
          <AiResultCards
            recommendations={recommendations}
            summary={summary}
            loading={false}
            error={error}
            emptyMessage="Geen AI-aanbevelingen gevonden. Bekijk de volledige lijst hieronder."
          />
        )}
      </div>
    </section>
  );
}
