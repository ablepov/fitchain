# Fitchain — MVP Concept & Architecture

## 💡 Идея проекта
Fitchain — веб-приложение для домашних микро-тренировок в течение дня.  
Цель — набрать целевое количество повторений по разным упражнениям (например, 100 подтягиваний, 100 отжиманий, 100 приседаний), делая короткие подходы.

Приложение должно позволять:
- быстро фиксировать количество повторений без ввода числа (через "+5", "+10" и т.п.);
- автоматически адаптировать кнопки под текущую динамику пользователя;
- показывать прогресс и мотивационные подсказки;
- хранить историю и графики по каждому типу упражнения.

---

## 🏗️ Технологический стек
- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript  
- **UI:** Tailwind CSS v4  
- **Бэкенд:** встроенный API Routes Next.js  
- **База данных:** Supabase (PostgreSQL + Auth)  
- **Деплой:** Vercel  
- **Тестирование:** Playwright  
- **MCP Server:** sequential-thinking (помогает планировать и выполнять последовательные задачи)

---

## 🔧 Переменные окружения

Используем Supabase Cloud. Базовый минимум переменных:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Где взять значения:
- `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` — в Supabase → Settings → API.

Локальная разработка:
- создайте файл `.env.local` в корне проекта и добавьте туда переменные.

Vercel:
- Project Settings → Environment Variables → добавьте те же ключи для Production/Preview/Development.

Примечание: этого минимума достаточно для работы клиента (Auth/DB через браузерную сессию). Service Role ключ и другие приватные секреты не требуются в этом MVP.

---

## ⚙️ Архитектура

Next.js (App Router)
│
├── /app
│ ├── /dashboard – основное приложение (прогресс, графики)
│ ├── /auth – страницы входа/регистрации
│ └── /api
│ └── /sets – REST API для записи подходов
│
├── /components
│ ├── QuickButtons.tsx – адаптивные кнопки для ввода повторений
│ ├── ExerciseCard.tsx – карточка с графиком и статистикой
│ ├── SummaryPanel.tsx – суммарный прогресс
│ └── MotivationHint.tsx – подсказка с эмоцией (“давно не делал”, “отдохни”)
│
└── /lib
├── supabaseClient.ts – инициализация Supabase
├── stats.ts – вычисления динамики и средних значений
└── types.ts – общие интерфейсы

---

## 🛠️ Требования к среде разработки

- Node.js: рекомендовано >= 18, используется v22.17.1
- Package manager: npm (lockfile в репозитории)

Локальные команды:
- `npm run dev` — запуск dev‑сервера (Turbopack)
- `npm run build` — прод‑сборка
- `npm start` — запуск прод‑сборки

---

## 🧠 Логика адаптивных кнопок
1. При каждом добавлении подхода сохраняется его значение.
2. Приложение вычисляет **медиану последних 20 подходов** (если записей меньше 20 — берём доступное количество) и предлагает фиксированный набор кнопок вокруг неё.
   - Кнопки: `[+2] [+4] [+6]` относительно текущей медианы.
   - Если пользователь стабильно делает больше/меньше, медиана сдвигается и кнопки следуют за ней.
3. Пустая или короткая история: до появления стабильной медианы показываем дефолтные кнопки `[+3] [+5] [+8]`.
4. Можно вручную уменьшить или увеличить результат кнопками «–1» / «+1».

---

## 🗂️ Модель данных (Supabase)

### Таблицы
#### profiles
| поле | тип | описание |
|------|-----|-----------|
| user_id | uuid (PK, FK → auth.users.id) | идентификатор пользователя |
| timezone | text | часовой пояс профиля (например, "Europe/Moscow") |
| created_at | timestamptz | дата создания записи |

#### exercises
| поле | тип | описание |
|------|-----|-----------|
| id | uuid (PK) | идентификатор |
| user_id | uuid (FK → users.id) | владелец |
| type | text | "pullups" / "pushups" / "squats" |
| goal | integer | цель (например, 100 повторений в день) |
| created_at | timestamptz | дата создания |

