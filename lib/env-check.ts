/**
 * Проверка корректности переменных окружения
 * Защищает от случайного удаления критически важных настроек
 */

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

const CRITICAL_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
] as const;

const OPTIONAL_ENV_VARS = [
  'PORT'
] as const;

export function validateEnvironmentVariables(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Проверяем критически важные переменные
  CRITICAL_ENV_VARS.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.includes('your_') || value.includes('placeholder')) {
      missing.push(varName);
    }
  });

  // Проверяем опциональные переменные
  OPTIONAL_ENV_VARS.forEach(varName => {
    const value = process.env[varName];
    if (value === '3000') {
      warnings.push(`${varName} использует порт по умолчанию, рекомендуется изменить`);
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
    warnings
  };
}

export function logEnvironmentStatus(): void {
  const validation = validateEnvironmentVariables();

  if (validation.warnings.length > 0) {
    console.warn('⚠️ Предупреждения переменных окружения:', validation.warnings);
  }

  if (!validation.isValid) {
    console.error('❌ Критические переменные окружения отсутствуют:', validation.missing);
    console.error('📝 Пожалуйста, настройте следующие переменные в .env.local:');
    validation.missing.forEach(varName => {
      console.error(`   ${varName}=your_value_here`);
    });
  } else {
    console.log('✅ Все переменные окружения настроены корректно');
  }
}

// Проверка при запуске сервера разработки
if (process.env.NODE_ENV === 'development') {
  logEnvironmentStatus();
}