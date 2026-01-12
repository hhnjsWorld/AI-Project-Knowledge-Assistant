import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { config } from '@/lib/config';

export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey
);
