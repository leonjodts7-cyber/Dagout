"use client";

import Link from "next/link";

interface ProviderPlanSectionProps {
  onSelectFree: () => void;
  onSelectBasis: () => void;
  onSelectPro: () => void;
}

export default function ProviderPlanSection({
  onSelectFree,
  onSelectBasis,
  onSelectPro,
}: ProviderPlanSectionProps) {
  return (
    <section className="border-b border-gray-200 bg-white px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Kies je plan
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-500">
          Start gratis of kies een betaald plan voor meer zichtbaarheid.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">Gratis</h3>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              €0<span className="text-base font-normal text-gray-500">/maand</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>✓ 1 listing</li>
              <li>✓ Basis zichtbaarheid</li>
              <li>✓ Aanvragen ontvangen</li>
              <li>✓ Dashboard toegang</li>
            </ul>
            <button
              type="button"
              onClick={onSelectFree}
              className="mt-8 w-full rounded-xl border-2 border-[#1D9E75] py-3 text-sm font-semibold text-[#1D9E75] hover:bg-[#1D9E75]/5"
            >
              Start gratis
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">Basis</h3>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              €14<span className="text-base font-normal text-gray-500">/maand</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>✓ 1 listing</li>
              <li>✓ Basis zichtbaarheid op kaart</li>
              <li>✓ Aanvragen ontvangen</li>
              <li>✓ Dashboard toegang</li>
            </ul>
            <button
              type="button"
              onClick={onSelectBasis}
              className="mt-8 w-full rounded-xl border-2 border-gray-300 py-3 text-sm font-semibold text-gray-800 hover:border-[#1D9E75] hover:text-[#1D9E75]"
            >
              Kies Basis
            </button>
          </div>

          <div className="relative rounded-2xl border-2 border-[#1D9E75] bg-white p-8 shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1D9E75] px-3 py-0.5 text-xs font-semibold text-white">
              Populair
            </span>
            <h3 className="text-xl font-bold text-gray-900">Pro</h3>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              €19<span className="text-base font-normal text-gray-500">/maand</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>✓ Onbeperkt listings</li>
              <li>✓ Featured plaatsing bovenaan</li>
              <li>✓ AI prioriteit</li>
              <li>✓ Analytics</li>
              <li>✓ Pro badge</li>
            </ul>
            <button
              type="button"
              onClick={onSelectPro}
              className="mt-8 w-full rounded-xl bg-[#1D9E75] py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
            >
              Kies Pro
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Meer details over plannen?{" "}
          <Link href="/prijzen" className="text-[#1D9E75] hover:underline">
            Bekijk alle voordelen
          </Link>
        </p>
      </div>
    </section>
  );
}
