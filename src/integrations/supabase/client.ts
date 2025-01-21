import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nlxalpizbbxhtppgbimw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5seGFscGl6YmJ4aHRwcGdiaW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MzQxNTEsImV4cCI6MjA1MjUxMDE1MX0.dklqQxw3sfPq383OsRgZShSgZESjzCS_xkDDmlzUu94";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
});
