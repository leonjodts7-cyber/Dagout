import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isPlaceholder, isStripeConfigured } from "@/lib/env-config";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY niet geconfigureerd");
  return new Stripe(key);
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!isStripeConfigured() || isPlaceholder(webhookSecret)) {
    console.log("[Stripe webhook skipped — niet geconfigureerd]");
    return NextResponse.json({ received: true, skipped: true });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Webhook niet geconfigureerd" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        is_pro: true,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      });

      await supabase
        .from("listings")
        .update({ featured: true })
        .eq("user_id", userId)
        .eq("status", "active");
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ is_pro: false, stripe_subscription_id: null })
        .eq("id", profile.id);

      await supabase
        .from("listings")
        .update({ featured: false })
        .eq("user_id", profile.id);
    }
  }

  return NextResponse.json({ received: true });
}
