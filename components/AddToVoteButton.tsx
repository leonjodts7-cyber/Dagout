"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import {
  addProviderToVoteSession,
  getActiveVoteSessionForUser,
} from "@/lib/voting";
import type { Provider } from "@/lib/types";

interface AddToVoteButtonProps {
  provider: Provider;
  className?: string;
}

export default function AddToVoteButton({
  provider,
  className = "",
}: AddToVoteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(
          `/inloggen?redirect=${encodeURIComponent(`/zoeken`)}`
        );
        return;
      }

      const activeSession = await getActiveVoteSessionForUser(user.id);

      if (!activeSession) {
        router.push(`/stemmen/nieuw?preselect=${provider.id}`);
        return;
      }

      await addProviderToVoteSession(activeSession.id, provider.id, user.id);
      setMessage("Toegevoegd aan stemronde");
      setTimeout(() => setMessage(null), 2500);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Toevoegen aan stemronde mislukt."
      );
      setTimeout(() => setMessage(null), 3500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-label="Voeg toe aan stemronde"
        title="Voeg toe aan stemronde"
        className="rounded-full bg-white/95 p-1.5 text-gray-500 shadow-sm transition-colors hover:text-[#1D9E75] disabled:opacity-50"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {message && (
        <span className="absolute right-0 top-full z-20 mt-1 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-[10px] text-white shadow-lg">
          {message}
        </span>
      )}
    </div>
  );
}
