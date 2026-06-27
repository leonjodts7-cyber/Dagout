import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getCategoryStyle } from "@/lib/constants";
import CategoryIcon, { resolveCategorySlug } from "@/components/CategoryIcon";

const NEW_PROVIDER_IDS = new Set(["7", "8", "11", "12"]);

function isNewListing(provider: Provider): boolean {
  return NEW_PROVIDER_IDS.has(provider.id);
}

function CrownIcon() {
  return (
    <svg
      className="h-4 w-4 text-amber-300"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M2 19h20v2H2v-2zm2-4l3-7 3 4 4-8 4 8 3-4 3 7H4z" />
    </svg>
  );
}

interface HomeActivityCardProps {
  provider: Provider;
}

export default function HomeActivityCard({ provider }: HomeActivityCardProps) {
  const style = getCategoryStyle(provider.category);
  const slug = resolveCategorySlug(provider.category);
  const isPro = provider.featured;
  const isNew = !isPro && isNewListing(provider);

  return (
    <Link
      href={`/activiteit/${provider.slug}`}
      className="group block cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
    >
      <div
        className="relative flex h-[200px] items-end p-6"
        style={{ backgroundColor: style.color }}
      >
        <div className="pointer-events-none absolute bottom-4 right-4 opacity-[0.15]">
          <CategoryIcon slug={slug} className="h-16 w-16" />
        </div>

        {isPro && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/25"
              title="Pro listing"
            >
              <CrownIcon />
            </span>
            <span className="rounded bg-[#f59e0b] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#78350f]">
              Gesponsord
            </span>
          </div>
        )}

        {isNew && (
          <span className="absolute right-3 top-3 rounded bg-[#1D9E75] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Nieuw
          </span>
        )}
      </div>

      <div className="bg-white p-4">
        <h3 className="text-base font-semibold text-[#111827]">
          {provider.name}
        </h3>
        <p className="mt-1 text-sm text-[#9ca3af]">{provider.city}</p>
        <p className="mt-2 text-[15px] font-semibold text-[#1D9E75]">
          Vanaf &euro;{provider.price_from}/pers
        </p>
      </div>
    </Link>
  );
}
