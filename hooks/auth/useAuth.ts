"use client";

import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";

type SignUpData = { user: User | null; session: Session | null } | null;
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

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

    // First, check if username is already taken (before signing up)
    if (username) {
      try {
        const { data: existing, error: checkError } = await supabase
          .from("profiles")
          .select("id")
          .ilike("username", username.trim())
          .limit(1);

        if (checkError) {
          logger.error("Username check error:", checkError);
          customError =
            "Error al verificar disponibilidad del nombre de usuario.";
          return { data, error, customError };
        }

        if (existing && existing.length > 0) {
          customError = "El nombre de usuario ya está en uso.";
          return { data, error, customError };
        }
      } catch (err) {
        logger.error("Username availability check failed:", err);
        customError =
          "Error al verificar disponibilidad del nombre de usuario.";
        return { data, error, customError };
      }
    }

    try {
      // Try to include username in the signUp call if possible (SDK supports options.data).
      const res = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: "", data: username ? { username } : {} },
      });

      data = res.data;
      error = res.error;

      if (error) {
        logger.error("Supabase signUp error:", error);
      }
    } catch (err) {
      // network or unexpected error
      logger.error("SignUp request failed:", err);
      error = err;
    }

    // Si el signup fue exitoso y tenemos user id, intentamos crear el profile
    try {
      // Best-effort: if we have a username, try to update the auth user's metadata
      // This helps keep `user.user_metadata.username` in sync for the client session.
      if (!error && data?.user?.id && username) {
        try {
          // Attempt to update the user metadata. This may fail for e.g. email-confirm flows,
          // so we ignore errors here and rely on the profile row as a fallback.
          await supabase.auth.updateUser({ data: { username } });
          // Refresh session info so the onAuthStateChange listener picks up the new metadata.
          await supabase.auth.getSession();
        } catch (err) {
          // Non-fatal; log for debugging.
          logger.warn("Could not update user metadata after signUp:", err);
        }

        const resp = await fetch("/api/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: data.user.id, username, full_name: null }),
        });

        if (!resp.ok) {
          const body = await resp.json().catch(() => null);
          logger.warn("Profile creation endpoint returned:", resp.status, body);
          if (body?.error === "username_taken") {
            customError = "El nombre de usuario ya está en uso.";
          }
        }
      }
    } catch (e) {
      logger.error("Error creating profile via API:", e);
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
