"use client";

import { useMemo, useState } from "react";
import BudgetInquiryModal from "@/components/BudgetInquiryModal";
import { BUDGET_EXTRAS } from "@/lib/tools-constants";
import { generateBudgetPdf } from "@/lib/budget-pdf";
import type { Provider } from "@/lib/types";

interface BudgetCalculatorProps {
  activities: Provider[];
}

export default function BudgetCalculator({ activities }: BudgetCalculatorProps) {
  const [groupSize, setGroupSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedActivities = activities.filter((a) => selectedIds.includes(a.id));

  const activityTotal = useMemo(
    () => selectedActivities.reduce((sum, a) => sum + a.price_from * groupSize, 0),
    [selectedActivities, groupSize]
  );

  const extrasTotal = useMemo(
    () =>
      selectedExtras.reduce((sum, extraId) => {
        const extra = BUDGET_EXTRAS.find((e) => e.id === extraId);
        return sum + (extra ? extra.pricePerPerson * groupSize : 0);
      }, 0),
    [selectedExtras, groupSize]
  );

  const grandTotal = activityTotal + extrasTotal;

  const budgetSummary = useMemo(() => {
    const lines: string[] = [`Groepsgrootte: ${groupSize} personen`, ""];
    selectedActivities.forEach((a) => {
      lines.push(`${a.name}: €${a.price_from}/pers × ${groupSize} = €${(a.price_from * groupSize).toFixed(2)}`);
    });
    if (selectedExtras.length > 0) {
      lines.push("", "Extra's:");
      selectedExtras.forEach((id) => {
        const extra = BUDGET_EXTRAS.find((e) => e.id === id);
        if (extra) {
          lines.push(`${extra.label}: €${extra.pricePerPerson}/pers × ${groupSize} = €${(extra.pricePerPerson * groupSize).toFixed(2)}`);
        }
      });
    }
    lines.push("", `Totaal: €${grandTotal.toFixed(2)}`);
    return lines.join("\n");
  }, [groupSize, selectedActivities, selectedExtras, grandTotal]);

  function toggleActivity(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleExtra(id: string) {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handlePdf() {
    generateBudgetPdf({
      groupSize,
      activities: selectedActivities,
      extras: selectedExtras,
      activityTotal,
      extrasTotal,
      grandTotal,
    });
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Bereken het budget voor jullie teambuilding
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            Stel snel een indicatief budget samen op basis van groepsgrootte, activiteiten en extra&apos;s.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            {/* Stap 1 */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Stap 1 — Groepsgrootte
              </h2>
              <p className="mt-1 text-sm text-gray-500">Van 5 tot 200 personen</p>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aantal personen</span>
                  <span className="text-3xl font-bold text-[#1D9E75]">{groupSize}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={200}
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-[#1D9E75]"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>5</span>
                  <span>200</span>
                </div>
              </div>
            </section>

            {/* Stap 2 */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Stap 2 — Selecteer activiteiten
              </h2>
              <p className="mt-1 text-sm text-gray-500">Kies één of meerdere activiteiten</p>
              {activities.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  Nog geen activiteiten beschikbaar om te kiezen. Kom terug zodra er
                  aanbieders zijn aangesloten.
                </p>
              ) : (
              <div className="mt-4 space-y-3">
                {activities.map((activity) => (
                  <label
                    key={activity.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                      selectedIds.includes(activity.id)
                        ? "border-[#1D9E75] bg-[#1D9E75]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(activity.id)}
                      onChange={() => toggleActivity(activity.id)}
                      className="h-4 w-4 accent-[#1D9E75]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.name}</p>
                      <p className="text-sm text-gray-500">{activity.city}</p>
                    </div>
                    <span className="shrink-0 font-semibold text-[#1D9E75]">
                      €{activity.price_from}/pers
                    </span>
                  </label>
                ))}
              </div>
              )}
            </section>

            {/* Stap 3 */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Stap 3 — Extra opties
              </h2>
              <div className="mt-4 space-y-3">
                {BUDGET_EXTRAS.map((extra) => (
                  <label
                    key={extra.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                      selectedExtras.includes(extra.id)
                        ? "border-[#1D9E75] bg-[#1D9E75]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="h-4 w-4 accent-[#1D9E75]"
                    />
                    <span className="flex-1 font-medium text-gray-900">{extra.label}</span>
                    <span className="font-semibold text-[#1D9E75]">
                      +€{extra.pricePerPerson}/pers
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky summary */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">Kostenoverzicht</h2>
              <p className="text-sm text-gray-500">{groupSize} personen</p>

              <div className="mt-6 space-y-3 text-sm">
                {selectedActivities.length === 0 && selectedExtras.length === 0 ? (
                  <p className="text-gray-400">Selecteer activiteiten om een overzicht te zien.</p>
                ) : (
                  <>
                    {selectedActivities.map((a) => (
                      <div key={a.id} className="flex justify-between gap-2">
                        <span className="text-gray-600">{a.name}</span>
                        <span className="shrink-0 font-medium">
                          €{(a.price_from * groupSize).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {selectedExtras.length > 0 && (
                      <>
                        <div className="border-t border-gray-100 pt-2">
                          <p className="text-xs font-semibold uppercase text-gray-400">Extra&apos;s</p>
                        </div>
                        {selectedExtras.map((id) => {
                          const extra = BUDGET_EXTRAS.find((e) => e.id === id);
                          if (!extra) return null;
                          return (
                            <div key={id} className="flex justify-between gap-2">
                              <span className="text-gray-600">{extra.label}</span>
                              <span className="font-medium">
                                €{(extra.pricePerPerson * groupSize).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Totaal</span>
                  <span className="text-2xl font-bold text-[#1D9E75]">
                    €{grandTotal.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">Indicatief, excl. BTW</p>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  disabled={selectedActivities.length === 0}
                  onClick={() => setModalOpen(true)}
                  className="w-full rounded-xl bg-[#1D9E75] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#178a66] disabled:opacity-40"
                >
                  Stuur dit budget door naar aanbieders
                </button>
                <button
                  type="button"
                  disabled={selectedActivities.length === 0 && selectedExtras.length === 0}
                  onClick={handlePdf}
                  className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75] disabled:opacity-40"
                >
                  Sla budget op als PDF
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BudgetInquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        providers={selectedActivities}
        groupSize={groupSize}
        budgetSummary={budgetSummary}
      />
    </>
  );
}
