import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultDumpPath = path.resolve(__dirname, '../output/db_cluster_backup.full.sql');

function parseArgs(argv) {
  const args = {
    connectionString: '',
    dumpPath: defaultDumpPath,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if ((arg === '--connection' || arg === '--connection-string') && argv[i + 1]) {
      args.connectionString = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--dump' && argv[i + 1]) {
      args.dumpPath = path.resolve(argv[i + 1]);
      i += 1;
      continue;
    }
  }

  if (!args.connectionString) {
    throw new Error('Missing required --connection <postgres-connection-string> argument.');
  }

  return args;
}

function unescapeCopyValue(value) {
  if (value === '\\N') {
    return null;
  }

  let result = '';

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (char !== '\\') {
      result += char;
      continue;
    }

    const next = value[i + 1];
    i += 1;

    switch (next) {
      case 'b':
        result += '\b';
        break;
      case 'f':
        result += '\f';
        break;
      case 'n':
        result += '\n';
        break;
      case 'r':
        result += '\r';
        break;
      case 't':
        result += '\t';
        break;
      case 'v':
        result += '\v';
        break;
      case '\\':
        result += '\\';
        break;
      default:
        result += next ?? '';
        break;
    }
  }

  return result;
}

function extractCopyBlocks(sql) {
  const blocks = new Map();
  const lines = sql.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(/^COPY\s+([a-z0-9_]+\.[a-z0-9_]+)\s+\(([^)]+)\)\s+FROM\s+stdin;$/i);

    if (!match) {
      continue;
    }

    const [, tableName, rawColumns] = match;
    const columns = rawColumns.split(',').map((column) => column.trim());
    const rows = [];

    for (i += 1; i < lines.length; i += 1) {
      if (lines[i] === '\\.') {
        break;
      }

      if (!lines[i]) {
        continue;
      }

      rows.push(lines[i].split('\t').map(unescapeCopyValue));
    }

    blocks.set(tableName, { columns, rows });
  }

  return blocks;
}

