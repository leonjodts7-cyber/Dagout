import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getCategoryStyle } from "@/lib/constants";

function premiumGradient(color: string): string {
  return `radial-gradient(at 30% 20%, ${color}dd 0%, ${color} 55%, #0f172a 100%)`;
}

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
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
              >
                <div
                  className="relative h-[150px]"
                  style={{ background: premiumGradient(style.color) }}
                >
                  <span className="absolute bottom-3 left-3 rounded bg-[#1D9E75] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Pro
                  </span>
                </div>
                <div className="p-3.5">
                  <p className="text-[15px] font-semibold text-[#111827]">
                    {provider.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#9ca3af]">
                    {provider.city} · {provider.category}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-[#1D9E75]">
                    Vanaf &euro;{provider.price_from}/pers
                  </p>
                  <span className="mt-2 inline-block text-[13px] font-semibold text-[#1D9E75] group-hover:underline">
                    Bekijk →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
