"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import {
  isFavorite,
  syncFavoriteToServer,
  toggleLocalFavorite,
} from "@/lib/favorites";
import type { Provider } from "@/lib/types";

interface FavoriteButtonProps {
  provider: Provider;
  className?: string;
}

export default function FavoriteButton({
  provider,
  className = "",
}: FavoriteButtonProps) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(isFavorite(provider.slug));

    function onChange() {
      setLiked(isFavorite(provider.slug));
    }

    window.addEventListener("dagout-favorites-changed", onChange);
    return () =>
      window.removeEventListener("dagout-favorites-changed", onChange);
  }, [provider.slug]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleLocalFavorite(provider);
    setLiked(added);

    const supabase = createBrowserSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      await syncFavoriteToServer(provider, added, session.access_token);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={liked ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}
      className={`rounded-full p-1.5 transition-colors hover:text-red-500 ${className}`}
    >
      <svg
        className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "fill-none text-gray-400"}`}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
