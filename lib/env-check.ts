import { getMissingSupabaseEnvVars } from './supabaseEnv';

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

const OPTIONAL_ENV_VARS = ['PORT'] as const;

export function validateEnvironmentVariables(): EnvValidationResult {
  const missing = getMissingSupabaseEnvVars();
  const warnings: string[] = [];

  OPTIONAL_ENV_VARS.forEach((varName) => {
    const value = process.env[varName];
    if (value === '3000') {
      warnings.push(`${varName} uses the default port; consider changing it`);
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

export function logEnvironmentStatus(): void {
  const validation = validateEnvironmentVariables();

  if (validation.warnings.length > 0) {
    console.warn('Environment warnings:', validation.warnings);
  }

  if (!validation.isValid) {
    console.error('Critical environment variables are missing:', validation.missing);
    console.error('Configure the missing variables in .env.local:');
    validation.missing.forEach((varName) => {
      console.error(`   ${varName}=your_value_here`);
    });
  } else {
    console.log('Environment variables are configured correctly');
  }
}

if (process.env.NODE_ENV === 'development') {
  logEnvironmentStatus();
}
