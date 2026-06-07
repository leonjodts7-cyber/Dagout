export function isPlaceholder(value: string | undefined | null): boolean {
  if (!value) return true;
  const v = value.trim().toLowerCase();
  return v === "placeholder" || v === "your-resend-api-key" || v === "your-stripe-price-id";
}

export function isResendConfigured(): boolean {
  return !isPlaceholder(process.env.RESEND_API_KEY);
}

export function isStripeConfigured(): boolean {
  return (
    !isPlaceholder(process.env.STRIPE_PRICE_ID) &&
    !isPlaceholder(process.env.STRIPE_SECRET_KEY)
  );
}
