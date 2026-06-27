import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getCategoryStyle } from "@/lib/constants";

interface PremiumProvidersProps {
  providers: Provider[];
}

export default function PremiumProviders({ providers }: PremiumProvidersProps) {
  return (
    <section className="bg-[#f9fafb] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#111827]">
            Premium aanbieders
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Verified en aanbevolen door Dagout
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((provider) => {
            const style = getCategoryStyle(provider.category);
            return (
              <Link
                key={provider.id}
                href={`/activiteit/${provider.slug}`}
                className="group overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
              >
                <div
                  className="relative h-[140px]"
                  style={{ backgroundColor: style.color }}
                >
                  <span className="absolute left-3 top-3 rounded bg-[#1D9E75] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Pro
                  </span>
                </div>
                <div className="p-3.5">
                  <p className="text-[15px] font-semibold text-[#111827]">
                    {provider.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#9ca3af]">
                    {provider.city}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-[#1D9E75]">
                    Vanaf &euro;{provider.price_from}/pers
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