#### sets
| поле | тип | описание |
|------|-----|-----------|
| id | uuid (PK) | идентификатор |
| exercise_id | uuid (FK → exercises.id) | упражнение |
| reps | integer | количество повторений |
| created_at | timestamptz | время выполнения |
| note | text (nullable) | комментарий к подходу |
| source | text | источник: "manual" / "quickbutton" |
| deleted_at | timestamptz (nullable) | мягкое удаление (если задано) |

---

## 🕒 Определение «дня» и таймзона

- День считается по локальной таймзоне пользователя из поля `users.timezone`.
- Если таймзона не задана, используем системную/браузерную по умолчанию.
- Агрегации за день (прогресс, цели) считаются по окнам [00:00, 23:59:59] в указанной таймзоне.

---

## 🛠️ SQL миграции (DDL) и RLS политики

Ниже — базовые миграции для схемы (используем `public`), полагаемся на Supabase `auth.users`.

```sql
-- profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

-- exercises
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('pullups','pushups','squats')),
  goal integer not null check (goal > 0),
  created_at timestamptz not null default now()
);

-- sets
create table if not exists public.sets (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  reps integer not null check (reps > 0 and reps <= 1000),
  created_at timestamptz not null default now(),
  note text,
  source text not null default 'quickbutton' check (source in ('manual','quickbutton')),
  deleted_at timestamptz
);

-- индексы
create index if not exists idx_exercises_user on public.exercises(user_id);
create index if not exists idx_sets_exercise on public.sets(exercise_id);
create index if not exists idx_sets_created_at on public.sets(created_at);
create index if not exists idx_sets_not_deleted on public.sets(deleted_at);
```

Включаем RLS и добавляем политики:

```sql
-- включаем RLS
alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.sets enable row level security;

-- helper: текущий user id
create or replace function public.current_user_id() returns uuid language sql stable as $$
  select auth.uid();
$$;

-- profiles: пользователь видит/меняет только свою запись
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (user_id = auth.uid());
drop policy if exists profiles_upsert on public.profiles;
create policy profiles_upsert on public.profiles
  for insert with check (user_id = auth.uid());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (user_id = auth.uid());

-- exercises: доступ только владельцу
drop policy if exists exercises_select on public.exercises;
create policy exercises_select on public.exercises
  for select using (user_id = auth.uid());
drop policy if exists exercises_insert on public.exercises;
create policy exercises_insert on public.exercises
  for insert with check (user_id = auth.uid());
drop policy if exists exercises_update on public.exercises;
create policy exercises_update on public.exercises
  for update using (user_id = auth.uid());
drop policy if exists exercises_delete on public.exercises;
create policy exercises_delete on public.exercises
  for delete using (user_id = auth.uid());

-- sets: фильтруем мягко удалённые записи и ограничиваем владельцем через связь
-- выборка: только свои, не удалённые
drop policy if exists sets_select on public.sets;
create policy sets_select on public.sets
  for select using (
    deleted_at is null and
    exists (
      select 1 from public.exercises e
      where e.id = sets.exercise_id and e.user_id = auth.uid()
    )
  );

-- вставка: только в свои упражнения
drop policy if exists sets_insert on public.sets;
create policy sets_insert on public.sets
  for insert with check (
    exists (
      select 1 from public.exercises e
      where e.id = sets.exercise_id and e.user_id = auth.uid()
    )
  );

-- обновление/удаление: только свои
drop policy if exists sets_update on public.sets;
create policy sets_update on public.sets
  for update using (
    exists (
      select 1 from public.exercises e
      where e.id = sets.exercise_id and e.user_id = auth.uid()
    )
  );
drop policy if exists sets_delete on public.sets;
create policy sets_delete on public.sets
  for delete using (
    exists (
      select 1 from public.exercises e
      where e.id = sets.exercise_id and e.user_id = auth.uid()
    )
  );
```

