export function getSupabasePublicEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    publishableKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      '',
  };
}

const env = getSupabasePublicEnv();

export const supabaseUrl = env.url;

export const supabasePublishableKey = env.publishableKey;

export function getMissingSupabaseEnvVars(): string[] {
  const missing: string[] = [];

  if (!supabaseUrl || supabaseUrl.includes('your_') || supabaseUrl.includes('placeholder')) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL');
  }

  if (
    !supabasePublishableKey ||
    supabasePublishableKey.includes('your_') ||
    supabasePublishableKey.includes('placeholder')
  ) {
    missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return missing;
}
