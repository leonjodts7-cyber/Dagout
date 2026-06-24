"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ProviderPlanSection from "@/components/ProviderPlanSection";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { translateFormError } from "@/lib/auth-errors";
import {
  LISTING_CATEGORIES,
  LISTING_REGIONS,
  DURATION_OPTIONS,
  FORM_STEPS,
  defaultFormData,
  type ListingFormData,
} from "@/lib/listing-types";

import { loadListingForEdit } from "@/lib/listing-edit";
import { getListingLimit, hasActivePlan } from "@/lib/provider-plans";
import type { DbProfile } from "@/lib/listing-types";

const LANGUAGE_OPTIONS = ["Nederlands", "Frans", "Engels", "Duits"];
const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ImagePreview {
  file: File;
  preview: string;
}

function validateListingForm(
  form: ListingFormData,
  newImageCount: number,
  existingImageCount: number,
  isEdit: boolean
): string | null {
  return validateListingStep(form, 6, newImageCount, existingImageCount, isEdit);
}

function validateListingStep(
  form: ListingFormData,
  stepIndex: number,
  newImageCount = 0,
  existingImageCount = 0,
  isEdit = false
): string | null {
  if (stepIndex >= 0) {
    if (!form.name.trim()) return "Vul een naam in voor je activiteit.";
    if (!form.category) return "Selecteer een categorie.";
    if (!form.shortDescription.trim()) return "Vul een korte beschrijving in.";
    if (form.shortDescription.length > 150) {
      return "Korte beschrijving mag maximaal 150 tekens bevatten.";
    }
    if (!form.fullDescription.trim()) return "Vul een volledige beschrijving in.";
  }
  if (stepIndex >= 1) {
    if (!form.companyName.trim()) return "Vul je bedrijfsnaam in.";
    if (!form.city.trim()) return "Vul een gemeente in.";
    if (!form.postalCode.trim()) return "Vul een postcode in.";
    if (!form.region) return "Selecteer een regio.";
    if (!form.contactEmail.trim()) return "Vul een e-mailadres in.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      return "Vul een geldig e-mailadres in.";
    }
  }
  if (stepIndex >= 2) {
    if (form.minPersons < 1) return "Minimum aantal personen moet minstens 1 zijn.";
    if (form.maxPersons < form.minPersons) {
      return "Maximum aantal personen mag niet lager zijn dan het minimum.";
    }
    if (!form.priceOnRequest && !form.priceFrom.trim()) {
      return "Vul een prijs per persoon in of vink 'prijs op aanvraag' aan.";
    }
  }
  if (stepIndex >= 5 && !isEdit && newImageCount === 0 && existingImageCount === 0) {
    return "Voeg minimaal één foto toe bij Media.";
  }
  return null;
}

function getVideoEmbed(url: string): string | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}

