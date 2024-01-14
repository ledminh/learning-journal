import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

const createSupabaseClient = () => {
  if (supabase === null) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        auth: { persistSession: false },
      }
    );
  }

  return supabase;
};

export default createSupabaseClient;
