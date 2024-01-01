import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

const createSupabaseClient = () => {
  if (supabase === null) {
    supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_API_KEY as string,
      {
        auth: { persistSession: false },
      }
    );
  }

  return supabase;
};

export default createSupabaseClient;
