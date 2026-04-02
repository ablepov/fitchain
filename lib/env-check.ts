import { getMissingSupabaseEnvVars } from "./supabaseEnv";

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
}

declare global {
  // eslint-disable-next-line no-var
  var __fitchainEnvStatusLogged: boolean | undefined;
}

export function validateEnvironmentVariables(): EnvValidationResult {
  const missing = getMissingSupabaseEnvVars();

  return {
    isValid: missing.length === 0,
    missing,
  };
}

export function logEnvironmentStatus(): void {
  if (globalThis.__fitchainEnvStatusLogged) {
    return;
  }

  globalThis.__fitchainEnvStatusLogged = true;

  const validation = validateEnvironmentVariables();

  if (!validation.isValid) {
    console.error("Critical environment variables are missing:", validation.missing);
    console.error("Configure the missing variables in .env.local:");
    validation.missing.forEach((varName) => {
      console.error(`   ${varName}=your_value_here`);
    });
  }
}
