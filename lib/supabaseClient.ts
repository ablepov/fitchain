import { createClient } from '@supabase/supabase-js';
import { supabasePublishableKey, supabaseUrl } from './supabaseEnv';

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase env vars are missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
