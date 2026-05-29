import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const PLACEHOLDER_URL = /your-project-id\.supabase\.co/i;
const PLACEHOLDER_KEY = /your-anon-key-here/i;

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  !PLACEHOLDER_URL.test(supabaseUrl) &&
  !PLACEHOLDER_KEY.test(supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

export const BUCKET_NAME = "undangan-assets";
