"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deletePlan, getPlans, type SavedPlan } from "@/lib/plans";
import { formatBelgianDate } from "@/lib/date-format";
import Spinner from "@/components/ui/Spinner";

function PlanTimeline({ plan }: { plan: SavedPlan }) {
  const items = plan.items ?? [];

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">Geen tijdlijn beschikbaar.</p>;
  }

  return (
    <ol className="relative space-y-4 border-l-2 border-[#1D9E75]/30 pl-6">
      {items.map((item, index) => (
        <li key={`${item.time}-${index}`} className="relative">
          <span className="absolute -left-[1.6rem] top-1 flex h-3 w-3 rounded-full bg-[#1D9E75]" />
          <p className="text-xs font-semibold text-[#1D9E75]">{item.time}</p>
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-500">
            {item.duration} min &middot; &euro;{item.price_per_person}/pers
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function PlanningClient() {
  const router = useRouter();
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/inloggen?redirect=/planning");
        return;
      }

      try {
        const data = await getPlans(user.id);
        setPlans(data);
        if (data[0]) setExpandedId(data[0].id);
      } catch {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // stil falen
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Planning" },
          ]}
        />
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Mijn planningen</h1>
            <Link
              href="/dagassistent"
              className="rounded-xl bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
            >
              Nieuwe planning maken
            </Link>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <Spinner className="h-8 w-8 text-[#1D9E75]" />
            </div>
          ) : plans.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-lg text-gray-600">
                Je hebt nog geen planningen opgeslagen.
              </p>
              <Link
                href="/dagassistent"
                className="mt-6 inline-block rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
              >
                Plan een dag met AI
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {plan.name ?? "Teambuilding dag"}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {plan.group_size ?? "?"} personen
                        {plan.total_budget != null &&
                          ` · Budget €${plan.total_budget}`}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatBelgianDate(plan.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expandedId === plan.id ? null : plan.id)
                        }
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-[#1D9E75] hover:text-[#1D9E75]"
                      >
                        {expandedId === plan.id ? "Verberg" : "Tijdlijn"}
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === plan.id}
                        onClick={() => handleDelete(plan.id)}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                      >
                        {deletingId === plan.id ? "..." : "Verwijder"}
                      </button>
                    </div>
                  </div>
                  {expandedId === plan.id && (
                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <PlanTimeline plan={plan} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
