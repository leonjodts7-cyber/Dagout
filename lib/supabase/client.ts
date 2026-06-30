"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(
    url &&
      key &&
      url.startsWith("https://") &&
      !url.includes("your-supabase") &&
      !url.includes("your-project-id")
  );
}

function getSupabaseEnv(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  if (!url.startsWith("https://") || url.includes("your-supabase")) {
    throw new Error("SUPABASE_INVALID_URL");
  }

  return { url, key };
}

export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const { url, key } = getSupabaseEnv();
  browserClient = createBrowserClient(url, key);

  return browserClient;
}

/** @deprecated Use createClient() */
export const createBrowserSupabase = createClient;
