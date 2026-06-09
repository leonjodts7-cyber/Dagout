"use client";

import Link from "next/link";
import { PLAN_DETAILS } from "@/lib/provider-plans";

interface ProviderPlanSectionProps {
  selectedPlan?: "basis" | "pro" | null;
  onSelectBasis: () => void;
  onSelectPro: () => void;
}

export default function ProviderPlanSection({
  selectedPlan,
  onSelectBasis,
  onSelectPro,
}: ProviderPlanSectionProps) {
  const plans = [
    { key: "basis" as const, onSelect: onSelectBasis },
    { key: "pro" as const, onSelect: onSelectPro },
  ];

  return (
    <section className="border-b border-gray-200 bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Kies je plan
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-500">
          Kies het plan dat bij jouw activiteit past
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {plans.map(({ key, onSelect }) => {
            const plan = PLAN_DETAILS[key];
            const isSelected = selectedPlan === key;
            return (
              <button
                key={key}
                type="button"
                onClick={onSelect}
                className={`relative rounded-2xl bg-white p-8 text-left transition-all ${
                  isSelected
                    ? "border-2 border-[#1D9E75] shadow-lg ring-2 ring-[#1D9E75]/20"
                    : "border-2 border-[#1D9E75]/40 shadow-sm hover:border-[#1D9E75] hover:shadow-md"
                } ${key === "pro" ? "bg-[#f0fdf4]" : ""}`}
              >
                {isSelected && (
                  <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#1D9E75] text-white">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <span className="inline-block rounded-full bg-[#1D9E75] px-3 py-0.5 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
                <h3 className="mt-4 text-xl font-bold text-gray-900">{plan.label}</h3>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                  €{plan.price}
                  <span className="text-base font-normal text-gray-500">/maand</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="text-[#1D9E75]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <span className="btn-primary mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#1D9E75] py-3 text-sm font-semibold text-white hover:bg-[#178a66]">
                  Kies {plan.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Meer details?{" "}
          <Link href="/prijzen" className="text-[#1D9E75] hover:underline">
            Bekijk vergelijking
          </Link>
        </p>
      </div>
    </section>
  );
}
