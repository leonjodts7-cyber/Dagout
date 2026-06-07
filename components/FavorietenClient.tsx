"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { createBrowserSupabase } from "@/lib/supabase/client";
import {
  fetchServerFavorites,
  getLocalFavorites,
  removeLocalFavorite,
  type FavoriteEntry,
} from "@/lib/favorites";
import { CATEGORY_IMAGES } from "@/lib/constants";
import Spinner from "@/components/ui/Spinner";

export default function FavorietenClient() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFavorites() {
    const supabase = createBrowserSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/inloggen?redirect=/favorieten");
      return;
    }

    const serverFavs = await fetchServerFavorites(session.access_token);
    const localFavs = getLocalFavorites();
    const merged = new Map<string, FavoriteEntry>();
    [...localFavs, ...serverFavs].forEach((f) => merged.set(f.slug, f));
    setFavorites(Array.from(merged.values()));
    setLoading(false);
  }

  useEffect(() => {
    loadFavorites();

    function onChange() {
      loadFavorites();
    }
    window.addEventListener("dagout-favorites-changed", onChange);
    return () =>
      window.removeEventListener("dagout-favorites-changed", onChange);
  }, [router]);

  async function handleRemove(slug: string) {
    removeLocalFavorite(slug);
    const supabase = createBrowserSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ slug }),
      });
    }
    setFavorites((prev) => prev.filter((f) => f.slug !== slug));
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Favorieten" },
          ]}
        />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900">Mijn favorieten</h1>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <Spinner className="h-8 w-8 text-[#1D9E75]" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-lg text-gray-600">
                Je hebt nog geen favorieten opgeslagen.
              </p>
              <Link
                href="/zoeken"
                className="mt-6 inline-block rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
              >
                Ontdek activiteiten
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((fav) => {
                const imageUrl =
                  fav.image_url ?? CATEGORY_IMAGES[fav.category] ?? null;
                return (
                  <div
                    key={fav.slug}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    <Link
                      href={`/activiteit/${fav.slug}`}
                      className="relative block h-40"
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={fav.name}
                          fill
                          className="object-cover"
                          sizes="400px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#1D9E75]/10" />
                      )}
                    </Link>
                    <div className="p-5">
                      <Link href={`/activiteit/${fav.slug}`}>
                        <h2 className="font-bold text-gray-900 hover:text-[#1D9E75]">
                          {fav.name}
                        </h2>
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">{fav.city}</p>
                      <p className="mt-2 font-bold text-[#1D9E75]">
                        Vanaf &euro;{fav.price_from}/pers
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/activiteit/${fav.slug}`}
                          className="flex-1 rounded-lg bg-[#1D9E75] py-2 text-center text-sm font-semibold text-white hover:bg-[#178a66]"
                        >
                          Bekijk
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(fav.slug)}
                          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-red-300 hover:text-red-600"
                        >
                          Verwijder
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
