"use client";

import Link from "next/link";
import { PLAN_DETAILS } from "@/lib/provider-plans";

interface ProviderPlanSectionProps {
  onSelectBasis: () => void;
  onSelectPro: () => void;
}

export default function ProviderPlanSection({
  onSelectBasis,
  onSelectPro,
}: ProviderPlanSectionProps) {
  const plans = [
    { key: "basis" as const, onSelect: onSelectBasis, highlighted: true },
    { key: "pro" as const, onSelect: onSelectPro, highlighted: false },
  ];

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
          {plans.map(({ key, onSelect, highlighted }) => {
            const plan = PLAN_DETAILS[key];
            return (
              <div
                key={key}
                className={`relative rounded-2xl bg-white p-8 ${
                  highlighted
                    ? "border-2 border-[#1D9E75] shadow-lg"
                    : "border border-gray-200 shadow-sm"
                }`}
              >
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-semibold text-white ${plan.badgeClass}`}
                >
                  {plan.badge}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{plan.label}</h3>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                  €{plan.price}
                  <span className="text-base font-normal text-gray-500">/maand</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={onSelect}
                  className={`btn-primary mt-8 w-full rounded-xl py-3 text-sm font-semibold ${
                    key === "pro"
                      ? "bg-[#1D9E75] text-white hover:bg-[#178a66]"
                      : "border-2 border-[#1D9E75] text-[#1D9E75] hover:bg-[#1D9E75]/5"
                  }`}
                >
                  Kies {plan.label}
                </button>
              </div>
            );
          })}
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
