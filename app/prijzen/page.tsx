"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import { PLAN_DETAILS } from "@/lib/provider-plans";

const COMPARISON_ROWS = [
  { feature: "Aantal activiteiten", free: "1", pro: "1" },
  { feature: "Zichtbaar op kaart", free: "✓", pro: "✓" },
  { feature: "Featured plaatsing", free: "—", pro: "✓" },
  { feature: "AI prioriteit", free: "—", pro: "✓" },
  { feature: "Pro badge", free: "—", pro: "✓" },
  { feature: "Positie op kaart", free: "Standaard", pro: "Hoger" },
  { feature: "Analytics rapport", free: "Dashboard", pro: "Maandelijks" },
  { feature: "Aanvragen ontvangen", free: "✓", pro: "✓" },
];

const FAQ = [
  {
    q: "Wat is het verschil tussen Gratis en Pro?",
    a: "Beide plannen geven 1 activiteit. Pro biedt featured plaatsing, AI-prioriteit, een Pro badge en hogere zichtbaarheid op de kaart.",
  },
  {
    q: "Wat houdt Featured plaatsing in?",
    a: "Pro activiteiten verschijnen bovenaan zoekresultaten en krijgen prioriteit in AI-aanbevelingen.",
  },
  {
    q: "Kan ik op elk moment opzeggen?",
    a: "Ja, je kunt je Pro-abonnement maandelijks opzeggen via het dashboard.",
  },
  {
    q: "Hoe ontvang ik aanvragen?",
    a: "Bedrijven sturen aanvragen via Dagout.be. Je ontvangt een e-mail en ziet alles in je dashboard.",
  },
];

export default function PrijzenPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingPro, setLoadingPro] = useState(false);

  async function startProCheckout() {
    setLoadingPro(true);
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
        body: JSON.stringify({ plan: "pro" }),
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
      setLoadingPro(false);
    }
  }

  const plans = [
    { key: "free" as const },
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
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Eenvoudige prijzen
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Start gratis. Upgrade naar Pro wanneer je meer zichtbaarheid wilt.
          </p>
        </section>

        <section className="mx-auto grid max-w-4xl gap-8 px-6 pb-12 md:grid-cols-2">
          {plans.map(({ key }) => {
            const plan = PLAN_DETAILS[key];
            return (
              <div
                key={key}
                className={`flex flex-col rounded-xl border p-8 ${
                  key === "pro"
                    ? "border-[#1D9E75] bg-[#f0fdf4] shadow-md"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span className={`inline-block w-fit rounded-full px-3 py-0.5 text-xs font-semibold text-white ${plan.badgeClass}`}>
                  {plan.badge}
                </span>
                <h2 className="mt-4 text-2xl font-bold">{plan.label}</h2>
                <p className="mt-3 text-4xl font-extrabold text-gray-900">
                  {plan.price === 0 ? (
                    "Gratis"
                  ) : (
                    <>
                      €{plan.price}
                      <span className="text-lg font-normal text-gray-500">/maand</span>
                    </>
                  )}
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm text-gray-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="font-bold text-[#1D9E75]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {key === "free" ? (
                  <Link
                    href="/aanbieders/nieuw"
                    className="mt-8 block w-full rounded-lg border border-gray-200 py-3 text-center text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Start gratis
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={loadingPro}
                    onClick={startProCheckout}
                    className="mt-8 w-full rounded-lg bg-[#1D9E75] py-3 text-sm font-semibold text-white hover:bg-[#178a66] disabled:opacity-50"
                  >
                    {loadingPro ? "Laden..." : "Kies Pro"}
                  </button>
                )}
              </div>
            );
          })}
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-16">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
            Vergelijk de plannen
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-4 text-left font-semibold text-gray-900">Feature</th>
                  <th className="px-5 py-4 text-center font-semibold text-gray-900">Gratis</th>
                  <th className="px-5 py-4 text-center font-semibold text-[#1D9E75]">Pro</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3.5 text-gray-700">{row.feature}</td>
                    <td className="px-5 py-3.5 text-center text-gray-600">{row.free}</td>
                    <td className="px-5 py-3.5 text-center font-medium text-gray-900">{row.pro}</td>
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
