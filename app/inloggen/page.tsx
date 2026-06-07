"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";

type Tab = "login" | "register";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProvider, setIsProvider] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: translateAuthError(
          err instanceof Error ? err.message : "Inloggen mislukt."
        ),
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (registerPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Wachtwoorden komen niet overeen.",
      });
      setLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Uw wachtwoord moet minimaal 6 tekens bevatten.",
      });
      setLoading(false);
      return;
    }

    try {
      const supabase = createBrowserSupabase();
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            is_provider: isProvider,
          },
        },
      });
      if (error) throw error;

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          is_provider: isProvider,
        });

        fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: registerEmail, firstName }),
        }).catch(() => {});
      }

      if (data.session) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setMessage({
          type: "success",
          text: "Account aangemaakt. Controleer uw e-mail om uw account te bevestigen.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: translateAuthError(
          err instanceof Error ? err.message : "Registratie mislukt."
        ),
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!loginEmail) {
      setMessage({
        type: "error",
        text: "Vul eerst uw e-mailadres in om uw wachtwoord te resetten.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
        redirectTo: `${window.location.origin}/inloggen`,
      });
      if (error) throw error;
      setMessage({
        type: "success",
        text: "Resetlink verzonden. Controleer uw inbox.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: translateAuthError(
          err instanceof Error ? err.message : "Reset mislukt."
        ),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-[#1D9E75]">
              Dagout
            </Link>
          </div>

          <div className="mt-8 flex rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setMessage(null);
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                tab === "login"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Inloggen
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("register");
                setMessage(null);
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                tab === "register"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Registreren
            </button>
          </div>

          {message && (
            <div
              className={`mt-6 rounded-xl px-4 py-3 text-sm ${
                message.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                  E-mailadres
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
                  placeholder="naam@bedrijf.be"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                  Wachtwoord
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
                />
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#1D9E75] hover:underline"
              >
                Wachtwoord vergeten?
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1D9E75] py-3.5 text-sm font-semibold text-white hover:bg-[#178a66] disabled:opacity-50"
              >
                {loading ? "Even geduld..." : "Inloggen"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    Voornaam
                  </label>
                  <input
                    id="first-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Achternaam
                  </label>
                  <input
                    id="last-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                  E-mailadres
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
                />
              </div>
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                  Wachtwoord
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  minLength={6}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Bevestig wachtwoord
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={isProvider}
                  onChange={(e) => setIsProvider(e.target.checked)}
                  className="rounded border-gray-300 text-[#1D9E75] focus:ring-[#1D9E75]"
                />
                Ik ben een aanbieder
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1D9E75] py-3.5 text-sm font-semibold text-white hover:bg-[#178a66] disabled:opacity-50"
              >
                {loading ? "Even geduld..." : "Account aanmaken"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
              Terug naar homepage
            </Link>
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <div className="flex flex-1 items-center justify-center bg-gray-50 py-24">
            <div className="ai-loader" />
          </div>
          <Footer />
        </>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
