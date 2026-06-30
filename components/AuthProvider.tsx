"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  refreshSession: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((nextSession: Session | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
  }, []);

  const refreshSession = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      applySession(null);
      return;
    }

    const supabase = createClient();
    const {
      data: { session: currentSession },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Sessie ophalen mislukt:", error.message);
      applySession(null);
      return;
    }

    applySession(currentSession);
  }, [applySession]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function initSession() {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        applySession(initialSession);
      } finally {
        setLoading(false);
      }
    }

    void initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
      setLoading(false);
    });

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refreshSession();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [applySession, refreshSession]);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      refreshSession,
    }),
    [user, session, loading, refreshSession]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
