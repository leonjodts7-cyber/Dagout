import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  sendListingApprovedEmail,
  sendListingRejectedEmail,
} from "@/lib/email";
import { SITE_URL } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck instanceof Response) return adminCheck;

  const tab = request.nextUrl.searchParams.get("tab");

  try {
    const supabase = getSupabaseAdmin();

    if (tab === "users") {
      const { data: authData } = await supabase.auth.admin.listUsers();
      const users = authData.users ?? [];

      const { data: listings } = await supabase.from("listings").select("user_id");
      const counts: Record<string, number> = {};
      (listings ?? []).forEach((l) => {
        counts[l.user_id] = (counts[l.user_id] ?? 0) + 1;
      });

      return NextResponse.json({
        users: users.map((u) => ({
          id: u.id,
          email: u.email,
          name:
            `${u.user_metadata?.first_name ?? ""} ${u.user_metadata?.last_name ?? ""}`.trim() ||
            "—",
          created_at: u.created_at,
          listing_count: counts[u.id] ?? 0,
        })),
      });
    }

    if (tab === "inquiries") {
      const { data } = await supabase
        .from("inquiries")
        .select("*, listings(name)")
        .order("created_at", { ascending: false });
      return NextResponse.json({ inquiries: data ?? [] });
    }

    const status = request.nextUrl.searchParams.get("status");
    let query = supabase
      .from("listings")
      .select("*, profiles(first_name, last_name, company_name)")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data } = await query;
    return NextResponse.json({ listings: data ?? [] });
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json({ error: "Serverfout" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck instanceof Response) return adminCheck;

  try {
    const body = await request.json();
    const { listingId, action, reason } = body;

    if (!listingId || !action) {
      return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: listing } = await supabase
      .from("listings")
      .select("*, profiles(first_name)")
      .eq("id", listingId)
      .single();

    if (!listing) {
      return NextResponse.json({ error: "Listing niet gevonden" }, { status: 404 });
    }

    if (action === "approve") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", listing.user_id)
        .maybeSingle();

      await supabase
        .from("listings")
        .update({
          status: "active",
          featured: profile?.is_pro ?? false,
          rejection_reason: null,
        })
        .eq("id", listingId);

      const { data: userData } = await supabase.auth.admin.getUserById(
        listing.user_id
      );

      if (userData.user?.email) {
        await sendListingApprovedEmail({
          email: userData.user.email,
          firstName:
            listing.profiles?.first_name ??
            userData.user.user_metadata?.first_name ??
            "aanbieder",
          listingName: listing.name,
          listingUrl: `${SITE_URL}/activiteit/${slugify(listing.name)}`,
        });
      }

      return NextResponse.json({ ok: true, status: "active" });
    }

    if (action === "reject") {
      await supabase
        .from("listings")
        .update({
          status: "rejected",
          rejection_reason: reason ?? "Niet voldaan aan richtlijnen",
        })
        .eq("id", listingId);

      const { data: userData } = await supabase.auth.admin.getUserById(
        listing.user_id
      );

      if (userData.user?.email) {
        await sendListingRejectedEmail(
          userData.user.email,
          listing.profiles?.first_name ?? "aanbieder",
          listing.name,
          reason ?? "Niet voldaan aan richtlijnen"
        );
      }

      return NextResponse.json({ ok: true, status: "rejected" });
    }

    if (action === "mark_handled") {
      await supabase
        .from("inquiries")
        .update({ status: "handled" })
        .eq("id", body.inquiryId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Onbekende actie" }, { status: 400 });
  } catch (error) {
    console.error("Admin PATCH error:", error);
    return NextResponse.json({ error: "Serverfout" }, { status: 500 });
  }
}
