"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useFormPersistence } from "@/lib/hooks/useFormPersistence";
import { MOCK_PROVIDERS } from "@/lib/providers";
import { CATEGORY_IMAGES } from "@/lib/constants";
import {
  createVoteSession,
  generateSessionId,
} from "@/lib/voting";
import type { Provider } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

const FILTER_CHIPS = [
  "Alle",
  "Kajakken",
  "Escape Room",
  "Kookworkshop",
  "Lasergame",
  "Outdoor",
  "Wellness",
] as const;

const STEP_LABELS = ["Activiteiten kiezen", "Details invullen", "Stemlink klaar"];

function formatDeadline(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ActivitySelectCard({
  provider,
  selected,
  onToggle,
  disabled,
}: {
  provider: Provider;
  selected: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  const imageUrl =
    provider.image_url ?? CATEGORY_IMAGES[provider.category] ?? null;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative overflow-hidden rounded-2xl border-2 bg-white text-left transition-all ${
        selected
          ? "border-[#1D9E75] shadow-md ring-2 ring-[#1D9E75]/20"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      {selected && (
        <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#1D9E75] text-white shadow-md">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}

      <div className="relative aspect-[4/3] w-full">
        {imageUrl ? (
          <Image src={imageUrl} alt={provider.name} fill className="object-cover" sizes="(max-width:640px) 100vw, 50vw" />
        ) : (
          <div className="h-full bg-[#1D9E75]/10" />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{provider.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{provider.city}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {provider.category}
          </span>
          <span className="text-sm font-bold text-[#1D9E75]">
            &euro;{provider.price_from}/pers
          </span>
        </div>
      </div>
    </button>
  );
}

export default function CreateVoteSessionForm({
  preselectId,
}: {
  preselectId?: string;
}) {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Alle");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [creatorName, setCreatorName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formState = {
    creatorName,
    companyName,
    deadline,
    message,
  };

  useFormPersistence(
    "dagout-vote-session-form",
    formState,
    (saved) => {
      setCreatorName(saved.creatorName);
      setCompanyName(saved.companyName);
      setDeadline(saved.deadline);
      setMessage(saved.message);
    },
    Boolean(user)
  );

  useEffect(() => {
    async function checkAuth() {
      const supabase = createBrowserSupabase();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser);
      setAuthLoading(false);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!preselectId || selectedIds.length > 0) return;
    const exists = MOCK_PROVIDERS.some(
      (p) => p.id === preselectId && p.active
    );
    if (exists) {
      setSelectedIds([preselectId]);
    }
  }, [preselectId, selectedIds.length]);

  const activities = MOCK_PROVIDERS.filter((p) => p.active);

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activities.filter((p) => {
      const matchesCategory =
        categoryFilter === "Alle" || p.category === categoryFilter;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activities, searchQuery, categoryFilter]);

  const selectedProviders = activities.filter((p) =>
    selectedIds.includes(p.id)
  );

  const voteUrl =
    typeof window !== "undefined" && sessionId
      ? `${window.location.origin}/stemmen/${sessionId}`
      : "";

  const resultsUrl =
    typeof window !== "undefined" && sessionId
      ? `${window.location.origin}/stemmen/${sessionId}/resultaten`
      : "";

  function toggleProvider(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  }

  async function handleCreate() {
    if (selectedIds.length < 2) {
      setError("Selecteer minstens 2 activiteiten.");
      return;
    }
    if (!creatorName.trim() || !companyName.trim()) {
      setError("Vul je naam en bedrijfsnaam in.");
      return;
    }
    if (!deadline) {
      setError("Kies een deadline voor het stemmen.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!user) {
        router.push("/inloggen?redirect=/stemmen/nieuw");
        return;
      }

      const id = generateSessionId();
      await createVoteSession({
        id,
        creatorUserId: user.id,
        creatorName: creatorName.trim(),
        companyName: companyName.trim(),
        message: message.trim(),
        deadline,
        providerIds: selectedIds,
      });
      localStorage.removeItem("dagout-vote-session-form");
      setSessionId(id);
      setStep(3);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Stemronde aanmaken mislukt."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!voteUrl) return;
    await navigator.clipboard.writeText(voteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  const minDate = new Date().toISOString().split("T")[0];

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="space-y-4">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Log in om een stemronde aan te maken
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Maak een account aan of log in om je team een stemlink te sturen.
          </p>
          <Link
            href="/inloggen?redirect=/stemmen/nieuw"
            className="mt-6 inline-flex rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
          >
            Inloggen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Laat je team meestemmen
        </h1>
        <p className="mt-2 text-gray-500">
          Kies activiteiten, vul de details in en deel de stemlink met je team
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-10 flex items-center justify-center">
        {[1, 2, 3].map((s, index) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step >= s
                    ? "bg-[#1D9E75] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              <span
                className={`mt-2 hidden text-xs font-medium sm:block ${
                  step >= s ? "text-[#1D9E75]" : "text-gray-400"
                }`}
              >
                {STEP_LABELS[s - 1]}
              </span>
            </div>
            {index < 2 && (
              <div
                className={`mx-3 h-0.5 w-12 sm:w-20 ${
                  step > s ? "bg-[#1D9E75]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <section>
          <div className="mb-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek op naam, categorie of stad..."
              className={inputClass}
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setCategoryFilter(chip)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  categoryFilter === chip
                    ? "bg-[#1D9E75] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          <p className="mb-4 text-sm font-medium text-gray-700">
            {selectedIds.length} van 5 geselecteerd
            {selectedIds.length < 2 && (
              <span className="ml-2 text-gray-400">(minimaal 2)</span>
            )}
          </p>

          {filteredActivities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              Geen activiteiten gevonden. Pas je zoekopdracht of filter aan.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredActivities.map((provider) => {
                const selected = selectedIds.includes(provider.id);
                const atMax = selectedIds.length >= 5 && !selected;
                return (
                  <ActivitySelectCard
                    key={provider.id}
                    provider={provider}
                    selected={selected}
                    onToggle={() => toggleProvider(provider.id)}
                    disabled={atMax}
                  />
                );
              })}
            </div>
          )}

          <button
            type="button"
            disabled={selectedIds.length < 2}
            onClick={() => setStep(2)}
            className="mt-8 w-full rounded-xl bg-[#1D9E75] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#178a66] disabled:opacity-40"
          >
            Volgende stap &rarr;
          </button>
        </section>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Stap 2 — Details invullen
          </h2>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jouw naam *
              </label>
              <input
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className={inputClass}
                placeholder="Je volledige naam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bedrijfsnaam *
              </label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
                placeholder="Naam van je bedrijf"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deadline voor stemmen *
              </label>
              <input
                type="date"
                min={minDate}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Optioneel bericht aan het team
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="bv. Stem vóór vrijdag op jullie favoriete activiteit!"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">
              Geselecteerde activiteiten ({selectedProviders.length})
            </p>
            <ul className="mt-3 space-y-2">
              {selectedProviders.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/10 text-[#1D9E75]">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {p.name} &middot; {p.city}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              &larr; Vorige stap
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleCreate}
              className="flex-1 rounded-xl bg-[#1D9E75] py-3 text-sm font-semibold text-white hover:bg-[#178a66] disabled:opacity-50"
            >
              {loading ? "Bezig..." : "Genereer stemlink →"}
            </button>
          </div>
        </section>
      )}

      {/* Step 3 */}
      {step === 3 && sessionId && (
        <section className="rounded-2xl border border-[#1D9E75]/30 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="checkmark-animate mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1D9E75]/10">
              <svg
                className="h-10 w-10 text-[#1D9E75]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Jullie stemlink is klaar
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Deel deze link met je team zodat iedereen kan stemmen
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <input
              readOnly
              value={voteUrl}
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
            />
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 rounded-lg bg-[#1D9E75] px-4 py-2 text-sm font-semibold text-white hover:bg-[#178a66]"
            >
              {copied ? "Gekopieerd!" : "Kopieer"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:?subject=${encodeURIComponent(`Stem mee voor onze teambuilding — ${companyName}`)}&body=${encodeURIComponent(`Hoi team,\n\nStem op jullie favoriete teambuilding activiteit via deze link:\n${voteUrl}\n\nDeadline: ${deadline ? formatDeadline(deadline) : ""}\n\n${message ? message + "\n\n" : ""}Groet,\n${creatorName}`)}`}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75]"
            >
              Deel via email
            </a>
            <Link
              href={resultsUrl}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75]"
            >
              Bekijk resultaten
            </Link>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <p className="text-sm font-medium text-gray-700">
              Geselecteerde activiteiten
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {selectedProviders.map((p) => {
                const imageUrl =
                  p.image_url ?? CATEGORY_IMAGES[p.category] ?? null;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                  >
                    {imageUrl && (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.city} &middot; &euro;{p.price_from}/pers
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
