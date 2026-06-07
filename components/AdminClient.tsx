"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/admin";
import { useToast } from "@/components/ToastProvider";
import { TableSkeleton } from "@/components/ui/Skeleton";

type Tab = "listings" | "users" | "inquiries" | "settings";

interface AdminListing {
  id: string;
  name: string;
  category: string;
  region: string | null;
  status: string;
  created_at: string;
  rejection_reason: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
  } | null;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  listing_count: number;
}

interface AdminInquiry {
  id: string;
  company_name: string | null;
  contact_name: string | null;
  group_size: number | null;
  preferred_date: string | null;
  status: string;
  created_at: string;
  listings?: { name: string } | null;
  provider_name: string | null;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-600",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "In afwachting",
  active: "Actief",
  rejected: "Geweigerd",
  inactive: "Inactief",
};

export default function AdminClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("listings");
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [token, setToken] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailListing, setDetailListing] = useState<AdminListing | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !isAdminEmail(user.email)) {
        router.replace("/");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setToken(session?.access_token ?? "");
      setAuthReady(true);
    }
    checkAuth();
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (tab === "listings") {
        const res = await fetch(
          `/api/admin?tab=listings&status=${statusFilter}`,
          { headers }
        );
        const data = await res.json();
        setListings(data.listings ?? []);
      } else if (tab === "users") {
        const res = await fetch("/api/admin?tab=users", { headers });
        const data = await res.json();
        setUsers(data.users ?? []);
      } else if (tab === "inquiries") {
        const res = await fetch("/api/admin?tab=inquiries", { headers });
        const data = await res.json();
        setInquiries(data.inquiries ?? []);
      }
    } catch {
      toast("Gegevens laden mislukt", "error");
    } finally {
      setLoading(false);
    }
  }, [tab, token, statusFilter, toast]);

  useEffect(() => {
    if (authReady && token) fetchData();
  }, [authReady, token, fetchData]);

  async function patchListing(
    listingId: string,
    action: string,
    reason?: string
  ) {
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listingId, action, reason }),
    });

    if (!res.ok) {
      toast("Actie mislukt", "error");
      return;
    }

    toast(
      action === "approve"
        ? "Listing goedgekeurd"
        : action === "reject"
          ? "Listing geweigerd"
          : "Bijgewerkt"
    );
    setRejectModal(null);
    setRejectReason("");
    fetchData();
  }

  async function markHandled(inquiryId: string) {
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inquiryId, action: "mark_handled" }),
    });

    if (res.ok) {
      toast("Aanvraag gemarkeerd als behandeld");
      fetchData();
    }
  }

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="ai-loader" />
      </div>
    );
  }

  const navItems: { id: Tab; label: string }[] = [
    { id: "listings", label: "Listings" },
    { id: "users", label: "Gebruikers" },
    { id: "inquiries", label: "Aanvragen" },
    { id: "settings", label: "Instellingen" },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-56 shrink-0 bg-[#0a2a1f] md:block">
        <div className="border-b border-white/10 p-6">
          <p className="text-lg font-bold text-white">Dagout Admin</p>
        </div>
        <nav className="p-3">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                tab === id
                  ? "bg-[#1D9E75]/25 text-[#86efac]"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="border-b border-gray-200 bg-white px-4 py-4 md:px-8">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value as Tab)}
            className="mb-2 rounded-lg border border-gray-200 px-3 py-2 text-sm md:hidden"
          >
            {navItems.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <h1 className="text-xl font-bold capitalize text-gray-900">{tab}</h1>
        </header>

        <main className="p-4 md:p-8">
          {tab === "listings" && (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {["all", "pending", "active", "rejected"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      statusFilter === s
                        ? "bg-[#1D9E75] text-white"
                        : "bg-white text-gray-600 ring-1 ring-gray-200"
                    }`}
                  >
                    {s === "all" ? "Alle" : STATUS_LABEL[s]}
                  </button>
                ))}
              </div>

              {loading ? (
                <TableSkeleton />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="min-w-full text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Naam</th>
                        <th className="px-4 py-3">Aanbieder</th>
                        <th className="px-4 py-3">Categorie</th>
                        <th className="px-4 py-3">Regio</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Datum</th>
                        <th className="px-4 py-3">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {listings.map((l) => (
                        <tr key={l.id}>
                          <td className="px-4 py-3 font-medium">{l.name}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {(l.profiles?.company_name ||
                              `${l.profiles?.first_name ?? ""} ${l.profiles?.last_name ?? ""}`.trim()) ||
                              "—"}
                          </td>
                          <td className="px-4 py-3">{l.category}</td>
                          <td className="px-4 py-3">{l.region ?? "—"}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[l.status] ?? STATUS_BADGE.pending}`}
                            >
                              {STATUS_LABEL[l.status] ?? l.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(l.created_at).toLocaleDateString("nl-BE")}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {l.status === "pending" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => patchListing(l.id, "approve")}
                                    className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                                  >
                                    Goedkeuren
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRejectModal({ id: l.id, name: l.name })
                                    }
                                    className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                  >
                                    Weigeren
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => setDetailListing(l)}
                                className="rounded border border-gray-200 px-2 py-1 text-xs hover:border-[#1D9E75]"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {tab === "users" && (
            <>
              <input
                type="search"
                placeholder="Zoek op e-mail of naam..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="mb-4 w-full max-w-md rounded-xl border border-gray-200 px-4 py-2.5 text-sm md:w-80"
              />
              {loading ? (
                <TableSkeleton />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="min-w-full text-sm">
                    <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3">E-mail</th>
                        <th className="px-4 py-3">Naam</th>
                        <th className="px-4 py-3">Aangemaakt</th>
                        <th className="px-4 py-3">Listings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3">{u.name}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(u.created_at).toLocaleDateString("nl-BE")}
                          </td>
                          <td className="px-4 py-3">{u.listing_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {tab === "inquiries" && (
            loading ? (
              <TableSkeleton />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full text-sm">
                  <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Bedrijf</th>
                      <th className="px-4 py-3">Activiteit</th>
                      <th className="px-4 py-3">Groep</th>
                      <th className="px-4 py-3">Datum</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {inquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td className="px-4 py-3">
                          {inq.company_name ?? inq.contact_name ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          {inq.listings?.name ?? inq.provider_name ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          {inq.group_size ? `${inq.group_size} pers.` : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(inq.created_at).toLocaleDateString("nl-BE")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              inq.status === "handled"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-[#1D9E75]/10 text-[#1D9E75]"
                            }`}
                          >
                            {inq.status === "handled" ? "Behandeld" : "Nieuw"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {inq.status !== "handled" && (
                            <button
                              type="button"
                              onClick={() => markHandled(inq.id)}
                              className="rounded bg-[#1D9E75] px-2 py-1 text-xs text-white"
                            >
                              Behandeld
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {tab === "settings" && (
            <div className="max-w-lg rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="font-semibold text-gray-900">Admin instellingen</h2>
              <p className="mt-2 text-sm text-gray-500">
                Admin toegang: leon.jodts@gmail.com
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Resend: {process.env.NEXT_PUBLIC_HAS_RESEND ? "✓" : "Configureer RESEND_API_KEY"}</li>
                <li>Stripe: configureer STRIPE_* variabelen</li>
                <li>Service role: SUPABASE_SERVICE_ROLE_KEY vereist</li>
              </ul>
            </div>
          )}
        </main>
      </div>

      {rejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setRejectModal(null)}
            aria-label="Sluiten"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-bold">Listing weigeren</h3>
            <p className="mt-1 text-sm text-gray-500">{rejectModal.name}</p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reden voor weigering..."
              className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                className="flex-1 rounded-xl border py-2 text-sm"
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={() =>
                  patchListing(rejectModal.id, "reject", rejectReason)
                }
                className="flex-1 rounded-xl bg-red-600 py-2 text-sm text-white"
              >
                Weigeren
              </button>
            </div>
          </div>
        </div>
      )}

      {detailListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setDetailListing(null)}
            aria-label="Sluiten"
          />
          <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold">{detailListing.name}</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Categorie</dt>
                <dd>{detailListing.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Regio</dt>
                <dd>{detailListing.region ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd>{STATUS_LABEL[detailListing.status]}</dd>
              </div>
              {detailListing.rejection_reason && (
                <div>
                  <dt className="text-gray-500">Reden weigering</dt>
                  <dd className="mt-1 rounded bg-red-50 p-2">{detailListing.rejection_reason}</dd>
                </div>
              )}
            </dl>
            <button
              type="button"
              onClick={() => setDetailListing(null)}
              className="mt-6 w-full rounded-xl bg-gray-100 py-2 text-sm"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
