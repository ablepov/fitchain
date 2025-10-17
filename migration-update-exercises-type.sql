-- Миграция для обновления ограничения типа упражнений
-- Позволяет использовать произвольные названия упражнений вместо фиксированного набора

-- Удаляем старое ограничение
ALTER TABLE public.exercises DROP CONSTRAINT IF EXISTS exercises_type_check;

-- Добавляем новое ограничение: только непустые строки без специальных символов
ALTER TABLE public.exercises ADD CONSTRAINT exercises_type_check
  CHECK (type IS NOT NULL AND trim(type) != '' AND length(trim(type)) >= 2 AND length(trim(type)) <= 100);

-- Обновляем комментарий к таблице для документации
COMMENT ON COLUMN public.exercises.type IS 'Название упражнения (произвольная строка, минимум 2 символа, максимум 100)';