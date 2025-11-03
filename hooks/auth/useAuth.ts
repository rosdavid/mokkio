"use client";

import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";

type SignUpData = { user: User | null; session: Session | null } | null;
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Create a user with optional username and create a profile row
  const signUpWithProfile = async (
    email: string,
    password: string,
    username?: string
  ) => {
    let data: SignUpData = null;
    let error: unknown = null;
    let customError: string | null = null;

    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: "" },
      });

      data = res.data;
      error = res.error;

      if (error) {
        console.error("Supabase signUp error:", error);
      }
    } catch (err) {
      // network or unexpected error
      console.error("SignUp request failed:", err);
      error = err;
    }

    // Si el signup fue exitoso y tenemos user id, intentamos crear el profile
    try {
      if (!error && data?.user?.id && username) {
        const resp = await fetch("/api/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: data.user.id, username, full_name: null }),
        });

        if (!resp.ok) {
          const body = await resp.json().catch(() => null);
          console.warn(
            "Profile creation endpoint returned:",
            resp.status,
            body
          );
          if (body?.error === "username_taken") {
            customError = "El nombre de usuario ya está en uso.";
          }
        }
      }
    } catch (e) {
      console.error("Error creating profile via API:", e);
    }

    return { data, error, customError };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  return {
    user,
    session,
    loading,
    signUp: signUpWithProfile,
    signIn,
    signOut,
    resetPassword,
  };
}
