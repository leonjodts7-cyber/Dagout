import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserFromRequest } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/admin";
import { isStripeConfigured } from "@/lib/env-config";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !isStripeConfigured()) {
    throw new Error("STRIPE_NOT_CONFIGURED");
  }
  return new Stripe(key);
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

    const priceId = process.env.STRIPE_PRICE_ID!;
    const stripe = getStripe();
    const base = SITE_URL.replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/dashboard?success=pro#profiel`,
      cancel_url: `${base}/aanbieders/nieuw?cancelled=1`,
      customer_email: user.email,
      metadata: { user_id: user.id },
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
