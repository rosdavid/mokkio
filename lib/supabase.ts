import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Public client used in browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Do NOT create the service_role client on the client bundle.
// Provide a factory that only instantiates the admin client on the server.
let _supabaseAdmin: SupabaseClient | null = null;
export function getSupabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin must be called on the server");
  }

  if (_supabaseAdmin) return _supabaseAdmin;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set on the server");
  }

  _supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return _supabaseAdmin;
}
