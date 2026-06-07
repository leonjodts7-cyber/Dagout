"use client";

import { useState } from "react";

export default function DashboardProfile() {
  const [name, setName] = useState("Kayak Adventures Gent");
  const [description, setDescription] = useState(
    "Professionele kajaktochten in het hart van Gent."
  );
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div id="profiel" className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Profiel bewerken</h2>
      <p className="mt-1 text-sm text-gray-500">
        Werk uw bedrijfsprofiel en activiteiten bij
      </p>

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Bedrijfsnaam
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
          />
        </div>

        <div>
          <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
            Beschrijving
          </label>
          <textarea
            id="desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Foto&apos;s uploaden
          </label>
          <div className="mt-2 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 transition-colors hover:border-[#1D9E75]/50">
            <div className="text-center">
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                Sleep foto&apos;s hierheen of{" "}
                <label className="cursor-pointer font-medium text-[#1D9E75] hover:underline">
                  blader
                  <input type="file" accept="image/*" multiple className="hidden" />
                </label>
              </p>
              <p className="mt-1 text-xs text-gray-400">PNG, JPG tot 5 MB</p>
            </div>
          </div>
        </div>

        {saved && (
          <p className="text-sm font-medium text-[#1D9E75]">
            Profiel opgeslagen.
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-[#1D9E75] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#178a66]"
        >
          Wijzigingen opslaan
        </button>
      </form>
    </div>
  );
}
