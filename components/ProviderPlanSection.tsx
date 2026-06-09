"use client";

import Link from "next/link";

interface ProviderPlanSectionProps {
  onSelectBasis: () => void;
  onSelectPro: () => void;
}

export default function ProviderPlanSection({
  onSelectBasis,
  onSelectPro,
}: ProviderPlanSectionProps) {
  return (
    <section className="border-b border-gray-200 bg-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Kies je plan
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-500">
          Kies het plan dat bij jouw activiteit past
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="relative rounded-2xl border-2 border-[#1D9E75] bg-white p-8 shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1D9E75] px-3 py-0.5 text-xs font-semibold text-white">
              Meest gekozen
            </span>
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
              className="btn-primary mt-8 w-full rounded-xl border-2 border-[#1D9E75] py-3 text-sm font-semibold text-[#1D9E75] hover:bg-[#1D9E75]/5"
            >
              Kies Basis
            </button>
          </div>

          <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-white">
              Aanbevolen
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
              className="btn-primary mt-8 w-full rounded-xl bg-[#1D9E75] py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
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