Мягкое удаление:
- API `DELETE /api/sets/:id` делает `update sets set deleted_at = now() where id = :id`.
- Политики исключают такие записи из выборок (см. `deleted_at is null`).

---

## 📊 Интерфейс MVP
**Dashboard:**
- Три карточки: подтягивания / отжимания / приседания.
- На каждой:  
  - Текущее количество за день  
  - Цель  
  - Адаптивные кнопки  
  - Мини-график последних подходов  
  - Эмоциональный статус (время с последнего подхода)

---

## 🔐 Авторизация
Используется Supabase Auth (email/password, Google).  
После логина пользователь попадает на `/dashboard`.

---

## 🧩 API Endpoints
| метод | путь | назначение |
|--------|------|-------------|
| `POST /api/sets` | Добавить новый подход |
| `GET /api/sets?exercise=pullups` | Получить историю подходов |
| `DELETE /api/sets/:id` | Удалить подход |

---

### Спецификация API `/api/sets`

Общее:
- Аутентификация: через сессию Supabase (JWT в cookie/headers, SDK на клиенте). Неаутентифицированные запросы получают `401`.
- Формат ответа: JSON с полями `data` (payload) и `error` (объект с `code`, `message`).
- Ограничения: `reps` ∈ [1, 1000]. Мягкое удаление: записи с `deleted_at` не возвращаются.
- Rate limit (MVP): клиентский debounce + best‑effort лимит на сервере (например, 5 запросов / 10 секунд на пользователя). Для продакшена — внешний стор (Upstash Redis).

#### POST /api/sets
Добавить новый подход.

Request (JSON):
```
{
  "exerciseId": "uuid",
  "reps": 10,
  "note": "optional",
  "source": "manual" | "quickbutton"
}
```

Responses:
- `201`
```
{ "data": { "id": "uuid", "exercise_id": "uuid", "reps": 10, "created_at": "ISO", "note": null, "source": "quickbutton" }, "error": null }
```
- `400` (валидация: диапазон reps / отсутствует exerciseId / source некорректен)
```
{ "data": null, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```
- `401` (не авторизован), `403` (нет прав к exercise), `404` (exercise не найден), `429` (rate limited), `500` (ошибка сервера)

#### GET /api/sets
Получить историю подходов.

Query:
- `exercise`: строка типа упражнения (`pullups|pushups|squats`) ИЛИ
- `exerciseId`: uuid конкретного упражнения
- `limit`: число записей (по умолчанию 50, максимум 500)
- `from`, `to`: ISO‑даты (границы интервала, опционально)

Responses:
- `200`
```
{ "data": [ { "id": "uuid", "exercise_id": "uuid", "reps": 10, "created_at": "ISO", "note": null, "source": "quickbutton" } ], "error": null }
```
- `400` (некорректные параметры), `401`, `403`, `404` (если exercise не найден у пользователя), `500`

Примечания:
- По умолчанию сортировка по `created_at DESC`.
- Записи с `deleted_at IS NOT NULL` не возвращаются.

#### DELETE /api/sets/:id
Мягкое удаление подхода.

Responses:
- `204` — успешно (без тела)
- `401`, `403` (чужая запись), `404` (не найдено), `500`

Ошибки (коды в `error.code`):
- `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404)
- `VALIDATION_ERROR` (400), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500)

---

## 📈 Roadmap MVP
1. ✅ Настроить Supabase и подключить Auth
2. 🧩 Реализовать API `/api/sets`
3. 🖱️ Компонент QuickButtons (адаптивная логика)
4. 📊 Компонент ExerciseCard с графиком
5. 💬 Мотивационные подсказки
6. 📱 Финальный UI + тесты Playwright

---

## 🔎 Телеметрия (MVP)
- Endpoint: `POST /api/telemetry` — логирует события на серверной консоли (best‑effort), авторизация не обязательна.
- События: `quickbutton_click` (поля: `exerciseId`, `reps`).
- В проде рекомендуется внешний сбор событий и хранение агрегатов.
