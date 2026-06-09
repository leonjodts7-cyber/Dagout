"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import { PLAN_DETAILS } from "@/lib/provider-plans";

const FAQ = [
  {
    q: "Wat is het verschil tussen Basis en Pro?",
    a: "Beide plannen geven 1 listing. Pro biedt featured plaatsing, AI-prioriteit, een Pro badge en hogere zichtbaarheid op de kaart.",
  },
  {
    q: "Wat houdt Featured plaatsing in?",
    a: "Pro listings verschijnen bovenaan zoekresultaten met een Featured badge en krijgen prioriteit in AI-aanbevelingen.",
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
    { key: "basis" as const, highlighted: true },
    { key: "pro" as const, highlighted: false },
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
        <section className="px-6 py-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Kies het plan dat bij jouw activiteit past
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Bereik meer bedrijven met Dagout.be
          </p>
        </section>

        <section className="mx-auto grid max-w-4xl gap-8 px-6 pb-16 md:grid-cols-2">
          {plans.map(({ key, highlighted }) => {
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
                <h2 className="text-xl font-bold">{plan.label}</h2>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                  €{plan.price}
                  <span className="text-base font-normal text-gray-500">/maand</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={loadingPlan === key}
                  onClick={() => startCheckout(key)}
                  className={`btn-primary mt-8 w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-50 ${
                    key === "pro"
                      ? "bg-[#1D9E75] text-white hover:bg-[#178a66]"
                      : "border-2 border-[#1D9E75] text-[#1D9E75] hover:bg-[#1D9E75]/5"
                  }`}
                >
                  {loadingPlan === key ? "Laden..." : `Kies ${plan.label}`}
                </button>
              </div>
            );
          })}
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
