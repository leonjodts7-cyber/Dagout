import Link from "next/link";
import { resolveProvider } from "@/lib/providers";
import type { AiRecommendation } from "@/components/AiRecommendations";

interface AiResultCardsProps {
  recommendations: AiRecommendation[];
  summary?: string;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export default function AiResultCards({
  recommendations,
  summary,
  loading = false,
  error = null,
  emptyMessage = "Vul links een beschrijving in en vraag het aan onze AI.",
}: AiResultCardsProps) {
  if (loading) {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8">
        <div className="ai-loader mb-4" />
        <p className="text-sm font-medium text-gray-600">
          AI analyseert jullie wensen...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
        <p className="font-semibold text-amber-900">AI niet beschikbaar</p>
        <p className="mt-1 text-sm text-amber-800">{error}</p>
        <p className="mt-2 text-sm text-amber-700">
          Gebruik de filters hierboven om activiteiten te vinden.
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
        <p className="max-w-xs text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {summary && (
        <div className="rounded-xl bg-[#1D9E75]/10 px-5 py-4 lg:hidden">
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}
      {recommendations.map((rec) => {
        const provider = resolveProvider(rec.slug || rec.id);
        const slug = rec.slug || provider?.slug;

        return (
          <Link
            key={`${rec.id}-${rec.name}`}
            href={slug ? `/activiteit/${slug}` : "/zoeken"}
            className="block rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-[#1D9E75]/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-900">{rec.name}</h3>
              <span className="shrink-0 rounded-full bg-[#1D9E75]/10 px-2.5 py-0.5 text-xs font-bold text-[#1D9E75]">
                {rec.match_score}% match
              </span>
            </div>
            {provider && (
              <p className="mt-1 text-xs text-gray-400">
                {provider.city} &middot; &euro;{provider.price_from}/pers
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {rec.reason}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#1D9E75] transition-all duration-700"
                style={{ width: `${rec.match_score}%` }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
