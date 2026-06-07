import { createBrowserSupabase } from "@/lib/supabase/client";

export interface SubmitInquiryPayload {
  listingId?: string | null;
  providerSlug?: string;
  providerName?: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  groupSize: number | null;
  preferredDate: string | null;
  message: string;
}

export async function submitInquiry(payload: SubmitInquiryPayload) {
  const supabase = createBrowserSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch("/api/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify({
      listingId: payload.listingId ?? null,
      providerSlug: payload.providerSlug ?? null,
      providerName: payload.providerName ?? null,
      contactName: payload.contactName,
      companyName: payload.companyName,
      email: payload.email,
      phone: payload.phone,
      groupSize: payload.groupSize,
      preferredDate: payload.preferredDate,
      message: payload.message,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Aanvraag versturen mislukt");
  }
}
