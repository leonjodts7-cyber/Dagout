import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("favorites")
      .select("provider_slug, provider_data, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const favorites = (data ?? []).map((row) => {
      const pd = row.provider_data as Record<string, unknown>;
      return {
        slug: row.provider_slug,
        name: String(pd.name ?? ""),
        city: String(pd.city ?? ""),
        category: String(pd.category ?? ""),
        price_from: Number(pd.price_from ?? 0),
        image_url: (pd.image_url as string | null) ?? null,
        added_at: row.created_at,
      };
    });

    return NextResponse.json({ favorites });
  } catch {
    return NextResponse.json({ favorites: [] });
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json();
  const slug = String(body.slug ?? "");
  const provider = body.provider ?? {};

  if (!slug) {
    return NextResponse.json({ error: "Slug verplicht" }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("favorites").upsert(
      {
        user_id: user.id,
        provider_slug: slug,
        provider_data: {
          name: provider.name,
          city: provider.city,
          category: provider.category,
          price_from: provider.price_from,
          image_url: provider.image_url,
        },
      },
      { onConflict: "user_id,provider_slug" }
    );

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true, localOnly: true });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json();
  const slug = String(body.slug ?? "");

  try {
    const admin = getSupabaseAdmin();
    await admin
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("provider_slug", slug);
  } catch {
    // negeer — localStorage blijft werken
  }

  return NextResponse.json({ ok: true });
}
