"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import { PLAN_DETAILS } from "@/lib/provider-plans";

const COMPARISON_ROWS = [
  { feature: "Aantal activiteiten", basis: "1", pro: "1" },
  { feature: "Zichtbaar op kaart", basis: "✓", pro: "✓" },
  { feature: "Featured plaatsing", basis: "—", pro: "✓" },
  { feature: "AI prioriteit", basis: "—", pro: "✓" },
  { feature: "Pro badge", basis: "—", pro: "✓" },
  { feature: "Positie op kaart", basis: "Basis", pro: "Hoger" },
  { feature: "Analytics rapport", basis: "Dashboard", pro: "Maandelijks" },
  { feature: "Aanvragen ontvangen", basis: "✓", pro: "✓" },
];

const FAQ = [
  {
    q: "Wat is het verschil tussen Basis en Pro?",
    a: "Beide plannen geven 1 activiteit. Pro biedt featured plaatsing, AI-prioriteit, een Pro badge en hogere zichtbaarheid op de kaart.",
  },
  {
    q: "Wat houdt Featured plaatsing in?",
    a: "Pro activiteiten verschijnen bovenaan zoekresultaten met een Pro badge en krijgen prioriteit in AI-aanbevelingen.",
  },
  {
    q: "Kan ik op elk moment opzeggen?",
    a: "Ja, je kunt je abonnement maandelijks opzeggen via het dashboard.",
  },
  {
    q: "Hoe ontvang ik aanvragen?",
    a: "Bedrijven sturen aanvragen via Dagout.be. Je ontvangt een e-mail en ziet alles in je dashboard.",
  },
];

export default function PrijzenPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<"basis" | "pro" | null>(null);

  async function startCheckout(plan: "basis" | "pro") {
    setLoadingPlan(plan);
    try {
      const supabase = createBrowserSupabase();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push(`/inloggen?redirect=/prijzen`);
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data.code === "STRIPE_NOT_CONFIGURED") {
        toast("Betalingen nog niet geconfigureerd", "info");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast(data.error ?? "Checkout mislukt", "error");
      }
    } catch {
      toast("Checkout mislukt", "error");
    } finally {
      setLoadingPlan(null);
    }
  }

  const plans = [
    { key: "basis" as const },
    { key: "pro" as const },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Prijzen" },
          ]}
        />
        <section className="px-6 py-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Kies het plan dat bij jouw activiteit past
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Bereik meer bedrijven met Dagout.be
          </p>
        </section>

        <section className="mx-auto grid max-w-5xl gap-8 px-6 pb-12 md:grid-cols-2">
          {plans.map(({ key }) => {
            const plan = PLAN_DETAILS[key];
            return (
              <div
                key={key}
                className={`relative flex min-h-[520px] flex-col rounded-2xl border-2 border-[#1D9E75] p-8 shadow-lg ${
                  key === "pro" ? "bg-[#f0fdf4]" : "bg-white"
                }`}
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1D9E75] px-4 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
                <h2 className="text-2xl font-bold">{plan.label}</h2>
                <p className="mt-3 text-4xl font-extrabold text-gray-900">
                  €{plan.price}
                  <span className="text-lg font-normal text-gray-500">/maand</span>
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm text-gray-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="font-bold text-[#1D9E75]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={loadingPlan === key}
                  onClick={() => startCheckout(key)}
                  className="btn-primary mt-8 w-full rounded-xl bg-[#1D9E75] py-3.5 text-sm font-semibold text-white hover:bg-[#178a66] disabled:opacity-50"
                >
                  {loadingPlan === key ? "Laden..." : `Kies ${plan.label}`}
                </button>
              </div>
            );
          })}
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-16">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
            Vergelijk de plannen
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-4 text-left font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-gray-900">
                    Basis
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-[#1D9E75]">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3.5 text-gray-700">{row.feature}</td>
                    <td className="px-5 py-3.5 text-center text-gray-600">{row.basis}</td>
                    <td className="px-5 py-3.5 text-center font-medium text-gray-900">
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-white px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Veelgestelde vragen
            </h2>
            <dl className="mt-8 space-y-6">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <dt className="font-semibold text-gray-900">{item.q}</dt>
                  <dd className="mt-1 text-sm text-gray-600">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
