/**
 * Config Center
 * 
 * Rules:
 * 1. ONLY access process.env here.
 * 2. All config values must be strongly typed.
 * 3. Throw errors if critical env vars are missing.
 * 
 * NOTE: Next.js requires explicit 'process.env.NEXT_PUBLIC_...' access 
 * for the bundler to inline values. Dynamic access (process.env[key]) fails.
 */

const check = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
};

export const config = {
  supabase: {
    // Explicit access required for Next.js static analysis
    url: check(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: check(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
  ai: {
    // Optional for now, will be required in Phase 3
    n8nWebhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '', 
  },
  app: {
    env: process.env.NODE_ENV || 'development',
  }
};
