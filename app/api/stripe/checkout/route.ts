import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserFromRequest } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/admin";
import { isPlaceholder, isStripeConfigured } from "@/lib/env-config";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !isStripeConfigured()) {
    throw new Error("STRIPE_NOT_CONFIGURED");
  }
  return new Stripe(key);
}

function getPriceId(plan: "basis" | "pro"): string | null {
  if (plan === "basis") {
    const basisId =
      process.env.STRIPE_PRICE_ID_BASIS ?? process.env.STRIPE_BASIS_PRICE_ID;
    if (basisId && !isPlaceholder(basisId)) return basisId;
    return null;
  }

  const proId = process.env.STRIPE_PRICE_ID_PRO ?? process.env.STRIPE_PRICE_ID;
  if (proId && !isPlaceholder(proId)) return proId;
  return null;
}

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error: "Betalingen nog niet geconfigureerd",
          code: "STRIPE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const user = await getUserFromRequest(request);
    if (!user?.email) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const plan =
      body.plan === "basis" || body.plan === "pro" ? body.plan : "pro";

    const priceId = getPriceId(plan);
    if (!priceId) {
      return NextResponse.json(
        { error: "Prijs niet geconfigureerd voor dit plan", code: "STRIPE_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    const base = SITE_URL.replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/dashboard?success=${plan}#profiel`,
      cancel_url: `${base}/prijzen`,
      customer_email: user.email,
      metadata: { user_id: user.id, plan_tier: plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Checkout aanmaken mislukt" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: isStripeConfigured(),
    publishableKey: isStripeConfigured()
      ? (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
        process.env.STRIPE_PUBLISHABLE_KEY ??
        null)
      : null,
  });
}
