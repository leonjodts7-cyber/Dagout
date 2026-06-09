"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";
import type { Provider } from "@/lib/types";

interface BookingCardProps {
  provider: Provider;
}

export default function BookingCard({ provider }: BookingCardProps) {
  const [groupSize, setGroupSize] = useState(String(provider.min_persons));
  const [preferredDate, setPreferredDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  return (
    <>
      <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
        <p className="text-3xl font-bold text-gray-900">
          Vanaf{" "}
          <span className="text-[#1D9E75]">&euro;{provider.price_from}</span>
          <span className="text-lg font-normal text-gray-500">/pers</span>
        </p>
        <p className="mt-1 text-sm text-amber-500">{provider.rating} ★ beoordeling</p>
        <p className="mt-2 text-sm text-gray-500">
          {provider.min_persons}–{provider.max_persons} personen
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="persons" className="block text-sm font-medium text-gray-700">
              Groepsgrootte
            </label>
            <select
              id="persons"
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              className={inputClass}
            >
              {Array.from(
                { length: provider.max_persons - provider.min_persons + 1 },
                (_, i) => provider.min_persons + i
              ).map((n) => (
                <option key={n} value={n}>
                  {n} personen
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Gewenste datum
            </label>
            <input
              id="date"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full rounded-xl bg-[#1D9E75] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#178a66]"
          >
            Stuur aanvraag
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Geen betaling vereist. Vrijblijvende aanvraag.
        </p>
      </div>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        providerName={provider.name}
        listingId={provider.listing_id ?? null}
        providerSlug={provider.slug}
        defaultGroupSize={groupSize}
        defaultPreferredDate={preferredDate}
      />
    </>
  );
}
