"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";
import type { User } from "@supabase/supabase-js";
import type { DbInquiry, DbListing, DbProfile } from "@/lib/listing-types";
import { formatDateNl, slugify } from "@/lib/utils";
import { TOOLS_LINKS } from "@/lib/tools-constants";

type Section = "overzicht" | "activiteiten" | "aanvragen" | "profiel" | "tools";

const STATUS_LABELS: Record<string, string> = {
  pending: "In afwachting",
  active: "Actief",
  inactive: "Inactief",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-600",
};

const INQUIRY_STATUS_LABELS: Record<string, string> = {
  new: "Nieuw",
  handled: "Behandeld",
};

const INQUIRY_STATUS_COLORS: Record<string, string> = {
  new: "bg-[#1D9E75]/10 text-[#1D9E75]",
  handled: "bg-gray-100 text-gray-600",
};

function StatIcon({ type }: { type: "activities" | "inquiries" | "active" }) {
  const paths = {
    activities: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    inquiries: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    active: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D9E75]/10">
      <svg className="h-6 w-6 text-[#1D9E75]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
      </svg>
    </div>
  );
}

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [listings, setListings] = useState<DbListing[]>([]);
  const [inquiries, setInquiries] = useState<DbInquiry[]>([]);
  const [section, setSection] = useState<Section>("overzicht");
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<DbInquiry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    phone: "",
    website: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEscapeKey(() => setSelectedInquiry(null), Boolean(selectedInquiry));

  useEffect(() => {
    if (searchParams.get("success") === "listing") {
      setSuccessMsg(
        "Uw activiteit is ingediend en wacht op goedkeuring. We nemen contact op zodra deze live staat."
      );
    }
  }, [searchParams]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Section;
    if (["overzicht", "activiteiten", "aanvragen", "profiel", "tools"].includes(hash)) {
      setSection(hash);
    }
  }, []);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabase();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.replace("/inloggen?redirect=/dashboard");
        return;
      }

      setUser(authUser);

      const meta = authUser.user_metadata;
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      const p: DbProfile = profileData ?? {
        first_name: meta?.first_name ?? null,
        last_name: meta?.last_name ?? null,
        company_name: null,
        phone: null,
        website: null,
        is_provider: meta?.is_provider ?? false,
      };

      setProfile(p);
      setProfileForm({
        firstName: p.first_name ?? "",
        lastName: p.last_name ?? "",
        companyName: p.company_name ?? "",
        phone: p.phone ?? "",
        website: p.website ?? "",
      });

      const { data: listingData } = await supabase
        .from("listings")
        .select(
          "id, user_id, name, category, short_description, status, created_at, min_persons, max_persons, price_from, website"
        )
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      setListings((listingData as DbListing[]) ?? []);

      const listingIds = (listingData ?? []).map((l) => l.id);
      if (listingIds.length > 0) {
        const { data: inquiryData } = await supabase
          .from("inquiries")
          .select("*, listings(name)")
          .in("listing_id", listingIds)
          .order("created_at", { ascending: false });

        setInquiries((inquiryData as DbInquiry[]) ?? []);
      }

      setLoading(false);
    }

    load();
  }, [router]);

  async function handleLogout() {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const supabase = createBrowserSupabase();
    await supabase.from("profiles").upsert({
      id: user.id,
      first_name: profileForm.firstName,
      last_name: profileForm.lastName,
      company_name: profileForm.companyName,
      phone: profileForm.phone,
      website: profileForm.website,
      is_provider: true,
    });

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwordForm.newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Wachtwoord moet minstens 8 tekens bevatten." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: "error", text: "Wachtwoorden komen niet overeen." });
      return;
    }

    setPasswordLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });
      if (error) throw error;
      setPasswordForm({ newPassword: "", confirmPassword: "" });
      setPasswordMsg({ type: "success", text: "Wachtwoord succesvol gewijzigd." });
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Wachtwoord wijzigen mislukt.",
      });
    } finally {
      setPasswordLoading(false);
    }
  }

  async function deleteListing(id: string, name: string) {
    if (!confirm(`Weet u zeker dat u "${name}" wilt verwijderen?`)) return;

    setDeletingId(id);
    const supabase = createBrowserSupabase();
    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (!error) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      setInquiries((prev) => prev.filter((i) => i.listing_id !== id));
    }
    setDeletingId(null);
  }

  async function markInquiryHandled(inquiry: DbInquiry) {
    const supabase = createBrowserSupabase();
    const { error } = await supabase
      .from("inquiries")
      .update({ status: "handled" })
      .eq("id", inquiry.id);

    if (!error) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, status: "handled" } : i))
      );
      if (selectedInquiry?.id === inquiry.id) {
        setSelectedInquiry({ ...inquiry, status: "handled" });
      }
    }
  }

  function navigate(sectionId: Section) {
    setSection(sectionId);
    window.location.hash = sectionId;
  }

  const displayName =
    profile?.first_name ||
    user?.user_metadata?.first_name ||
    user?.email?.split("@")[0] ||
    "aanbieder";

  const openInquiries = inquiries.filter((i) => i.status !== "handled").length;
  const activeListings = listings.filter((l) => l.status === "active").length;
  const todayFormatted = formatDateNl();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="ai-loader" />
      </div>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  const navItems: { id: Section; label: string }[] = [
    { id: "overzicht", label: "Overzicht" },
    { id: "activiteiten", label: "Mijn activiteiten" },
    { id: "aanvragen", label: "Aanvragen" },
    { id: "tools", label: "Tools" },
    { id: "profiel", label: "Profiel" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 shrink-0 bg-[#0a2a1f] md:block">
        <div className="border-b border-white/10 p-6">
          <Link href="/" className="text-xl font-bold text-white">
            Dagout
          </Link>
          <p className="mt-1 text-xs text-white/60">Aanbieder portaal</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => navigate(id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    section === id
                      ? "bg-[#1D9E75]/25 text-[#86efac]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
            <li>
              <Link
                href="/dashboard/stemrondes"
                className="block w-full rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                Mijn stemrondes
              </Link>
            </li>
            <li className="pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
              >
                Uitloggen
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="border-b border-gray-200 bg-white px-6 py-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                {profile?.is_pro && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    Pro
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm capitalize text-gray-500">{todayFormatted}</p>
            </div>
            <div className="hidden gap-2 md:flex" />
          </div>
        </header>

        <main className="p-6 pb-24 md:p-8 md:pb-8">
          {successMsg && (
            <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
              {successMsg}
            </div>
          )}

          {section === "overzicht" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welkom terug, {displayName}
              </h2>
              <p className="mt-2 text-gray-600">
                Beheer uw activiteiten en volg binnenkomende aanvragen op.
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <StatIcon type="activities" />
                  <div>
                    <p className="text-sm text-gray-500">Activiteiten</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{listings.length}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <StatIcon type="inquiries" />
                  <div>
                    <p className="text-sm text-gray-500">Open aanvragen</p>
                    <p className="mt-1 text-3xl font-bold text-[#1D9E75]">{openInquiries}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <StatIcon type="active" />
                  <div>
                    <p className="text-sm text-gray-500">Actieve listings</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{activeListings}</p>
                  </div>
                </div>
              </div>

              {listings.length === 0 && (
                <div className="mt-10 rounded-2xl border border-dashed border-[#1D9E75]/30 bg-[#1D9E75]/5 p-10 text-center">
                  <p className="text-gray-600">
                    U heeft nog geen activiteiten gepubliceerd.
                  </p>
                  <Link
                    href="/aanbieders/nieuw"
                    className="mt-4 inline-flex rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#178a66]"
                  >
                    Voeg je eerste activiteit toe
                  </Link>
                </div>
              )}
            </div>
          )}

          {section === "activiteiten" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Mijn activiteiten</h2>
                <Link
                  href="/aanbieders/nieuw"
                  className="rounded-lg bg-[#1D9E75] px-4 py-2 text-sm font-medium text-white hover:bg-[#178a66]"
                >
                  Nieuwe activiteit toevoegen
                </Link>
              </div>

              {listings.length === 0 ? (
                <div className="mt-12 flex flex-col items-center py-16 text-center">
                  <svg
                    className="h-32 w-32 text-gray-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    Je hebt nog geen activiteiten
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Voeg uw eerste teambuilding activiteit toe en ontvang aanvragen van bedrijven.
                  </p>
                  <Link
                    href="/aanbieders/nieuw"
                    className="mt-6 rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
                  >
                    Voeg eerste activiteit toe
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{listing.name}</h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status]}`}
                          >
                            {STATUS_LABELS[listing.status]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{listing.category}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          Toegevoegd op{" "}
                          {new Date(listing.created_at).toLocaleDateString("nl-BE")}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href="/aanbieders/nieuw"
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-[#1D9E75] hover:text-[#1D9E75]"
                        >
                          Bewerken
                        </Link>
                        {listing.status === "active" && (
                          <a
                            href={`/activiteit/${slugify(listing.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-[#1D9E75] hover:text-[#1D9E75]"
                          >
                            Bekijk op site
                          </a>
                        )}
                        {listing.website && (
                          <a
                            href={listing.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-[#1D9E75] hover:text-[#1D9E75]"
                          >
                            Website
                          </a>
                        )}
                        <button
                          type="button"
                          disabled={deletingId === listing.id}
                          onClick={() => deleteListing(listing.id, listing.name)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === listing.id ? "..." : "Verwijderen"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "aanvragen" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Aanvragen</h2>
              {inquiries.length === 0 ? (
                <p className="mt-8 text-sm text-gray-500">
                  Geen aanvragen ontvangen voor uw activiteiten.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {inq.company_name ?? "Onbekend bedrijf"}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${INQUIRY_STATUS_COLORS[inq.status ?? "new"]}`}
                          >
                            {INQUIRY_STATUS_LABELS[inq.status ?? "new"]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {inq.contact_name ?? "Onbekende contactpersoon"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                          {inq.group_size && <span>{inq.group_size} personen</span>}
                          {inq.preferred_date && (
                            <span>
                              {new Date(inq.preferred_date).toLocaleDateString("nl-BE")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(inq)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-[#1D9E75] hover:text-[#1D9E75]"
                        >
                          Bekijk details
                        </button>
                        {inq.status !== "handled" && (
                          <button
                            type="button"
                            onClick={() => markInquiryHandled(inq)}
                            className="rounded-lg bg-[#1D9E75] px-3 py-2 text-sm font-medium text-white hover:bg-[#178a66]"
                          >
                            Markeer als behandeld
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "tools" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Tools</h2>
              <p className="mt-1 text-sm text-gray-500">
                Handige hulpmiddelen voor het plannen van uw teambuilding
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {TOOLS_LINKS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#1D9E75]/30 hover:shadow-md"
                  >
                    <h3 className="font-semibold text-gray-900">{tool.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-gray-500">{tool.description}</p>
                    <span className="mt-4 text-sm font-semibold text-[#1D9E75]">
                      Open tool &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {section === "profiel" && (
            <div className="max-w-xl">
              <h2 className="text-xl font-semibold text-gray-900">Profiel</h2>
              <p className="mt-1 text-sm text-gray-500">Pas uw bedrijfsgegevens aan</p>
              <form onSubmit={saveProfile} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Voornaam</label>
                    <input
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Achternaam</label>
                    <input
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm((f) => ({ ...f, lastName: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedrijfsnaam</label>
                  <input
                    value={profileForm.companyName}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, companyName: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefoon</label>
                  <input
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, website: e.target.value }))
                    }
                    placeholder="https://"
                    className={inputClass}
                  />
                </div>
                {profileSaved && (
                  <p className="text-sm font-medium text-[#1D9E75]">Profiel opgeslagen.</p>
                )}
                <button
                  type="submit"
                  className="rounded-lg bg-[#1D9E75] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#178a66]"
                >
                  Opslaan
                </button>
              </form>

              <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900">Wachtwoord wijzigen</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Kies een sterk wachtwoord van minstens 8 tekens
                </p>
                <form onSubmit={changePassword} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nieuw wachtwoord
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bevestig wachtwoord
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  {passwordMsg && (
                    <p
                      className={`text-sm ${passwordMsg.type === "error" ? "text-red-600" : "text-[#1D9E75]"}`}
                    >
                      {passwordMsg.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:border-[#1D9E75] hover:text-[#1D9E75] disabled:opacity-50"
                  >
                    {passwordLoading ? "Opslaan..." : "Wachtwoord wijzigen"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedInquiry(null)}
            aria-label="Sluiten"
          />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedInquiry(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              aria-label="Sluiten"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900">Aanvraagdetails</h2>
            <p className="mt-1 text-sm text-gray-500">
              {selectedInquiry.listings?.name ?? "Activiteit"}
            </p>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-gray-400">Bedrijf</dt>
                <dd className="font-medium text-gray-900">
                  {selectedInquiry.company_name ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Contactpersoon</dt>
                <dd className="font-medium text-gray-900">
                  {selectedInquiry.contact_name ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">E-mail</dt>
                <dd>{selectedInquiry.email}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Telefoon</dt>
                <dd>{selectedInquiry.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Groepsgrootte</dt>
                <dd>
                  {selectedInquiry.group_size
                    ? `${selectedInquiry.group_size} personen`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Gewenste datum</dt>
                <dd>
                  {selectedInquiry.preferred_date
                    ? new Date(selectedInquiry.preferred_date).toLocaleDateString("nl-BE")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Status</dt>
                <dd>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${INQUIRY_STATUS_COLORS[selectedInquiry.status ?? "new"]}`}
                  >
                    {INQUIRY_STATUS_LABELS[selectedInquiry.status ?? "new"]}
                  </span>
                </dd>
              </div>
              {selectedInquiry.message && (
                <div>
                  <dt className="text-gray-400">Bericht</dt>
                  <dd className="mt-1 rounded-lg bg-gray-50 p-3 text-gray-600">
                    {selectedInquiry.message}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-400">Ontvangen op</dt>
                <dd>
                  {new Date(selectedInquiry.created_at).toLocaleDateString("nl-BE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>
            </dl>
            {selectedInquiry.status !== "handled" && (
              <button
                type="button"
                onClick={() => markInquiryHandled(selectedInquiry)}
                className="mt-6 w-full rounded-xl bg-[#1D9E75] py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
              >
                Markeer als behandeld
              </button>
            )}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 bg-white md:hidden">
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => navigate(id)}
            className={`flex flex-1 flex-col items-center justify-center py-2 text-[10px] font-medium ${
              section === id ? "text-[#1D9E75]" : "text-gray-500"
            }`}
          >
            <span className="mb-0.5 h-1 w-1 rounded-full bg-current opacity-60" />
            {label.split(" ").slice(-1)[0]}
          </button>
        ))}
      </nav>
    </div>
  );
}
