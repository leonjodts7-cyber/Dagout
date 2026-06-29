"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";
import type { Provider } from "@/lib/types";

interface BookingCardProps {
  provider: Provider;
}

export default function BookingCard({ provider }: BookingCardProps) {
  const [groupSize, setGroupSize] = useState(provider.min_persons);
  const [preferredDate, setPreferredDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  function decreaseGroup() {
    setGroupSize((n) => Math.max(provider.min_persons, n - 1));
  }

  function increaseGroup() {
    setGroupSize((n) => Math.min(provider.max_persons, n + 1));
  }

  return (
    <>
      <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
        <p className="text-[28px] font-bold text-[#111827]">
          &euro;{provider.price_from}
        </p>
        <p className="text-[13px] text-gray-500">Per persoon</p>
        <p className="mt-2 text-sm text-gray-500">
          {provider.min_persons}–{provider.max_persons} personen
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Groepsgrootte
            </label>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={decreaseGroup}
                disabled={groupSize <= provider.min_persons}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-lg font-semibold text-gray-700 transition hover:border-[#1D9E75] hover:text-[#1D9E75] disabled:opacity-40"
                aria-label="Minder personen"
              >
                −
              </button>
              <span className="min-w-[3rem] text-center text-base font-semibold text-gray-900">
                {groupSize}
              </span>
              <button
                type="button"
                onClick={increaseGroup}
                disabled={groupSize >= provider.max_persons}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-lg font-semibold text-gray-700 transition hover:border-[#1D9E75] hover:text-[#1D9E75] disabled:opacity-40"
                aria-label="Meer personen"
              >
                +
              </button>
            </div>
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
            className="btn-primary w-full py-3.5 text-base"
          >
            Stuur aanvraag
          </button>
        </div>

        {provider.phone && (
          <p className="mt-4 text-center text-sm text-gray-500">
            Of bel direct:{" "}
            <a
              href={`tel:${provider.phone.replace(/\s/g, "")}`}
              className="font-medium text-[#1D9E75] hover:underline"
            >
              {provider.phone}
            </a>
          </p>
        )}

        <p className="mt-3 text-center text-xs text-gray-400">
          Geen betaling vereist. Vrijblijvende aanvraag.
        </p>
      </div>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        providerName={provider.name}
        listingId={provider.listing_id ?? null}
        providerSlug={provider.slug}
        defaultGroupSize={String(groupSize)}
        defaultPreferredDate={preferredDate}
      />
    </>
  );
}
