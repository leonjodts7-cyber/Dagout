import { NextRequest, NextResponse } from "next/server";
import { sendVoteNotificationEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/admin";
import { resolveProvider } from "@/lib/providers";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, voterName, providerId } = await request.json();

    if (!sessionId || !voterName || !providerId) {
      return NextResponse.json(
        { error: "Onvolledige gegevens" },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    const { data: session, error } = await admin
      .from("vote_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (error || !session?.creator_user_id) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const { data: authData } = await admin.auth.admin.getUserById(
      session.creator_user_id
    );
    const organizerEmail = authData.user?.email;

    if (!organizerEmail) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const provider = resolveProvider(providerId);
    const activityName = provider?.name ?? "een activiteit";

    await sendVoteNotificationEmail({
      organizerEmail,
      organizerName: session.creator_name ?? "organisator",
      voterName: String(voterName).trim(),
      companyName: session.company_name ?? "jullie team",
      activityName,
      resultsUrl: `${SITE_URL}/stemmen/${sessionId}/resultaten`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Vote notify error:", err);
    return NextResponse.json({ ok: true, skipped: true });
  }
}
