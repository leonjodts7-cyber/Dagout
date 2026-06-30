import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getProviderBySlugUnified } from "@/lib/providers-unified";
import {
  sendInquiryConfirmation,
  sendInquiryToProvider,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const contactName = String(body.contactName ?? "").trim();
    const email = String(body.email ?? "").trim();
    if (!contactName || !email) {
      return NextResponse.json(
        { error: "Naam en e-mail zijn verplicht" },
        { status: 400 }
      );
    }

    const activityName =
      body.providerName ??
      body.activityName ??
      "Teambuilding activiteit";

    let providerEmail: string | null = null;

    if (body.listingId) {
      const admin = getSupabaseAdmin();
      const { data: listing } = await admin
        .from("listings")
        .select("contact_email, name, user_id")
        .eq("id", body.listingId)
        .maybeSingle();

      providerEmail = listing?.contact_email ?? null;

      if (!providerEmail && listing?.user_id) {
        const { data: authUser } = await admin.auth.admin.getUserById(
          listing.user_id
        );
        providerEmail = authUser.user?.email ?? null;
      }
    } else if (body.providerSlug) {
      const provider = await getProviderBySlugUnified(body.providerSlug);
      providerEmail = provider?.email ?? null;
    }

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("inquiries").insert({
      listing_id: body.listingId || null,
      provider_slug: body.providerSlug || null,
      provider_name: activityName,
      contact_name: contactName,
      company_name: body.companyName || null,
      email,
      phone: body.phone || null,
      group_size: body.groupSize ?? null,
      preferred_date: body.preferredDate || null,
      message: body.message || null,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await Promise.all([
      providerEmail
        ? sendInquiryToProvider({
            providerEmail,
            providerName: activityName,
            activityName,
            companyName: body.companyName ?? "",
            contactName,
            email,
            phone: body.phone,
            groupSize: body.groupSize,
            preferredDate: body.preferredDate,
            message: body.message,
          })
        : Promise.resolve(),
      sendInquiryConfirmation({
        email,
        contactName,
        activityName,
        companyName: body.companyName,
        groupSize: body.groupSize,
        preferredDate: body.preferredDate,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return NextResponse.json(
      { error: "Aanvraag versturen mislukt" },
      { status: 500 }
    );
  }
}
