import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

if (supabase === null) {
  supabase = createClient(
    "https://zblnvqfvkltyxvesbtxb.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibG52cWZ2a2x0eXh2ZXNidHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE3MjY2ODEsImV4cCI6MjAxNzMwMjY4MX0.1OOnA27f0CvFEq1BSGekBIo5xCZVMzMIaVSfvnizUU4",
    {
      auth: { persistSession: false },
    }
  );
}

export default supabase as SupabaseClient;
