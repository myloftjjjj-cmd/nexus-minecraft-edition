import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ypornamayomdghokagph.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_V1SVsrfl3UIo8wu6L1VcMQ_EGScwlXo';

let client: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseKey) {
    client = createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.warn('Supabase initialization failed, running in offline demo mode:', e);
}

export const supabase = client as SupabaseClient;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(client && supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project'));
};
