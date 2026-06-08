"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

const AUTH_STORAGE_KEY = "dagout-supabase-auth";

export function createBrowserSupabase(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase is niet geconfigureerd.");
  }

  browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage:
        typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: AUTH_STORAGE_KEY,
    },
  });

  return browserClient;
}
