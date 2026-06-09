"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";

const FAQ = [
  {
    q: "Wat is het verschil tussen Basis en Pro?",
    a: "Basis biedt 1 listing met zichtbaarheid op de kaart. Pro geeft onbeperkt listings, featured plaatsing en AI prioriteit.",
  },
  {
    q: "Wat houdt Featured plaatsing in?",
    a: "Pro listings krijgen een Featured badge en hogere zichtbaarheid in zoekresultaten en AI-aanbevelingen.",
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
          <div className="relative rounded-2xl border-2 border-[#1D9E75] bg-white p-8 shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1D9E75] px-3 py-0.5 text-xs font-semibold text-white">
              Meest gekozen
            </span>
            <h2 className="text-xl font-bold">Basis</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              €14<span className="text-base font-normal text-gray-500">/maand</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>✓ 1 listing</li>
              <li>✓ Basis zichtbaarheid op kaart</li>
              <li>✓ Aanvragen ontvangen</li>
              <li>✓ Dashboard toegang</li>
            </ul>
            <button
              type="button"
              disabled={loadingPlan === "basis"}
              onClick={() => startCheckout("basis")}
              className="btn-primary mt-8 w-full rounded-xl border-2 border-[#1D9E75] py-3 text-sm font-semibold text-[#1D9E75] hover:bg-[#1D9E75]/5 disabled:opacity-50"
            >
              {loadingPlan === "basis" ? "Laden..." : "Kies Basis"}
            </button>
          </div>

          <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-white">
              Aanbevolen
            </span>
            <h2 className="text-xl font-bold">Pro</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              €19<span className="text-base font-normal text-gray-500">/maand</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>✓ Onbeperkt listings</li>
              <li>✓ Featured plaatsing bovenaan</li>
              <li>✓ AI prioriteit</li>
              <li>✓ Analytics</li>
              <li>✓ Pro badge</li>
            </ul>
            <button
              type="button"
              disabled={loadingPlan === "pro"}
              onClick={() => startCheckout("pro")}
              className="btn-primary mt-8 w-full rounded-xl bg-[#1D9E75] py-3 text-sm font-semibold text-white hover:bg-[#178a66] disabled:opacity-50"
            >
              {loadingPlan === "pro" ? "Laden..." : "Kies Pro"}
            </button>
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
