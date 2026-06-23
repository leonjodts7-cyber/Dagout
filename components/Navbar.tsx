"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { NAV_TOOLS_LINKS } from "@/lib/tools-constants";
import { isAdminEmail } from "@/lib/admin";
import type { User } from "@supabase/supabase-js";

function userInitials(user: User): string {
  const first = user.user_metadata?.first_name as string | undefined;
  const last = user.user_metadata?.last_name as string | undefined;
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  const email = user.email ?? "?";
  return email.slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    setAvatarOpen(false);
    router.push("/");
    router.refresh();
  }

  const closeMobile = () => setMobileOpen(false);
  const linkClass =
    "text-sm font-medium text-gray-600 transition-all duration-150 hover:text-[#1D9E75]";
  const iconLinkClass =
    "rounded-full p-2.5 text-gray-500 transition-all duration-150 hover:bg-gray-100 hover:text-[#1D9E75]";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/"
            className="text-[1.4rem] font-bold tracking-tight text-[#1D9E75]"
          >
            Dagout
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <Link href="/zoeken" className={linkClass}>
                Ontdek
              </Link>
            </li>
            <li>
              <div ref={toolsRef} className="relative">
                <button
                  type="button"
                  onClick={() => setToolsOpen((o) => !o)}
                  className={`flex items-center gap-1 ${linkClass}`}
                  aria-expanded={toolsOpen}
                >
                  Tools
                  <svg
                    className={`h-4 w-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {toolsOpen && (
                  <div className="absolute left-1/2 top-full z-50 mt-2 w-52 -translate-x-1/2 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    {NAV_TOOLS_LINKS.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-[#1D9E75]/5 hover:text-[#1D9E75]"
                      >
                        {tool.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
            <li>
              <Link href="/aanbieders/nieuw" className={linkClass}>
                Voor aanbieders
              </Link>
            </li>
            {user && isAdminEmail(user.email) && (
              <li>
                <Link
                  href="/admin"
                  className="text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <>
                  <Link href="/favorieten" className={iconLinkClass} aria-label="Favorieten">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Link>
                  <Link href="/planning" className={iconLinkClass} aria-label="Planning">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </Link>
                  <div ref={avatarRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setAvatarOpen((o) => !o)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D9E75] text-xs font-bold text-white transition-all duration-150 hover:bg-[#178a66]"
                      aria-label="Accountmenu"
                    >
                      {userInitials(user)}
                    </button>
                    {avatarOpen && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                        <p className="truncate px-4 py-2 text-xs text-gray-500">
                          {user.email}
                        </p>
                        <hr className="my-1 border-gray-100" />
                        <Link
                          href="/dashboard"
                          onClick={() => setAvatarOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1D9E75]/5 hover:text-[#1D9E75]"
                        >
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                        >
                          Uitloggen
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/inloggen" className={linkClass}>
                    Inloggen
                  </Link>
                  <Link
                    href="/aanbieders/nieuw"
                    className="rounded-full bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#178a66] hover:shadow-md"
                  >
                    Lijst je activiteit
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              aria-label="Menu openen"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white md:hidden">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <Link href="/" onClick={closeMobile} className="text-xl font-bold text-[#1D9E75]">
              Dagout
            </Link>
            <button type="button" onClick={closeMobile} aria-label="Menu sluiten" className="rounded-lg p-2 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
            <Link href="/zoeken" onClick={closeMobile} className="text-lg font-medium text-gray-800">
              Ontdek
            </Link>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tools</p>
            {NAV_TOOLS_LINKS.map((tool) => (
              <Link key={tool.href} href={tool.href} onClick={closeMobile} className="pl-2 text-base text-gray-700">
                {tool.title}
              </Link>
            ))}
            <Link href="/aanbieders/nieuw" onClick={closeMobile} className="text-lg font-medium text-gray-800">
              Voor aanbieders
            </Link>
            {user && isAdminEmail(user.email) && (
              <Link href="/admin" onClick={closeMobile} className="text-lg font-medium text-amber-600">
                Admin
              </Link>
            )}
            <hr className="my-2" />
            {user ? (
              <>
                <Link href="/favorieten" onClick={closeMobile} className="text-base text-gray-700">Favorieten</Link>
                <Link href="/planning" onClick={closeMobile} className="text-base text-gray-700">Planning</Link>
                <Link href="/dashboard" onClick={closeMobile} className="text-base text-gray-700">Dashboard</Link>
                <button type="button" onClick={() => { closeMobile(); handleLogout(); }} className="text-left text-base text-red-600">
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link href="/inloggen" onClick={closeMobile} className="text-base text-gray-600">Inloggen</Link>
                <Link href="/aanbieders/nieuw" onClick={closeMobile} className="rounded-full bg-[#1D9E75] px-4 py-3 text-center text-sm font-semibold text-white">
                  Lijst je activiteit
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