function sqlLiteral(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  const normalized = String(value);
  if (normalized === 't') {
    return 'true';
  }
  if (normalized === 'f') {
    return 'false';
  }
  if (/^-?\d+$/.test(normalized)) {
    return normalized;
  }

  return `'${normalized.replace(/'/g, "''")}'`;
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function getTableColumns(client, schema, table) {
  const { rows } = await client.query(
    `
      select column_name
      from information_schema.columns
      where table_schema = $1 and table_name = $2
      order by ordinal_position
    `,
    [schema, table]
  );

  return rows.map((row) => row.column_name);
}

async function insertRows(client, tableName, columns, rows) {
  if (rows.length === 0) {
    return;
  }

  for (const part of chunk(rows, 100)) {
    const valuesSql = part.map((row) => `(${row.map(sqlLiteral).join(', ')})`).join(',\n');
    const sql = `insert into ${tableName} (${columns.join(', ')}) values\n${valuesSql};`;
    await client.query(sql);
  }
}

const publicSchemaSql = `
create or replace function public.current_user_id() returns uuid
language sql stable
as $$
  select auth.uid();
$$;

create table if not exists public.profiles (
  user_id uuid not null,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  goal integer not null,
  created_at timestamptz not null default now(),
  constraint exercises_goal_check check (goal > 0),
  constraint exercises_type_check check (
    type is not null and trim(type) <> '' and length(trim(type)) >= 2 and length(trim(type)) <= 100
  )
);

create table if not exists public.sets (
  id uuid not null default gen_random_uuid(),
  exercise_id uuid not null,
  reps integer not null,
  created_at timestamptz not null default now(),
  note text,
  source text not null default 'quickbutton',
  deleted_at timestamptz,
  constraint sets_reps_check check (reps > 0 and reps <= 1000),
  constraint sets_source_check check (source = any (array['manual'::text, 'quickbutton'::text]))
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_pkey') then
    alter table only public.profiles add constraint profiles_pkey primary key (user_id);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'exercises_pkey') then
    alter table only public.exercises add constraint exercises_pkey primary key (id);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'sets_pkey') then
    alter table only public.sets add constraint sets_pkey primary key (id);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'profiles_user_id_fkey') then
    alter table only public.profiles
      add constraint profiles_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'exercises_user_id_fkey') then
    alter table only public.exercises
      add constraint exercises_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'sets_exercise_id_fkey') then
    alter table only public.sets
      add constraint sets_exercise_id_fkey foreign key (exercise_id) references public.exercises(id) on delete cascade;
  end if;
end $$;

create index if not exists idx_exercises_user on public.exercises using btree (user_id);
create unique index if not exists idx_exercises_user_type_unique
  on public.exercises using btree (user_id, lower(trim(type)));
create index if not exists idx_sets_created_at on public.sets using btree (created_at);
create index if not exists idx_sets_exercise on public.sets using btree (exercise_id);
create index if not exists idx_sets_not_deleted on public.sets using btree (deleted_at);

grant usage on schema public to authenticated, service_role;
grant execute on function public.current_user_id() to authenticated, service_role;
revoke all on table public.exercises from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.sets from anon, authenticated;
grant select, insert, update, delete on table public.exercises to authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.sets to authenticated;
grant all on table public.exercises to service_role;
grant all on table public.profiles to service_role;
grant all on table public.sets to service_role;

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.sets enable row level security;
alter table public.profiles force row level security;
alter table public.exercises force row level security;
alter table public.sets force row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (user_id = auth.uid());

drop policy if exists profiles_upsert on public.profiles;
create policy profiles_upsert on public.profiles
  for insert with check (user_id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (user_id = auth.uid());

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

drop policy if exists sets_select on public.sets;
create policy sets_select on public.sets
  for select using (
    deleted_at is null
    and exists (
      select 1
      from public.exercises e
      where e.id = sets.exercise_id and e.user_id = auth.uid()
    )
  );

drop policy if exists sets_insert on public.sets;
create policy sets_insert on public.sets
  for insert with check (
    exists (
      select 1
      from public.exercises e
      where e.id = sets.exercise_id and e.user_id = auth.uid()
    )
  );

drop policy if exists sets_update on public.sets;
create policy sets_update on public.sets
  for update using (
    exists (
      select 1
      from public.exercises e
      where e.id = sets.exercise_id and e.user_id = auth.uid()
    )
  );

drop policy if exists sets_delete on public.sets;
create policy sets_delete on public.sets
  for delete using (
    exists (
      select 1
      from public.exercises e
      where e.id = sets.exercise_id and e.user_id = auth.uid()
    )
  );
`;

async function main() {
  const { connectionString, dumpPath } = parseArgs(process.argv);
  const dump = await fs.readFile(dumpPath, 'utf8');
  const blocks = extractCopyBlocks(dump);

  const authUsers = blocks.get('auth.users');
  const authIdentities = blocks.get('auth.identities');
  const profiles = blocks.get('public.profiles');
  const exercises = blocks.get('public.exercises');
  const sets = blocks.get('public.sets');

  if (!authUsers || !authIdentities || !profiles || !exercises || !sets) {
    throw new Error('Required COPY sections were not found in the dump.');
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  try {
    const authInstance = await client.query('select id from auth.instances limit 1');
    const instanceId = authInstance.rows[0]?.id ?? '00000000-0000-0000-0000-000000000000';

    const authUserColumns = await getTableColumns(client, 'auth', 'users');
    const authIdentityColumns = await getTableColumns(client, 'auth', 'identities');

    const authUserColumnIndexes = authUsers.columns
      .map((column, index) => ({ column, index }))
      .filter(({ column }) => authUserColumns.includes(column));

    const authIdentityColumnIndexes = authIdentities.columns
      .map((column, index) => ({ column, index }))
      .filter(({ column }) => authIdentityColumns.includes(column));

    const instanceIndex = authUsers.columns.indexOf('instance_id');
    const authUserRows = authUsers.rows.map((row) =>
      authUserColumnIndexes.map(({ column, index }) => (column === 'instance_id' && instanceIndex >= 0 ? instanceId : row[index]))
    );

    const authIdentityRows = authIdentities.rows.map((row) =>
      authIdentityColumnIndexes.map(({ index }) => row[index])
    );

    const userIdIndex = authUsers.columns.indexOf('id');
    const userIds = authUsers.rows.map((row) => row[userIdIndex]);

    await client.query('begin');
    await client.query(publicSchemaSql);
    await client.query(`delete from auth.users where id in (${userIds.map(sqlLiteral).join(', ')});`);

    await insertRows(
      client,
      'auth.users',
      authUserColumnIndexes.map(({ column }) => column),
      authUserRows
    );
    await insertRows(
      client,
      'auth.identities',
      authIdentityColumnIndexes.map(({ column }) => column),
      authIdentityRows
    );
    await insertRows(client, 'public.profiles', profiles.columns, profiles.rows);
    await insertRows(client, 'public.exercises', exercises.columns, exercises.rows);
    await insertRows(client, 'public.sets', sets.columns, sets.rows);
    await client.query('commit');

    console.log('Restore completed successfully.');
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
