import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

if (supabase === null) {
  supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_API_KEY as string,
    {
      auth: { persistSession: false },
    }
  );
}

export default supabase as SupabaseClient;