export default function NewListingForm({ listingId }: { listingId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = Boolean(listingId);
  const [form, setForm] = useState<ListingFormData>(defaultFormData());
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [includeInput, setIncludeInput] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planConfirmed, setPlanConfirmed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"basis" | "pro" | null>(null);
  const [userProfile, setUserProfile] = useState<DbProfile | null>(null);
  const [listingLoaded, setListingLoaded] = useState(!listingId);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    createBrowserSupabase()
      .auth.getUser()
      .then(async ({ data }) => {
        if (!data.user) {
          router.replace(
            `/inloggen?redirect=${isEdit ? `/dashboard/activiteit/${listingId}/bewerken` : "/aanbieders/nieuw"}`
          );
          return;
        }

        const supabase = createBrowserSupabase();
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();
        setUserProfile(profileData as DbProfile | null);
        if (hasActivePlan(profileData as DbProfile | null)) {
          setPlanConfirmed(true);
        }

        if (listingId) {
          const loaded = await loadListingForEdit(
            supabase,
            listingId,
            data.user.id
          );
          if (!loaded) {
            router.replace("/dashboard#activiteiten");
            return;
          }
          setForm(loaded.form);
          setExistingImageUrls(loaded.existingImageUrls);
        }

        setListingLoaded(true);
        setAuthChecked(true);
      });
  }, [router, listingId, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(
              entry.target as HTMLElement
            );
            if (idx >= 0) setActiveStep(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [authChecked, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    if (
      searchParams.get("pro") === "true" ||
      searchParams.get("basis") === "true"
    ) {
      setPlanConfirmed(true);
      setTimeout(() => {
        document.getElementById("listing-form")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [searchParams, isEdit]);

  async function startCheckout(plan: "basis" | "pro") {
    const supabase = createBrowserSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push(`/inloggen?redirect=/aanbieders/nieuw`);
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
    if (data.url) window.location.href = data.url;
  }

  function selectPlan(plan: "basis" | "pro") {
    setSelectedPlan(plan);
    void startCheckout(plan);
  }

  function removeExistingImage(url: string) {
    setExistingImageUrls((prev) => prev.filter((u) => u !== url));
  }

  function goToStep(stepIndex: number) {
    if (!isEdit && stepIndex > activeStep) {
      const stepError = validateListingStep(
        form,
        stepIndex - 1,
        images.length,
        existingImageUrls.length,
        isEdit
      );
      if (stepError) {
        setError(stepError);
        sectionRefs.current[activeStep]?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      setError(null);
    }
    sectionRefs.current[stepIndex]?.scrollIntoView({ behavior: "smooth" });
  }

  function updateForm<K extends keyof ListingFormData>(
    key: K,
    value: ListingFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles = Array.from(fileList).filter((f) => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > MAX_FILE_SIZE) {
        setError(`${f.name} is groter dan 5 MB.`);
        return false;
      }
      return true;
    });

    setImages((prev) => {
      const combined = [...prev];
      for (const file of newFiles) {
        if (combined.length >= MAX_IMAGES) break;
        combined.push({ file, preview: URL.createObjectURL(file) });
      }
      return combined;
    });
  }

  function removeImage(index: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      updateForm("tags", [...form.tags, tag]);
    }
    setTagInput("");
  }

  function addInclude() {
    const item = includeInput.trim();
    if (item && !form.includes.includes(item)) {
      updateForm("includes", [...form.includes, item]);
    }
    setIncludeInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const validationError = validateListingForm(
      form,
      images.length,
      existingImageUrls.length,
      isEdit
    );
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Je bent niet ingelogd.");

      if (!isEdit) {
        const { count } = await supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        const limit = getListingLimit(userProfile);
        if (limit === 0) {
          setError("Kies Basis of Pro om je activiteit te publiceren.");
          setLoading(false);
          return;
        }
        if ((count ?? 0) >= limit) {
          setError(
            "Je hebt al een actieve activiteit. Bewerk je bestaande activiteit in het dashboard."
          );
          setLoading(false);
          return;
        }
      }

      let targetListingId = listingId;

      if (isEdit && listingId) {
        const { error: updateError } = await supabase
          .from("listings")
          .update({
            name: form.name,
            category: form.category,
            short_description: form.shortDescription,
            full_description: form.fullDescription,
            indoor_outdoor: form.indoorOutdoor,
            company_name: form.companyName,
            street_address: form.streetAddress,
            city: form.city,
            postal_code: form.postalCode,
            region: form.region,
            website: form.website || null,
            phone: form.phone || null,
            contact_email: form.contactEmail || null,
            min_persons: form.minPersons,
            max_persons: form.maxPersons,
            duration: form.duration,
            price_from: form.priceOnRequest
              ? null
              : parseFloat(form.priceFrom) || null,
            price_on_request: form.priceOnRequest,
            video_url: form.videoUrl || null,
            certificates: form.certificates || null,
            languages: form.languages,
          })
          .eq("id", listingId)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        const { data: listing, error: insertError } = await supabase
          .from("listings")
          .insert({
            user_id: user.id,
            name: form.name,
            category: form.category,
            short_description: form.shortDescription,
            full_description: form.fullDescription,
            indoor_outdoor: form.indoorOutdoor,
            company_name: form.companyName,
            street_address: form.streetAddress,
            city: form.city,
            postal_code: form.postalCode,
            region: form.region,
            website: form.website || null,
            phone: form.phone || null,
            contact_email: form.contactEmail || null,
            min_persons: form.minPersons,
            max_persons: form.maxPersons,
            duration: form.duration,
            price_from: form.priceOnRequest
              ? null
              : parseFloat(form.priceFrom) || null,
            price_on_request: form.priceOnRequest,
            video_url: form.videoUrl || null,
            certificates: form.certificates || null,
            languages: form.languages,
            image_urls: [],
            status: "pending",
          })
          .select("id")
          .single();

        if (insertError || !listing) {
          throw insertError ?? new Error("Opslaan mislukt");
        }
        targetListingId = listing.id as string;
      }

      const imageUrls: string[] = [...existingImageUrls];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const ext = img.file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${targetListingId}/${i}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, img.file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(path);
        imageUrls.push(urlData.publicUrl);
      }

      if (targetListingId) {
        await supabase
          .from("listings")
          .update({ image_urls: imageUrls })
          .eq("id", targetListingId);

        await supabase
          .from("opening_hours")
          .delete()
          .eq("listing_id", targetListingId);
        const hoursRows = form.openingHours.map((h) => ({
          listing_id: targetListingId,
          day_of_week: h.dayOfWeek,
          is_closed: h.isClosed,
          time_from: h.isClosed ? null : h.timeFrom,
          time_to: h.isClosed ? null : h.timeTo,
        }));
        await supabase.from("opening_hours").insert(hoursRows);

        await supabase
          .from("listing_includes")
          .delete()
          .eq("listing_id", targetListingId);
        if (form.includes.length > 0) {
          await supabase.from("listing_includes").insert(
            form.includes.map((item, i) => ({
              listing_id: targetListingId,
              item,
              sort_order: i,
            }))
          );
        }

        await supabase
          .from("listing_tags")
          .delete()
          .eq("listing_id", targetListingId);
        if (form.tags.length > 0) {
          await supabase.from("listing_tags").insert(
            form.tags.map((tag) => ({ listing_id: targetListingId, tag }))
          );
        }
      }

      router.push(
        isEdit ? "/dashboard?success=updated#activiteiten" : "/dashboard?success=listing"
      );
    } catch (err) {
      setError(
        translateFormError(
          err instanceof Error ? err.message : "Indienen mislukt."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  if (!authChecked || !listingLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="ai-loader" />
      </div>
    );
  }

  const videoEmbed = form.videoUrl ? getVideoEmbed(form.videoUrl) : null;
  const inputClass =
    "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-20">
        <PageHeader
          breadcrumbs={
            isEdit
              ? [
                  { label: "Home", href: "/" },
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Activiteit bewerken" },
                ]
              : [
                  { label: "Home", href: "/" },
                  { label: "Voor aanbieders", href: "/aanbieders/nieuw" },
                  { label: "Nieuwe activiteit" },
                ]
          }
        />

        {!isEdit && (
          <section className="bg-[#0a2a1f] px-6 py-16 text-center text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Lijst je activiteit op Dagout
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-white/75">
              Bereik bedrijven die op zoek zijn naar teambuilding in Vlaanderen.
              Kies een plan en vul het formulier in — goedkeuring binnen 48 uur.
            </p>
          </section>
        )}

        {isEdit && (
          <section className="border-b border-gray-200 bg-white px-6 py-10">
            <h1 className="text-center text-3xl font-extrabold text-gray-900">
              Activiteit bewerken
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-500">
              Pas je activiteit aan en sla op. Wijzigingen worden opnieuw beoordeeld indien nodig.
            </p>
          </section>
        )}

        {!isEdit && (
          <ProviderPlanSection
            selectedPlan={selectedPlan}
            onSelectBasis={() => selectPlan("basis")}
            onSelectPro={() => selectPlan("pro")}
          />
        )}

        {!isEdit && planConfirmed && (
          <div className="border-b border-[#1D9E75]/20 bg-[#1D9E75]/5 px-6 py-3 text-center text-sm text-[#0a2a1f]">
            Plan geactiveerd — vul hieronder je activiteit in.
          </div>
        )}

        <div id="listing-form" className="scroll-mt-24">
        <div className="sticky top-[65px] z-20 border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "Activiteit bijwerken" : "Activiteit toevoegen"}
            </h2>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
              {FORM_STEPS.map((step, i) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => goToStep(i)}
                  className="flex shrink-0 flex-col items-center gap-1.5 px-2"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      activeStep === i
                        ? "bg-[#1D9E75] text-white shadow-md"
                        : activeStep > i
                          ? "bg-[#1D9E75]/20 text-[#1D9E75]"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      activeStep === i ? "text-[#1D9E75]" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl px-6 py-10">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Sectie 1 */}
          <section
            ref={(el) => {
              sectionRefs.current[0] = el;
            }}
            className="mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">1. Basisinfo</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Naam van de activiteit *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categorie *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecteer categorie</option>
                  {LISTING_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Korte beschrijving * (max 150 tekens)
                </label>
                <textarea
                  required
                  maxLength={150}
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => updateForm("shortDescription", e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {form.shortDescription.length}/150
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Volledige beschrijving
                </label>
                <textarea
                  rows={5}
                  value={form.fullDescription}
                  onChange={(e) => updateForm("fullDescription", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Locatie type
                </span>
                <div className="mt-2 flex flex-wrap gap-4">
                  {(
                    [
                      ["indoor", "Binnen"],
                      ["outdoor", "Buiten"],
                      ["both", "Beide"],
                    ] as const
                  ).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="indoorOutdoor"
                        checked={form.indoorOutdoor === val}
                        onChange={() => updateForm("indoorOutdoor", val)}
                        className="text-[#1D9E75] focus:ring-[#1D9E75]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sectie 2 */}
          <section
            ref={(el) => {
              sectionRefs.current[1] = el;
            }}
            className="mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">2. Locatie</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Bedrijfsnaam
                </label>
                <input
                  value={form.companyName}
                  onChange={(e) => updateForm("companyName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Straat en huisnummer
                </label>
                <input
                  value={form.streetAddress}
                  onChange={(e) => updateForm("streetAddress", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gemeente
                </label>
                <input
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postcode
                </label>
                <input
                  value={form.postalCode}
                  onChange={(e) => updateForm("postalCode", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Regio
                </label>
                <select
                  value={form.region}
                  onChange={(e) => updateForm("region", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecteer regio</option>
                  {LISTING_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website URL
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => updateForm("website", e.target.value)}
                  className={inputClass}
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefoonnummer
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-mail voor aanvragen
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => updateForm("contactEmail", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Sectie 3 */}
          <section
            ref={(el) => {
              sectionRefs.current[2] = el;
            }}
            className="mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              3. Details activiteit
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimaal aantal personen
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.minPersons}
                  onChange={(e) =>
                    updateForm("minPersons", parseInt(e.target.value, 10) || 1)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximaal aantal personen
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.maxPersons}
                  onChange={(e) =>
                    updateForm("maxPersons", parseInt(e.target.value, 10) || 1)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duur
                </label>
                <select
                  value={form.duration}
                  onChange={(e) => updateForm("duration", e.target.value)}
                  className={inputClass}
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.priceOnRequest}
                    onChange={(e) => updateForm("priceOnRequest", e.target.checked)}
                    className="rounded text-[#1D9E75]"
                  />
                  Prijs op aanvraag
                </label>
                {!form.priceOnRequest && (
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      €
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.priceFrom}
                      onChange={(e) => updateForm("priceFrom", e.target.value)}
                      className={`${inputClass} pl-8`}
                      placeholder="Prijs vanaf per persoon"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Sectie 4 */}
          <section
            ref={(el) => {
              sectionRefs.current[3] = el;
            }}
            className="mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">4. Openingsuren</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="pb-3 pr-4 font-medium">Dag</th>
                    <th className="pb-3 pr-4 font-medium">Gesloten</th>
                    <th className="pb-3 pr-4 font-medium">Van</th>
                    <th className="pb-3 font-medium">Tot</th>
                  </tr>
                </thead>
                <tbody>
                  {form.openingHours.map((row, i) => (
                    <tr key={row.dayOfWeek} className="border-b border-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">
                        {row.label}
                      </td>
                      <td className="py-3 pr-4">
                        <input
                          type="checkbox"
                          checked={row.isClosed}
                          onChange={(e) => {
                            const hours = [...form.openingHours];
                            hours[i] = { ...hours[i], isClosed: e.target.checked };
                            updateForm("openingHours", hours);
                          }}
                          className="rounded text-[#1D9E75]"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <input
                          type="time"
                          disabled={row.isClosed}
                          value={row.timeFrom}
                          onChange={(e) => {
                            const hours = [...form.openingHours];
                            hours[i] = { ...hours[i], timeFrom: e.target.value };
                            updateForm("openingHours", hours);
                          }}
                          className="rounded-lg border border-gray-200 px-2 py-1 disabled:opacity-40"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="time"
                          disabled={row.isClosed}
                          value={row.timeTo}
                          onChange={(e) => {
                            const hours = [...form.openingHours];
                            hours[i] = { ...hours[i], timeTo: e.target.value };
                            updateForm("openingHours", hours);
                          }}
                          className="rounded-lg border border-gray-200 px-2 py-1 disabled:opacity-40"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sectie 5 */}
          <section
            ref={(el) => {
              sectionRefs.current[4] = el;
            }}
            className="mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              5. Wat is inbegrepen
            </h2>
            <ul className="mt-4 space-y-2">
              {form.includes.map((item, i) => (
                <li
                  key={`${item}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 text-sm"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() =>
                      updateForm(
                        "includes",
                        form.includes.filter((_, idx) => idx !== i)
                      )
                    }
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Verwijderen"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <input
                value={includeInput}
                onChange={(e) => setIncludeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())}
                placeholder="bv. catering, parking, materiaal"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addInclude}
                className="shrink-0 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
                aria-label="Toevoegen"
              >
                +
              </button>
            </div>
          </section>

          {/* Sectie 6 */}
          <section
            ref={(el) => {
              sectionRefs.current[5] = el;
            }}
            className="mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              6. Foto&apos;s en video&apos;s
            </h2>
            {existingImageUrls.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Huidige foto&apos;s</p>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {existingImageUrls.map((url, i) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute right-1 top-1 rounded-full bg-black/50 px-1.5 text-xs text-white hover:bg-black/70"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10"
            >
              <p className="text-sm text-gray-600">
                Sleep foto&apos;s hierheen of{" "}
                <label className="cursor-pointer font-medium text-[#1D9E75] hover:underline">
                  blader
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Max {MAX_IMAGES} foto&apos;s, 5 MB per foto. Eerste foto = hoofdfoto.
              </p>
            </div>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {images.map((img, i) => (
                  <div key={img.preview} className="relative aspect-square overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.preview}
                      alt={`Preview ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-[#1D9E75] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Hoofdfoto
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/50 px-1.5 text-xs text-white hover:bg-black/70"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Video URL (YouTube of Vimeo)
              </label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => updateForm("videoUrl", e.target.value)}
                className={inputClass}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {videoEmbed && (
                <div className="mt-4 aspect-video overflow-hidden rounded-xl">
                  <iframe
                    src={videoEmbed}
                    className="h-full w-full"
                    allowFullScreen
                    title="Video preview"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Sectie 7 */}
          <section
            ref={(el) => {
              sectionRefs.current[6] = el;
            }}
            className="mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">7. Extra opties</h2>
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags (druk Enter om toe te voegen)
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-[#1D9E75]/10 px-3 py-1 text-xs font-medium text-[#1D9E75]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          updateForm(
                            "tags",
                            form.tags.filter((t) => t !== tag)
                          )
                        }
                        className="hover:text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="bv. gezinsvriendelijk, parkeren aanwezig"
                  className={`${inputClass} mt-2`}
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Talen gesproken
                </span>
                <div className="mt-2 flex flex-wrap gap-4">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <label key={lang} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.languages.includes(lang)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateForm("languages", [...form.languages, lang]);
                          } else {
                            updateForm(
                              "languages",
                              form.languages.filter((l) => l !== lang)
                            );
                          }
                        }}
                        className="rounded text-[#1D9E75]"
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Certificaten of keurmerken (optioneel)
                </label>
                <input
                  value={form.certificates}
                  onChange={(e) => updateForm("certificates", e.target.value)}
                  className={inputClass}
                  placeholder="bv. ISO 9001, VLABEL"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1D9E75] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#178a66] disabled:opacity-50"
            >
              {loading
                ? "Bezig met opslaan..."
                : isEdit
                  ? "Wijzigingen opslaan"
                  : "Activiteit indienen ter goedkeuring"}
            </button>
          </div>
        </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
