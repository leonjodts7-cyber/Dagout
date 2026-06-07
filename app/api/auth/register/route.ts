import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim();
    const firstName = String(body.firstName ?? "daar").trim();

    if (!email) {
      return NextResponse.json({ error: "E-mail verplicht" }, { status: 400 });
    }

    await sendWelcomeEmail({ email, firstName });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Register email error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
