--
-- PostgreSQL database cluster dump
--

\restrict Z3Rs7bQtd89vL6N6HG9D54aMyNPkvw7QXYaXKaxft4GkrB2t2z1IKSgJHc1OlOd

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE anon;
ALTER ROLE anon WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticated;
ALTER ROLE authenticated WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticator;
ALTER ROLE authenticator WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE dashboard_user;
ALTER ROLE dashboard_user WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE pgbouncer;
ALTER ROLE pgbouncer WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE postgres;
ALTER ROLE postgres WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE service_role;
ALTER ROLE service_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_admin;
ALTER ROLE supabase_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE supabase_auth_admin;
ALTER ROLE supabase_auth_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_etl_admin;
ALTER ROLE supabase_etl_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE supabase_read_only_user;
ALTER ROLE supabase_read_only_user WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_realtime_admin;
ALTER ROLE supabase_realtime_admin WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_replication_admin;
ALTER ROLE supabase_replication_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE supabase_storage_admin;
ALTER ROLE supabase_storage_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;

--
-- User Configurations
--

--
-- User Config "anon"
--

ALTER ROLE anon SET statement_timeout TO '3s';

--
-- User Config "authenticated"
--

ALTER ROLE authenticated SET statement_timeout TO '8s';

--
-- User Config "authenticator"
--

ALTER ROLE authenticator SET session_preload_libraries TO 'safeupdate';
ALTER ROLE authenticator SET statement_timeout TO '8s';
ALTER ROLE authenticator SET lock_timeout TO '8s';

--
-- User Config "postgres"
--

ALTER ROLE postgres SET search_path TO E'\\$user', 'public', 'extensions';

--
-- User Config "supabase_admin"
--

ALTER ROLE supabase_admin SET search_path TO '$user', 'public', 'auth', 'extensions';
ALTER ROLE supabase_admin SET log_statement TO 'none';

--
-- User Config "supabase_auth_admin"
--

ALTER ROLE supabase_auth_admin SET search_path TO 'auth';
ALTER ROLE supabase_auth_admin SET idle_in_transaction_session_timeout TO '60000';
ALTER ROLE supabase_auth_admin SET log_statement TO 'none';

--
-- User Config "supabase_read_only_user"
--

ALTER ROLE supabase_read_only_user SET default_transaction_read_only TO 'on';

--
-- User Config "supabase_storage_admin"
--

ALTER ROLE supabase_storage_admin SET search_path TO 'storage';
ALTER ROLE supabase_storage_admin SET log_statement TO 'none';


--
-- Role memberships
--

GRANT anon TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT anon TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticated TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT authenticated TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO supabase_storage_admin WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT pg_create_subscription TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_monitor TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_monitor TO supabase_etl_admin WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_monitor TO supabase_read_only_user WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO supabase_etl_admin WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO supabase_read_only_user WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_signal_backend TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT service_role TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT service_role TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT supabase_realtime_admin TO postgres WITH INHERIT TRUE GRANTED BY supabase_admin;






\unrestrict Z3Rs7bQtd89vL6N6HG9D54aMyNPkvw7QXYaXKaxft4GkrB2t2z1IKSgJHc1OlOd

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict zQ9Klpx22YOH6xRaxXLXbLTKXcOEVo6VTvjnCcs2YzNGk6xCKfN8Bt1ugr8Zt3i

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6 (Debian 17.6-2.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict zQ9Klpx22YOH6xRaxXLXbLTKXcOEVo6VTvjnCcs2YzNGk6xCKfN8Bt1ugr8Zt3i

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict QjUcH1SAbUSONKJi1JTCbI27oYmW7J1GIkqZXmZjT1BbcO1U1g7EY5L1OxoYvye

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6 (Debian 17.6-2.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: current_user_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.current_user_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select auth.uid();
$$;


ALTER FUNCTION public.current_user_id() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_level_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    goal integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT exercises_goal_check CHECK ((goal > 0)),
    CONSTRAINT exercises_type_check CHECK (((type IS NOT NULL) AND (TRIM(BOTH FROM type) <> ''::text) AND (length(TRIM(BOTH FROM type)) >= 2) AND (length(TRIM(BOTH FROM type)) <= 100)))
);


ALTER TABLE public.exercises OWNER TO postgres;

--
-- Name: COLUMN exercises.type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.exercises.type IS 'Название упражнения (произвольная строка, минимум 2 символа, максимум 100)';


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    user_id uuid NOT NULL,
    timezone text DEFAULT 'UTC'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: sets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    exercise_id uuid NOT NULL,
    reps integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    note text,
    source text DEFAULT 'quickbutton'::text NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT sets_reps_check CHECK (((reps >= '-1000'::integer) AND (reps <= 1000))),
    CONSTRAINT sets_source_check CHECK ((source = ANY (ARRAY['manual'::text, 'quickbutton'::text])))
);


ALTER TABLE public.sets OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: messages_2025_10_18; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_18 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_18 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_19; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_19 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_19 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_20; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_20 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_20 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_21; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_21 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_21 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_22; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_22 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_23; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_23 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_24; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_24 OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: messages_2025_10_18; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_18 FOR VALUES FROM ('2025-10-18 00:00:00') TO ('2025-10-19 00:00:00');


--
-- Name: messages_2025_10_19; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_19 FOR VALUES FROM ('2025-10-19 00:00:00') TO ('2025-10-20 00:00:00');


--
-- Name: messages_2025_10_20; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_20 FOR VALUES FROM ('2025-10-20 00:00:00') TO ('2025-10-21 00:00:00');


--
-- Name: messages_2025_10_21; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_21 FOR VALUES FROM ('2025-10-21 00:00:00') TO ('2025-10-22 00:00:00');


--
-- Name: messages_2025_10_22; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_22 FOR VALUES FROM ('2025-10-22 00:00:00') TO ('2025-10-23 00:00:00');


--
-- Name: messages_2025_10_23; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_23 FOR VALUES FROM ('2025-10-23 00:00:00') TO ('2025-10-24 00:00:00');


--
-- Name: messages_2025_10_24; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_24 FOR VALUES FROM ('2025-10-24 00:00:00') TO ('2025-10-25 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	ec1c851c-fff1-4040-baad-29f1846f3d0a	{"action":"user_confirmation_requested","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-14 13:20:19.239932+00	
00000000-0000-0000-0000-000000000000	b3aeca0a-f739-4abf-b68b-6352309a9882	{"action":"user_signedup","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-14 13:20:42.384084+00	
00000000-0000-0000-0000-000000000000	18690605-ae32-4279-ac07-5a274f500a18	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 13:20:45.441596+00	
00000000-0000-0000-0000-000000000000	41bcba4b-3d1f-42f6-907a-65090e85d94a	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 13:35:24.08489+00	
00000000-0000-0000-0000-000000000000	3652968e-c223-4cf5-9ef2-4bc06432350d	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 14:33:37.959713+00	
00000000-0000-0000-0000-000000000000	1d6b5054-1972-4f9b-b6b1-13d9c4efa3aa	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 14:33:37.979503+00	
00000000-0000-0000-0000-000000000000	f778abd5-4f34-4278-a1f4-e1b0df58a284	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 15:46:20.107341+00	
00000000-0000-0000-0000-000000000000	2970ee1f-7609-4854-8d58-ee76b49bba5b	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 15:46:20.128895+00	
00000000-0000-0000-0000-000000000000	c0e8cf86-b9d7-45c6-8396-0af88156b2b3	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 15:48:22.859806+00	
00000000-0000-0000-0000-000000000000	dbb5dc4d-30d1-4247-8073-ead3d2c16655	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 16:06:51.794558+00	
00000000-0000-0000-0000-000000000000	f5915725-bf5c-4e80-9601-50faa8357656	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 16:06:51.805075+00	
00000000-0000-0000-0000-000000000000	9f8ff380-70f9-40e5-bb2a-360e80f5e73d	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 16:44:24.045117+00	
00000000-0000-0000-0000-000000000000	4efe3c2f-b965-4ed8-a337-8f1a9877ca72	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 16:44:24.066447+00	
00000000-0000-0000-0000-000000000000	2aa189f5-7f73-48bf-a091-754dcc2bb853	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 17:05:13.012407+00	
00000000-0000-0000-0000-000000000000	0983d158-c29b-4b5b-a415-962257d5b23f	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 17:05:13.022407+00	
00000000-0000-0000-0000-000000000000	0fc404a4-a0c9-4969-9584-d8202476aaf3	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 17:43:47.214687+00	
00000000-0000-0000-0000-000000000000	bc9ca96b-5ea1-4299-8ee4-6f64d6c1db81	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 17:43:47.228678+00	
00000000-0000-0000-0000-000000000000	f9bd6d1c-8674-4877-b245-e0823e5f081a	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 18:03:20.675807+00	
00000000-0000-0000-0000-000000000000	c61b6895-30fa-4e2f-a1de-cf5609fd8103	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 18:03:20.690867+00	
00000000-0000-0000-0000-000000000000	4c3fdaeb-0ca8-4bb6-9d17-0ca0ae002190	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 18:42:34.295422+00	
00000000-0000-0000-0000-000000000000	b9a557aa-3310-457e-9d78-51ddc96955f3	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 18:42:34.304006+00	
00000000-0000-0000-0000-000000000000	e2aff214-76dd-498c-a332-1eac74588dcf	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 19:41:47.535002+00	
00000000-0000-0000-0000-000000000000	f47ef104-4f17-435e-8ae9-e30b30d62bf2	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 19:41:47.541608+00	
00000000-0000-0000-0000-000000000000	e7a1aac2-d48d-4b7b-a27f-e76692c68dcd	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 11:08:01.411321+00	
00000000-0000-0000-0000-000000000000	1b8138ff-f90d-49e7-9e04-577435f126c6	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 11:08:01.432741+00	
00000000-0000-0000-0000-000000000000	1c02c96a-ece5-402c-932e-e9644a0ba338	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 12:06:11.321475+00	
00000000-0000-0000-0000-000000000000	5ce193a1-42a1-4c78-b470-ea62b7ce65e1	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 12:06:11.336993+00	
00000000-0000-0000-0000-000000000000	cdb936a7-cb18-4179-8144-32b632bafc96	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 13:04:36.041763+00	
00000000-0000-0000-0000-000000000000	45c8d523-7130-4213-9b2b-ce30d9f5ff53	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 13:04:36.053102+00	
00000000-0000-0000-0000-000000000000	f7475237-14f0-44fb-83cf-6be7e1f05627	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 13:36:49.73348+00	
00000000-0000-0000-0000-000000000000	cca7e659-c8e6-4715-b2e5-cc7259e33b05	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 13:36:49.749487+00	
00000000-0000-0000-0000-000000000000	ad2f435f-f796-45ad-9e5e-6629338a0ed5	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 14:03:04.733955+00	
00000000-0000-0000-0000-000000000000	93975682-a457-4444-bab6-0e42f9899c9b	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 14:03:04.754709+00	
00000000-0000-0000-0000-000000000000	0329d200-b581-47cc-83c8-25e29f7088a5	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 14:34:53.258515+00	
00000000-0000-0000-0000-000000000000	249af4ac-2a28-4dc9-9359-7d4e193d3d83	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 14:34:53.284595+00	
00000000-0000-0000-0000-000000000000	a9291fb9-6762-463f-b544-ec984bccbb98	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 15:01:04.909911+00	
00000000-0000-0000-0000-000000000000	78e241c2-6127-427f-b2bc-636a5a3535a7	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 15:01:04.916968+00	
00000000-0000-0000-0000-000000000000	462d1fac-80db-40e7-9d9e-efd4b0686723	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 15:33:23.248481+00	
00000000-0000-0000-0000-000000000000	afa4b241-c8b2-45eb-8ba2-7d9432e5f4eb	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 15:33:23.262984+00	
00000000-0000-0000-0000-000000000000	18ba4255-7c36-4ec6-855c-d8df8b2cfd00	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 15:59:04.863562+00	
00000000-0000-0000-0000-000000000000	2552501a-afd2-40e7-873d-2f1ca58e4c0b	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 15:59:04.870729+00	
00000000-0000-0000-0000-000000000000	04ae2aef-3edc-4c66-b9eb-3cac708c8082	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 16:31:53.252111+00	
00000000-0000-0000-0000-000000000000	89e0365a-dd10-4614-b725-b40cefb02358	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 16:31:53.259371+00	
00000000-0000-0000-0000-000000000000	4fb199d6-dad6-4960-b535-cb659472c7ea	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 16:57:05.025037+00	
00000000-0000-0000-0000-000000000000	801ecedb-7e87-409f-8248-87b580813782	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 16:57:05.035225+00	
00000000-0000-0000-0000-000000000000	1cc2ccd0-344c-4d28-9ce2-8e50c8b0f4d6	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 17:30:23.253098+00	
00000000-0000-0000-0000-000000000000	66c9c875-880b-4665-b5bd-0e552b1b9852	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 17:30:23.270672+00	
00000000-0000-0000-0000-000000000000	2da6e02a-88c7-4227-bb6a-0b118d06bdd3	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 17:55:35.030818+00	
00000000-0000-0000-0000-000000000000	763ffddd-62a2-4345-9816-80e4713ac064	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 17:55:35.050142+00	
00000000-0000-0000-0000-000000000000	fb3f825b-fdd7-41f4-8a00-a077e349b02d	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 18:28:48.162813+00	
00000000-0000-0000-0000-000000000000	27f7f65a-c513-408a-bacf-a308702d3791	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 18:28:48.176136+00	
00000000-0000-0000-0000-000000000000	29e2a224-c36b-495a-bc25-019fba2d1f18	{"action":"user_confirmation_requested","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-15 18:51:02.34995+00	
00000000-0000-0000-0000-000000000000	0e6efbd6-756b-45dd-8388-f43d7eeb8952	{"action":"user_signedup","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-15 18:51:39.088296+00	
00000000-0000-0000-0000-000000000000	b05f0d7f-5570-4103-9dd7-43a2ebc2b7eb	{"action":"login","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 18:51:55.161019+00	
00000000-0000-0000-0000-000000000000	894d0b91-de62-4c0e-b3c2-dfe7254950ed	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 19:34:37.453248+00	
00000000-0000-0000-0000-000000000000	3646f08c-a552-4717-9150-9c53ad0fe76d	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 19:34:37.472895+00	
00000000-0000-0000-0000-000000000000	ad763f52-b57b-41cc-a7d0-00e9b8100e4d	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 19:43:40.315059+00	
00000000-0000-0000-0000-000000000000	656f763a-3467-4a8a-b46c-aecb5d5ce176	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 19:43:40.323749+00	
00000000-0000-0000-0000-000000000000	b734163e-84be-452f-8c9c-921c03a0cf02	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 19:51:12.22221+00	
00000000-0000-0000-0000-000000000000	eefb80b6-e897-4f89-b673-9511647dd022	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 19:51:12.225285+00	
00000000-0000-0000-0000-000000000000	6c59a3d6-1264-4650-b7c5-c41831b4b2d7	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 13:11:52.1835+00	
00000000-0000-0000-0000-000000000000	28e3284f-22d7-47bb-9a2f-465809df9d7b	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 13:11:52.204412+00	
00000000-0000-0000-0000-000000000000	2aabccda-3a93-4049-98f5-cce2d80428ec	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 18:37:21.196615+00	
00000000-0000-0000-0000-000000000000	676319d3-d837-4ff1-9aa2-6c7de5933c12	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 18:37:21.214105+00	
00000000-0000-0000-0000-000000000000	559b971a-3b03-4968-9ebf-9d1192e5a24a	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 19:35:51.299066+00	
00000000-0000-0000-0000-000000000000	00860c64-a2f2-49ec-89cd-f1bdb24f7644	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 19:35:51.318456+00	
00000000-0000-0000-0000-000000000000	56a6f99e-f3ac-4613-ba92-bd10c26d3b70	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-16 20:29:14.165286+00	
00000000-0000-0000-0000-000000000000	5954dd3a-db9b-4424-84e4-787ea80b47d0	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 20:34:21.100661+00	
00000000-0000-0000-0000-000000000000	45413a3c-c413-4afb-b634-7b0fc5a78590	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 20:34:21.1054+00	
00000000-0000-0000-0000-000000000000	8e08e94c-22a6-4db2-b0c4-f9b96f09910c	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-16 20:52:14.02783+00	
00000000-0000-0000-0000-000000000000	47794a00-2d96-4273-905d-b4609ca0b7ae	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-16 20:53:14.192071+00	
00000000-0000-0000-0000-000000000000	254948cb-ab8f-4705-8463-17d20a863319	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 15:29:32.622939+00	
00000000-0000-0000-0000-000000000000	bf0d1236-7773-4860-84cd-6e34b1e7237b	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 15:29:32.645992+00	
00000000-0000-0000-0000-000000000000	96c7c53a-7ebd-4b41-868b-8cdac1b95cd7	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 16:27:47.066035+00	
00000000-0000-0000-0000-000000000000	6f5adbe0-cdd7-47f5-9bf5-59f8cf34ae6e	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 16:27:47.082499+00	
00000000-0000-0000-0000-000000000000	4f03477b-b702-4bc4-b6d4-e012152d4595	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 16:31:24.442731+00	
00000000-0000-0000-0000-000000000000	4e8d820a-cfc9-4c98-943b-1606b2a4d1cc	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 16:31:24.444564+00	
00000000-0000-0000-0000-000000000000	d99a2bd4-8438-4a1c-84cc-371bfa941fc4	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-17 16:32:29.212733+00	
00000000-0000-0000-0000-000000000000	a98ad698-ce98-4e21-b1af-bcdf0320d786	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-17 16:36:02.453141+00	
00000000-0000-0000-0000-000000000000	dfbd67f5-8b77-4b1e-b728-e6e0b5991f48	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 16:22:21.660664+00	
00000000-0000-0000-0000-000000000000	2c865730-729a-45b5-8fd2-1a70a4be3371	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 16:22:21.675528+00	
00000000-0000-0000-0000-000000000000	03c6dff8-a57b-4879-8381-00033b736d2b	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 16:50:35.522327+00	
00000000-0000-0000-0000-000000000000	768d76fe-c912-447e-bc42-9d3c72c188bd	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 16:50:35.530989+00	
00000000-0000-0000-0000-000000000000	2b3d5588-ccf0-4e92-b0ac-f5df6d888333	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 17:20:51.346348+00	
00000000-0000-0000-0000-000000000000	6ca5b1d8-b9db-48fb-bc28-25f89f09bcc3	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 17:20:51.353002+00	
00000000-0000-0000-0000-000000000000	52f09165-771c-4fb0-9f27-416df2e4dc59	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 09:21:40.564048+00	
00000000-0000-0000-0000-000000000000	01c5023c-b124-4d7e-9c81-21687990d98f	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 09:21:40.58796+00	
00000000-0000-0000-0000-000000000000	50d5d046-5f7f-4b0e-be67-9c448e272005	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 10:20:10.318957+00	
00000000-0000-0000-0000-000000000000	242ef99d-17ef-49c9-af11-9e00129849f1	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 10:20:10.334274+00	
00000000-0000-0000-0000-000000000000	f6233460-55ee-405f-b6d4-08e6c0c0c38e	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 10:33:56.02046+00	
00000000-0000-0000-0000-000000000000	a0a24b64-cf8a-409f-93bb-9c99d38f0c17	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 10:34:54.04451+00	
00000000-0000-0000-0000-000000000000	35867031-66cf-4906-a2ee-41f4479183ad	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 10:37:10.892038+00	
00000000-0000-0000-0000-000000000000	56f60ceb-bfc3-4d4e-8c30-3d24f883e29f	{"action":"login","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-20 10:55:03.944363+00	
00000000-0000-0000-0000-000000000000	5dd1008c-de8c-48f9-b426-73893725c0cb	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 11:53:34.511289+00	
00000000-0000-0000-0000-000000000000	9d78d41f-972e-42eb-9e28-5f5ddad1edf2	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 11:53:34.523184+00	
00000000-0000-0000-0000-000000000000	0c454aa6-b2ce-4825-9ac6-667a90010fd4	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 12:07:57.831413+00	
00000000-0000-0000-0000-000000000000	d879127d-19f8-4707-8ea7-4e023dd5d6a8	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 12:07:57.848964+00	
00000000-0000-0000-0000-000000000000	3a854418-511c-48cc-9cf2-2839c67a0f0c	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 13:06:27.500956+00	
00000000-0000-0000-0000-000000000000	2a0cb909-54de-4fd8-8efe-b21211c02b42	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 13:06:27.517858+00	
00000000-0000-0000-0000-000000000000	921e2195-4ff2-4714-9dce-1a7087f881e9	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 14:04:57.596503+00	
00000000-0000-0000-0000-000000000000	99f5aa6d-4659-49c1-a306-984884b4952a	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 14:04:57.615882+00	
00000000-0000-0000-0000-000000000000	42cfe27f-4a42-4840-9b83-2da3b0650148	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 15:03:27.452654+00	
00000000-0000-0000-0000-000000000000	72b8f0a8-820b-4d80-8bca-69bb560c3601	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 15:03:27.471358+00	
00000000-0000-0000-0000-000000000000	c923dab3-5276-47c5-8dc4-f2adab46bbdc	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 15:30:12.345593+00	
00000000-0000-0000-0000-000000000000	38aa9de2-5aaf-4d90-8e15-2e1fc35eb0b2	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 15:30:12.357998+00	
00000000-0000-0000-0000-000000000000	145096ee-aa36-4c2d-9d25-7f533f2e25e9	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 16:01:57.533417+00	
00000000-0000-0000-0000-000000000000	4e23417a-70ea-4317-82dc-91abcf672216	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 16:01:57.559039+00	
00000000-0000-0000-0000-000000000000	4131627f-65f9-4fd2-a953-937b03ce60cc	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 16:15:40.345745+00	
00000000-0000-0000-0000-000000000000	1c6a7227-72cb-4fe9-91dc-d850e340112d	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 16:15:40.354553+00	
00000000-0000-0000-0000-000000000000	3f56b52e-5948-4678-a24d-7771ae8795c1	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 17:00:27.398976+00	
00000000-0000-0000-0000-000000000000	e1ff98f7-c0d9-4814-894a-fedd9db2ab58	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 17:00:27.409431+00	
00000000-0000-0000-0000-000000000000	6f8f1047-0333-4edd-aa0e-6615b87a3848	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 17:14:10.293547+00	
00000000-0000-0000-0000-000000000000	7a81e316-ab71-4971-b32c-793960118037	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 17:14:10.310222+00	
00000000-0000-0000-0000-000000000000	7174b844-99a6-4be0-80bd-d9203032f972	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 17:58:57.367328+00	
00000000-0000-0000-0000-000000000000	e6cb0533-2a00-4626-aa96-fbb2baa7b952	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 17:58:57.381498+00	
00000000-0000-0000-0000-000000000000	3c394f2b-84c5-40c8-b72f-f8e2e3a02069	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 18:12:40.443123+00	
00000000-0000-0000-0000-000000000000	39a9441c-2443-4413-a284-261a6d337bbd	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-20 18:12:40.462876+00	
00000000-0000-0000-0000-000000000000	3a4a7189-70e3-4356-a801-719953441b79	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 06:12:13.460827+00	
00000000-0000-0000-0000-000000000000	c99123cd-2222-4469-9b3c-8bdf37acc4b0	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 06:12:13.490178+00	
00000000-0000-0000-0000-000000000000	8d60a0fd-aa45-4fa5-9f37-f4c881d8b1ba	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 07:10:43.35687+00	
00000000-0000-0000-0000-000000000000	6cf0fb78-ce36-4fe7-8534-2dca9f5392c5	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 07:10:43.374258+00	
00000000-0000-0000-0000-000000000000	6e9985fb-5814-4d70-a0a3-b23043af3de2	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 08:09:13.393578+00	
00000000-0000-0000-0000-000000000000	d2552921-d713-4326-a3a0-c44c27b16b0e	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 08:09:13.411296+00	
00000000-0000-0000-0000-000000000000	46dd9a75-a8cb-4f67-a817-c7bfae164633	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 09:07:43.452314+00	
00000000-0000-0000-0000-000000000000	69c0a6e2-f347-421c-8628-fcbb764d9ceb	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 09:07:43.468527+00	
00000000-0000-0000-0000-000000000000	2ac427ff-900a-4482-99dc-edea7f40288b	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 10:06:13.508115+00	
00000000-0000-0000-0000-000000000000	fad0524b-a760-47ea-9836-151f9b799ac9	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 10:06:13.534132+00	
00000000-0000-0000-0000-000000000000	63b5e115-e232-4ccf-a993-35160fc60028	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 11:08:27.212891+00	
00000000-0000-0000-0000-000000000000	181ce83a-07d2-4ae7-a967-81f5d82bb544	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 11:08:27.230031+00	
00000000-0000-0000-0000-000000000000	74dcd616-7e6c-4d65-89b0-e13da049083f	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 12:06:57.499021+00	
00000000-0000-0000-0000-000000000000	56949ace-0d50-4862-a2a1-905a4125f522	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 12:06:57.514209+00	
00000000-0000-0000-0000-000000000000	282f1acb-959a-4ccf-89fd-52f86fcfbb71	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 13:05:27.565453+00	
00000000-0000-0000-0000-000000000000	5e2bf908-8ea3-4760-bc60-98999b69b0da	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 13:05:27.580948+00	
00000000-0000-0000-0000-000000000000	29eccedc-4e59-4171-9b3a-5021cb45084e	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 14:03:57.477554+00	
00000000-0000-0000-0000-000000000000	35ff9895-bb65-479b-bff7-627588bf37de	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 14:03:57.49113+00	
00000000-0000-0000-0000-000000000000	9daff9e9-ab38-4e97-a34c-d6187da61147	{"action":"token_refreshed","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 15:02:27.522345+00	
00000000-0000-0000-0000-000000000000	04751e6a-1841-4fe6-be1b-33f51ced830a	{"action":"token_revoked","actor_id":"8853418f-5b4e-4880-b5bb-88017b44ac4e","actor_username":"ikarovin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 15:02:27.543183+00	
00000000-0000-0000-0000-000000000000	3b5483a9-5ea8-410a-a083-9343148cc745	{"action":"token_refreshed","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 16:51:35.565855+00	
00000000-0000-0000-0000-000000000000	3f2174d2-7bcc-4d3e-b970-c365cf44dc74	{"action":"token_revoked","actor_id":"c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d","actor_username":"ablepov@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 16:51:35.578803+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	{"sub": "c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d", "email": "ablepov@gmail.com", "email_verified": true, "phone_verified": false}	email	2025-10-14 13:20:19.231566+00	2025-10-14 13:20:19.231618+00	2025-10-14 13:20:19.231618+00	04386f37-ff5a-4ee5-a310-ff7ddd285e6d
8853418f-5b4e-4880-b5bb-88017b44ac4e	8853418f-5b4e-4880-b5bb-88017b44ac4e	{"sub": "8853418f-5b4e-4880-b5bb-88017b44ac4e", "email": "ikarovin@gmail.com", "email_verified": true, "phone_verified": false}	email	2025-10-15 18:51:02.333357+00	2025-10-15 18:51:02.333411+00	2025-10-15 18:51:02.333411+00	e83f67f5-3090-47c1-bfa7-30082e597460
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
83318309-ec5f-4f11-b2c3-73f34e3cbb29	2025-10-14 13:20:42.407778+00	2025-10-14 13:20:42.407778+00	otp	b52a8d07-bf7c-4c81-856a-7928e0eb16cc
205ab2ff-ee7a-49f0-9468-1c4539d550b8	2025-10-14 13:20:45.445531+00	2025-10-14 13:20:45.445531+00	password	da084c06-8499-4700-bf75-1fe249e46a47
20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a	2025-10-14 13:35:24.099528+00	2025-10-14 13:35:24.099528+00	password	eb928994-b763-4d2a-ae09-31ba9661eaf4
c353f5ec-521c-4ab3-b4e1-07720f0929cf	2025-10-14 15:48:22.868255+00	2025-10-14 15:48:22.868255+00	password	052165b5-54fa-42e2-8501-a73cb482975f
5b04871b-4a28-435f-908e-a476cc389159	2025-10-15 18:51:39.112648+00	2025-10-15 18:51:39.112648+00	otp	dfa09428-0d91-4294-9682-9bf5b3c871c7
856c8b10-0b79-4f6b-adea-e813687ffc35	2025-10-15 18:51:55.164052+00	2025-10-15 18:51:55.164052+00	password	60d912d9-06aa-40f9-a11e-f4a60a56b4b2
652adb29-6e8d-472f-886c-d5c2fb29286b	2025-10-16 20:29:14.240293+00	2025-10-16 20:29:14.240293+00	password	db6c5dbf-279b-4d6f-b6ec-6818a4634576
48f1ebe4-82ee-423c-bfc6-4b64695d1fa8	2025-10-16 20:52:14.07017+00	2025-10-16 20:52:14.07017+00	password	b69096e4-a3f5-42a9-b191-0352bcc3a509
f246be8a-bb7d-4d1b-ace3-e6ef8fdd5385	2025-10-16 20:53:14.19704+00	2025-10-16 20:53:14.19704+00	password	5c0b17c6-0ff7-45f6-8a26-0cbaba00e854
b5af57a0-d29c-4b26-898c-bde67a71ddee	2025-10-17 16:32:29.227795+00	2025-10-17 16:32:29.227795+00	password	6acf0d1c-75c8-43c0-a999-c268f95ae666
3bce6b4d-7c4e-4c17-be93-2011c155e4ab	2025-10-17 16:36:02.501223+00	2025-10-17 16:36:02.501223+00	password	a6ccc6e4-8221-4439-b5d7-89c32a7c9384
e5b35faf-7f11-4076-91dc-30d4362671b9	2025-10-20 10:33:56.097244+00	2025-10-20 10:33:56.097244+00	password	459df3f0-d379-4290-a2ab-7b19c154cc4c
6d713445-6508-412e-ac2c-a4c2ab0c3219	2025-10-20 10:34:54.051416+00	2025-10-20 10:34:54.051416+00	password	c41d6127-ecbe-4db7-b71d-553d588d4392
c618078f-b1f0-4bd3-ba59-a33be38a1510	2025-10-20 10:37:10.901219+00	2025-10-20 10:37:10.901219+00	password	c177df4f-c00d-4ce1-9413-eca4f9b7bb8e
185081b1-be3c-41ef-bc05-bc8c94c33c47	2025-10-20 10:55:04.01507+00	2025-10-20 10:55:04.01507+00	password	21d80aed-73c9-44fc-87d3-67cc1bab2cd2
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	1	jejgi727aemo	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-14 13:20:42.396442+00	2025-10-14 13:20:42.396442+00	\N	83318309-ec5f-4f11-b2c3-73f34e3cbb29
00000000-0000-0000-0000-000000000000	3	u47qm7qldprj	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 13:35:24.094472+00	2025-10-14 14:33:37.980774+00	\N	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	2	apakfahcysjv	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 13:20:45.443518+00	2025-10-14 15:46:20.131951+00	\N	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	4	w5lplh6qqoi3	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 14:33:37.995606+00	2025-10-14 16:06:51.806297+00	u47qm7qldprj	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	5	4jtsbmaqofl2	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 15:46:20.148114+00	2025-10-14 16:44:24.067182+00	apakfahcysjv	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	7	f6vjc25b6gko	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 16:06:51.818909+00	2025-10-14 17:05:13.023101+00	w5lplh6qqoi3	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	8	qkivzpwzmiax	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 16:44:24.088454+00	2025-10-14 17:43:47.232247+00	4jtsbmaqofl2	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	9	lvflhk36x266	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 17:05:13.032814+00	2025-10-14 18:03:20.691706+00	f6vjc25b6gko	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	10	uj5vnsroug6a	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 17:43:47.241853+00	2025-10-14 18:42:34.305879+00	qkivzpwzmiax	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	12	vh22wvguoizz	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 18:42:34.313866+00	2025-10-14 19:41:47.542243+00	uj5vnsroug6a	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	13	qrkrj7o2fbmu	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 19:41:47.55102+00	2025-10-15 11:08:01.433368+00	vh22wvguoizz	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	14	5qsrrvh73uco	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 11:08:01.449887+00	2025-10-15 12:06:11.339507+00	qrkrj7o2fbmu	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	15	hbqzyf65x4h5	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 12:06:11.346347+00	2025-10-15 13:04:36.053859+00	5qsrrvh73uco	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	11	hxbss4pimgxz	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 18:03:20.70583+00	2025-10-15 13:36:49.750734+00	lvflhk36x266	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	16	o766rf6acmci	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 13:04:36.069291+00	2025-10-15 14:03:04.755576+00	hbqzyf65x4h5	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	17	fzi76g4oty2h	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 13:36:49.762982+00	2025-10-15 14:34:53.2854+00	hxbss4pimgxz	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	18	e7svtuibrm7u	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 14:03:04.770657+00	2025-10-15 15:01:04.917683+00	o766rf6acmci	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	19	ljzb7c6eybjd	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 14:34:53.296745+00	2025-10-15 15:33:23.263685+00	fzi76g4oty2h	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	20	fdq2nppeljqe	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 15:01:04.92173+00	2025-10-15 15:59:04.871367+00	e7svtuibrm7u	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	21	unrda3hilgms	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 15:33:23.271333+00	2025-10-15 16:31:53.262081+00	ljzb7c6eybjd	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	22	ndi6nzv4v7hw	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 15:59:04.878556+00	2025-10-15 16:57:05.036556+00	fdq2nppeljqe	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	23	5j7afcnbvqi2	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 16:31:53.270953+00	2025-10-15 17:30:23.271426+00	unrda3hilgms	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	24	4ct3u3blo4xp	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 16:57:05.045915+00	2025-10-15 17:55:35.052151+00	ndi6nzv4v7hw	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	25	4x63illg5gf4	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 17:30:23.279824+00	2025-10-15 18:28:48.177504+00	5j7afcnbvqi2	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	27	u5ac2dq4e3ni	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-15 18:28:48.188648+00	2025-10-15 18:28:48.188648+00	4x63illg5gf4	20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a
00000000-0000-0000-0000-000000000000	28	j63ojdst3ydc	8853418f-5b4e-4880-b5bb-88017b44ac4e	f	2025-10-15 18:51:39.102565+00	2025-10-15 18:51:39.102565+00	\N	5b04871b-4a28-435f-908e-a476cc389159
00000000-0000-0000-0000-000000000000	26	cafygovk7hn7	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 17:55:35.06675+00	2025-10-15 19:34:37.47361+00	4ct3u3blo4xp	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	6	cp5hap6eooow	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-14 15:48:22.866244+00	2025-10-15 19:43:40.324535+00	\N	c353f5ec-521c-4ab3-b4e1-07720f0929cf
00000000-0000-0000-0000-000000000000	31	earu26hlzpev	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-15 19:43:40.332496+00	2025-10-15 19:43:40.332496+00	cp5hap6eooow	c353f5ec-521c-4ab3-b4e1-07720f0929cf
00000000-0000-0000-0000-000000000000	29	3b6zh5j2xrai	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-15 18:51:55.162909+00	2025-10-15 19:51:12.225959+00	\N	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	32	puxjxcjcmae5	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-15 19:51:12.227436+00	2025-10-16 13:11:52.210161+00	3b6zh5j2xrai	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	30	moeycepbnjii	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-15 19:34:37.491272+00	2025-10-16 18:37:21.215979+00	cafygovk7hn7	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	34	2btbuskrwnhn	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-16 18:37:21.23133+00	2025-10-16 19:35:51.320499+00	moeycepbnjii	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	36	hy3fmtt42f2i	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-16 20:29:14.207141+00	2025-10-16 20:29:14.207141+00	\N	652adb29-6e8d-472f-886c-d5c2fb29286b
00000000-0000-0000-0000-000000000000	35	v3ugwwiejncr	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-16 19:35:51.336477+00	2025-10-16 20:34:21.10668+00	2btbuskrwnhn	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	38	worxxjc3tyc5	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-16 20:52:14.050956+00	2025-10-16 20:52:14.050956+00	\N	48f1ebe4-82ee-423c-bfc6-4b64695d1fa8
00000000-0000-0000-0000-000000000000	39	pklgfjg7nniz	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-16 20:53:14.194544+00	2025-10-16 20:53:14.194544+00	\N	f246be8a-bb7d-4d1b-ace3-e6ef8fdd5385
00000000-0000-0000-0000-000000000000	37	wj4fck2ppla2	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-16 20:34:21.112358+00	2025-10-17 15:29:32.648399+00	v3ugwwiejncr	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	40	vjo5bslhifgo	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-17 15:29:32.672955+00	2025-10-17 16:27:47.0832+00	wj4fck2ppla2	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	33	tv4nswbmu7y7	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-16 13:11:52.230958+00	2025-10-17 16:31:24.445134+00	puxjxcjcmae5	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	43	lswetoxgwk5d	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-17 16:32:29.224043+00	2025-10-17 16:32:29.224043+00	\N	b5af57a0-d29c-4b26-898c-bde67a71ddee
00000000-0000-0000-0000-000000000000	42	xh44uyjyu2tk	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-17 16:31:24.445837+00	2025-10-19 16:22:21.676882+00	tv4nswbmu7y7	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	41	47sbs2kjresl	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-17 16:27:47.098823+00	2025-10-19 16:50:35.532913+00	vjo5bslhifgo	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	45	uk5mkyjm7gkf	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-19 16:22:21.694305+00	2025-10-19 17:20:51.356606+00	xh44uyjyu2tk	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	46	j3uwh6tnq44q	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-19 16:50:35.546866+00	2025-10-20 09:21:40.59101+00	47sbs2kjresl	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	48	xd73bsxbaowk	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 09:21:40.614306+00	2025-10-20 10:20:10.334933+00	j3uwh6tnq44q	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	50	pdbffyr7wmr5	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-20 10:33:56.070305+00	2025-10-20 10:33:56.070305+00	\N	e5b35faf-7f11-4076-91dc-30d4362671b9
00000000-0000-0000-0000-000000000000	51	uyp3tdtcp7gb	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-20 10:34:54.046755+00	2025-10-20 10:34:54.046755+00	\N	6d713445-6508-412e-ac2c-a4c2ab0c3219
00000000-0000-0000-0000-000000000000	49	da3udfpb55za	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 10:20:10.353993+00	2025-10-20 12:07:57.850193+00	xd73bsxbaowk	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	44	2ov56i3mvkfr	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-17 16:36:02.48383+00	2025-10-20 15:30:12.360533+00	\N	3bce6b4d-7c4e-4c17-be93-2011c155e4ab
00000000-0000-0000-0000-000000000000	47	sdegoyij3utg	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-19 17:20:51.363458+00	2025-10-20 16:15:40.35511+00	uk5mkyjm7gkf	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	52	bjglsn6piwqd	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-20 10:37:10.894409+00	2025-10-20 10:37:10.894409+00	\N	c618078f-b1f0-4bd3-ba59-a33be38a1510
00000000-0000-0000-0000-000000000000	53	hm2cqa4o4s4v	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 10:55:03.986505+00	2025-10-20 11:53:34.524438+00	\N	185081b1-be3c-41ef-bc05-bc8c94c33c47
00000000-0000-0000-0000-000000000000	54	jartobq3jjw6	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-20 11:53:34.530572+00	2025-10-20 11:53:34.530572+00	hm2cqa4o4s4v	185081b1-be3c-41ef-bc05-bc8c94c33c47
00000000-0000-0000-0000-000000000000	55	cs2s43yfn2fa	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 12:07:57.867348+00	2025-10-20 13:06:27.518522+00	da3udfpb55za	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	56	m22o6jlux2y4	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 13:06:27.536602+00	2025-10-20 14:04:57.622923+00	cs2s43yfn2fa	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	57	3vxjl6npw5d7	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 14:04:57.63573+00	2025-10-20 15:03:27.474177+00	m22o6jlux2y4	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	58	qscsh3q3z776	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 15:03:27.488347+00	2025-10-20 16:01:57.559841+00	3vxjl6npw5d7	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	60	5amxs5zuy45v	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 16:01:57.57907+00	2025-10-20 17:00:27.410812+00	qscsh3q3z776	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	61	32foxc3quiju	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-20 16:15:40.365619+00	2025-10-20 17:14:10.310944+00	sdegoyij3utg	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	62	3ga7oc4u66pv	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 17:00:27.426885+00	2025-10-20 17:58:57.382205+00	5amxs5zuy45v	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	64	3couu36ea6g6	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-20 17:58:57.392357+00	2025-10-20 17:58:57.392357+00	3ga7oc4u66pv	205ab2ff-ee7a-49f0-9468-1c4539d550b8
00000000-0000-0000-0000-000000000000	63	gghtp2xujuzx	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-20 17:14:10.326908+00	2025-10-20 18:12:40.465022+00	32foxc3quiju	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	65	qwjrj6z53b77	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-20 18:12:40.483152+00	2025-10-21 06:12:13.493287+00	gghtp2xujuzx	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	66	ooutbqwr7afo	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-21 06:12:13.514934+00	2025-10-21 07:10:43.375527+00	qwjrj6z53b77	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	67	swsnfbup6pw5	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-21 07:10:43.386635+00	2025-10-21 08:09:13.413902+00	ooutbqwr7afo	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	68	ssx6nrrgieww	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-21 08:09:13.428071+00	2025-10-21 09:07:43.469817+00	swsnfbup6pw5	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	69	bog2sroqa2tl	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-21 09:07:43.481991+00	2025-10-21 10:06:13.535447+00	ssx6nrrgieww	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	70	hhp4autu5hv4	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-21 10:06:13.551264+00	2025-10-21 11:08:27.231522+00	bog2sroqa2tl	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	71	5y2drevyoeby	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-21 11:08:27.244752+00	2025-10-21 12:06:57.515576+00	hhp4autu5hv4	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	72	4yzruinuplsr	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-21 12:06:57.528483+00	2025-10-21 13:05:27.583295+00	5y2drevyoeby	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	73	fdfs2yaztdyk	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-21 13:05:27.598835+00	2025-10-21 14:03:57.498316+00	4yzruinuplsr	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	74	bjobmpauyv4e	8853418f-5b4e-4880-b5bb-88017b44ac4e	t	2025-10-21 14:03:57.515805+00	2025-10-21 15:02:27.545726+00	fdfs2yaztdyk	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	75	cign4tib3dgq	8853418f-5b4e-4880-b5bb-88017b44ac4e	f	2025-10-21 15:02:27.562896+00	2025-10-21 15:02:27.562896+00	bjobmpauyv4e	856c8b10-0b79-4f6b-adea-e813687ffc35
00000000-0000-0000-0000-000000000000	59	sdgkbdeayw2k	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	t	2025-10-20 15:30:12.371087+00	2025-10-21 16:51:35.582313+00	2ov56i3mvkfr	3bce6b4d-7c4e-4c17-be93-2011c155e4ab
00000000-0000-0000-0000-000000000000	76	eozl2yyiuzus	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	f	2025-10-21 16:51:35.593006+00	2025-10-21 16:51:35.593006+00	sdgkbdeayw2k	3bce6b4d-7c4e-4c17-be93-2011c155e4ab
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id) FROM stdin;
83318309-ec5f-4f11-b2c3-73f34e3cbb29	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-14 13:20:42.389312+00	2025-10-14 13:20:42.389312+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
652adb29-6e8d-472f-886c-d5c2fb29286b	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-16 20:29:14.190663+00	2025-10-16 20:29:14.190663+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
205ab2ff-ee7a-49f0-9468-1c4539d550b8	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-14 13:20:45.442718+00	2025-10-20 17:58:57.407725+00	\N	aal1	\N	2025-10-20 17:58:57.40764	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
48f1ebe4-82ee-423c-bfc6-4b64695d1fa8	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-16 20:52:14.037335+00	2025-10-16 20:52:14.037335+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
f246be8a-bb7d-4d1b-ace3-e6ef8fdd5385	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-16 20:53:14.193097+00	2025-10-16 20:53:14.193097+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
b5af57a0-d29c-4b26-898c-bde67a71ddee	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-17 16:32:29.215387+00	2025-10-17 16:32:29.215387+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	176.192.216.30	\N	\N
e5b35faf-7f11-4076-91dc-30d4362671b9	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-20 10:33:56.047965+00	2025-10-20 10:33:56.047965+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
6d713445-6508-412e-ac2c-a4c2ab0c3219	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-20 10:34:54.045975+00	2025-10-20 10:34:54.045975+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
c618078f-b1f0-4bd3-ba59-a33be38a1510	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-20 10:37:10.893061+00	2025-10-20 10:37:10.893061+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
185081b1-be3c-41ef-bc05-bc8c94c33c47	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-20 10:55:03.969355+00	2025-10-20 11:53:34.546658+00	\N	aal1	\N	2025-10-20 11:53:34.544844	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
20c2e1b8-b2e9-46a9-8d7b-a0b9353e5b3a	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-14 13:35:24.090393+00	2025-10-15 18:28:48.195361+00	\N	aal1	\N	2025-10-15 18:28:48.195288	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
5b04871b-4a28-435f-908e-a476cc389159	8853418f-5b4e-4880-b5bb-88017b44ac4e	2025-10-15 18:51:39.095255+00	2025-10-15 18:51:39.095255+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
856c8b10-0b79-4f6b-adea-e813687ffc35	8853418f-5b4e-4880-b5bb-88017b44ac4e	2025-10-15 18:51:55.162176+00	2025-10-21 15:02:27.579562+00	\N	aal1	\N	2025-10-21 15:02:27.579481	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
c353f5ec-521c-4ab3-b4e1-07720f0929cf	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-14 15:48:22.860966+00	2025-10-15 19:43:40.342806+00	\N	aal1	\N	2025-10-15 19:43:40.341484	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	37.233.85.147	\N	\N
3bce6b4d-7c4e-4c17-be93-2011c155e4ab	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	2025-10-17 16:36:02.471834+00	2025-10-21 16:51:35.608101+00	\N	aal1	\N	2025-10-21 16:51:35.608003	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1	37.233.85.147	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	8853418f-5b4e-4880-b5bb-88017b44ac4e	authenticated	authenticated	ikarovin@gmail.com	$2a$10$tkLdC8Imurq0LQbBypPjgOfM2IPcjdN0JVmlRktBLKHyhLFZ0YWd2	2025-10-15 18:51:39.090337+00	\N		2025-10-15 18:51:02.358491+00		\N			\N	2025-10-15 18:51:55.162084+00	{"provider": "email", "providers": ["email"]}	{"sub": "8853418f-5b4e-4880-b5bb-88017b44ac4e", "email": "ikarovin@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-10-15 18:51:02.297363+00	2025-10-21 15:02:27.572044+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	authenticated	authenticated	ablepov@gmail.com	$2a$10$atAZwYOOcoit8fawGU1yLOi67dim12qaV5hEjJwAD0xiNZKCTRwUq	2025-10-14 13:20:42.384834+00	\N		2025-10-14 13:20:19.246489+00		\N			\N	2025-10-20 10:55:03.969264+00	{"provider": "email", "providers": ["email"]}	{"sub": "c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d", "email": "ablepov@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-10-14 13:20:19.190677+00	2025-10-21 16:51:35.598868+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercises (id, user_id, type, goal, created_at) FROM stdin;
8f98cf53-a984-418e-af3f-32bd0d52a75c	8853418f-5b4e-4880-b5bb-88017b44ac4e	pullups	100	2025-10-15 18:52:09.875975+00
7004b6af-023c-49da-a687-4cff66d69b52	8853418f-5b4e-4880-b5bb-88017b44ac4e	pushups	100	2025-10-15 18:52:09.875975+00
7ef4d865-94d3-4f22-9e06-211df4320fda	8853418f-5b4e-4880-b5bb-88017b44ac4e	squats	100	2025-10-15 18:52:09.875975+00
ac303c84-21a1-4c2b-a367-2323a765fa93	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	Подтягивания	100	2025-10-14 13:36:19.306031+00
b46c7ed9-133f-4d4a-94a3-90f715fedc75	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	Отжимания	100	2025-10-14 13:36:19.306031+00
8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	Присяд	100	2025-10-14 13:36:19.306031+00
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (user_id, timezone, created_at) FROM stdin;
c032dc77-f1b3-4d9d-a42d-1ff6b8d9356d	Europe/Moscow	2025-10-14 13:29:55.85447+00
\.


--
-- Data for Name: sets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sets (id, exercise_id, reps, created_at, note, source, deleted_at) FROM stdin;
f0215934-f7e2-402e-b416-2856d39e5371	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 13:40:11.872229+00	\N	quickbutton	\N
aac00af9-3edb-444b-8892-df415fbd6ab6	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 13:50:07.727121+00	\N	quickbutton	\N
b58c71a8-69d6-42a4-b04d-cc4c7e7c68c7	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 13:53:12.004273+00	\N	quickbutton	\N
086855e3-03e1-4f0d-85ae-772f7e1bca6e	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 13:58:12.384581+00	\N	quickbutton	\N
15570c1b-576e-4eb5-a11b-b47fee31710f	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 13:58:14.453349+00	\N	quickbutton	\N
dafa8965-bcc0-4916-ac01-d8ce48720a04	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 13:58:15.502616+00	\N	quickbutton	\N
317f2642-937b-47d2-ab9e-f7a806f699c5	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 13:58:16.449514+00	\N	quickbutton	\N
b196a66d-8b92-46c2-84a5-7285b39ed160	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 13:58:17.287101+00	\N	quickbutton	\N
24187473-48d0-4f62-8d0d-ad74acd8b393	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 13:58:18.38099+00	\N	quickbutton	\N
7df252d0-ca0d-480e-93fa-b54a60bfcc5d	ac303c84-21a1-4c2b-a367-2323a765fa93	6	2025-10-14 13:58:23.702532+00	\N	quickbutton	\N
8be415a0-7c2f-4a43-89f4-4b04d13f2d13	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-14 13:58:25.67927+00	\N	quickbutton	\N
43c13988-e93c-4726-9fbc-48031cca8738	b46c7ed9-133f-4d4a-94a3-90f715fedc75	1	2025-10-14 13:58:26.674995+00	\N	quickbutton	\N
bb10870b-18f3-471f-814d-1b4d305a6cb0	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 15:46:24.780095+00	\N	quickbutton	\N
7b1cc803-e294-411d-8a40-22be66ae837d	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-14 15:46:32.401175+00	\N	quickbutton	\N
f3ee6bc4-3931-484b-a315-d2389dd4bbaa	ac303c84-21a1-4c2b-a367-2323a765fa93	7	2025-10-14 15:46:34.441928+00	\N	quickbutton	\N
468c7dd3-37ad-407e-9f50-c404e3da7f56	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-14 15:46:35.477791+00	\N	quickbutton	\N
f663041d-bb60-49a4-9c8b-1692008b5c07	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 15:48:29.519552+00	\N	quickbutton	\N
e347291b-4174-40d7-88bf-7ae9b4786783	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 16:05:43.81882+00	\N	quickbutton	\N
af00161b-db8e-4957-a2e4-f9cff72de02d	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-14 16:05:46.370365+00	\N	quickbutton	\N
81ed0583-e9a2-40aa-a15d-74fb99b2c056	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	3	2025-10-14 16:05:52.428494+00	\N	quickbutton	\N
4d66411e-a7f6-43fb-ac63-1d4169e069fd	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	3	2025-10-14 16:05:53.136203+00	\N	quickbutton	\N
2ee6e857-d0c0-4eb2-a893-a6d1836768a4	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	3	2025-10-14 16:05:53.931599+00	\N	quickbutton	\N
1dd48dfe-9ba9-43fd-be5f-9b22e2d1ac23	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	3	2025-10-14 16:05:54.733539+00	\N	quickbutton	\N
58d1fd45-d89d-427e-b190-1612deadd4d7	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	3	2025-10-14 16:05:55.396487+00	\N	quickbutton	\N
efbee0be-168c-41f9-a3b4-e2007e05433b	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	3	2025-10-14 16:05:56.067015+00	\N	quickbutton	\N
c97d2d98-309a-46c6-82ea-ef51ee4d990e	b46c7ed9-133f-4d4a-94a3-90f715fedc75	5	2025-10-14 16:05:57.263274+00	\N	quickbutton	\N
c4805fd2-2a6b-4a8e-8c75-4af80102ced1	b46c7ed9-133f-4d4a-94a3-90f715fedc75	5	2025-10-14 16:05:57.919378+00	\N	quickbutton	\N
25b12340-4a9e-4662-afe7-4b636e8ef112	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 16:06:06.395371+00	\N	quickbutton	\N
c48753d5-a68c-4580-8b90-734174442dfa	ac303c84-21a1-4c2b-a367-2323a765fa93	7	2025-10-14 16:06:17.746062+00	\N	quickbutton	\N
c21bb0d4-b90f-4cf5-9ceb-079beeb95d7f	ac303c84-21a1-4c2b-a367-2323a765fa93	9	2025-10-14 16:06:18.713881+00	\N	quickbutton	\N
ad2479d0-7094-4e1a-a097-5ac5b3291c9c	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 16:07:31.714214+00	\N	quickbutton	\N
38ce6709-8fef-4e3d-96b3-aaedca5c57d8	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 16:08:38.506678+00	\N	quickbutton	\N
e0ad894a-bb84-46b6-b671-cd08a9c9519d	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-14 16:09:19.601397+00	\N	quickbutton	\N
f7b9c584-bc69-4930-b43a-8a7ffea95eb9	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-14 16:09:20.741574+00	\N	quickbutton	\N
80bc9eaf-51d5-4922-b5cc-d5e21671d98e	ac303c84-21a1-4c2b-a367-2323a765fa93	2	2025-10-14 16:09:21.662734+00	\N	quickbutton	\N
a81d4dc8-2bd2-4602-a59f-88e82b806129	b46c7ed9-133f-4d4a-94a3-90f715fedc75	5	2025-10-14 16:09:23.803334+00	\N	quickbutton	\N
3128f7c3-7b4a-4e85-b18e-fb2c5703aeb3	b46c7ed9-133f-4d4a-94a3-90f715fedc75	7	2025-10-14 16:09:24.503888+00	\N	quickbutton	\N
77476a30-0670-4802-ba18-123c29410daa	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-14 16:09:26.307959+00	\N	quickbutton	\N
257b32ab-e45d-4c49-9097-dac961b4f6e7	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	10	2025-10-14 16:09:26.990192+00	\N	quickbutton	\N
4a9142b4-94a5-4a5d-ab69-1da1dba1212a	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	11	2025-10-14 16:09:27.668285+00	\N	quickbutton	\N
d7b3a3ea-5124-43f3-9e75-74ed338de1ae	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	12	2025-10-14 16:09:28.353871+00	\N	quickbutton	\N
b900198b-0984-41c9-a0f1-45230fced773	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	13	2025-10-14 16:09:29.058464+00	\N	quickbutton	\N
0c753385-8fe2-4e08-931c-973324c01328	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	1	2025-10-14 16:09:30.916317+00	\N	quickbutton	\N
58470178-d5b7-46a0-99fd-68f4d53a5a2e	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	1	2025-10-14 16:09:31.807789+00	\N	quickbutton	\N
259924b0-06fe-46ac-82b0-9b6d6916ca42	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 16:12:08.271696+00	\N	quickbutton	\N
f1a7f53f-22c9-4fd2-9679-0575f1a86f9a	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 16:13:25.096103+00	\N	quickbutton	\N
cf030037-67d7-41b0-8f20-ac7653ffa790	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 16:13:51.549309+00	\N	quickbutton	\N
25160165-0ff9-404a-9a04-44c46350c882	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 16:14:37.449906+00	\N	quickbutton	\N
0c78bce6-e446-496a-9693-f8ca1d6fb34c	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 16:25:17.710068+00	\N	quickbutton	\N
43ebb233-7784-499b-8661-550ed441fe05	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-14 16:25:35.504187+00	\N	quickbutton	\N
d87fc693-c853-4e61-8f39-9c5e674bb390	b46c7ed9-133f-4d4a-94a3-90f715fedc75	10	2025-10-14 16:25:36.450563+00	\N	quickbutton	\N
b414e010-d0f0-490f-9b5f-d2509a96893d	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 16:25:39.616524+00	\N	quickbutton	\N
6b385750-09b4-4c86-ac8d-86f5c84c9b94	ac303c84-21a1-4c2b-a367-2323a765fa93	10	2025-10-14 16:25:40.905078+00	\N	quickbutton	\N
b1676377-d89a-4b0c-82bb-4cf053fba3b1	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 16:25:46.436831+00	\N	quickbutton	\N
e5a498e7-6be5-465c-9f9e-6356bfc54716	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-14 16:26:07.948972+00	\N	quickbutton	\N
b4262047-0595-4e83-9947-4873bbfab1ff	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-14 16:26:08.915755+00	\N	quickbutton	\N
72b445e5-ea4a-4b68-9055-92cac7b17db3	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-14 16:27:11.590614+00	\N	quickbutton	\N
3ff183bb-3f79-446c-ada2-8f0f42fbd827	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-14 16:27:15.388852+00	\N	quickbutton	\N
f2048b16-0b5c-44f0-a0a4-7a0e10dc6dc0	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 16:27:33.525942+00	\N	quickbutton	\N
d073d026-8cbf-4b87-9366-a29901b9e9e9	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 16:29:10.740426+00	\N	quickbutton	\N
8cef2efd-a157-4107-9032-34277c9c5a1f	ac303c84-21a1-4c2b-a367-2323a765fa93	7	2025-10-14 16:29:19.331025+00	\N	quickbutton	\N
772e64e8-d722-462c-a993-1967f080661f	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-14 16:29:32.756992+00	\N	quickbutton	\N
64644052-1d9f-49a9-add4-eeee36e40788	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 16:29:39.013456+00	\N	quickbutton	\N
36972f24-259a-4709-9025-64b59d40f641	ac303c84-21a1-4c2b-a367-2323a765fa93	10	2025-10-14 16:29:40.997663+00	\N	quickbutton	\N
07d8a5e0-088a-416b-b5c4-12d9f014f1c9	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-14 16:29:43.409858+00	\N	quickbutton	\N
0bfc298f-57ee-4ffa-9fc8-240c8a85be45	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-14 16:29:46.526894+00	\N	quickbutton	\N
c4f63735-48fc-4159-8aef-bf1cd7442c5b	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-14 16:31:24.095034+00	\N	quickbutton	\N
127d2580-f76c-4d0e-b917-19ff9cf5a758	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-14 16:34:02.542547+00	\N	quickbutton	\N
83eddbd7-05e4-40a1-a5a0-0f6e53ec1973	b46c7ed9-133f-4d4a-94a3-90f715fedc75	10	2025-10-14 16:55:45.996224+00	\N	quickbutton	\N
64007548-4aca-4e6a-ad59-054100b8e53f	b46c7ed9-133f-4d4a-94a3-90f715fedc75	1	2025-10-14 16:55:47.643979+00	\N	quickbutton	\N
f79d5d43-4bb6-4e78-85a5-781e44f9e76d	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-14 17:21:25.127445+00	\N	quickbutton	\N
1d5b7dad-c384-42c2-824d-b15136445232	ac303c84-21a1-4c2b-a367-2323a765fa93	10	2025-10-14 17:21:27.671664+00	\N	quickbutton	\N
b8e75b1f-bd35-432f-8f28-7709051e1565	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-14 17:21:41.170399+00	\N	quickbutton	\N
ac5a3c34-7570-4f62-852b-36482502fdbb	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-15 11:08:09.827694+00	\N	quickbutton	\N
04f75684-a683-47f6-88fd-f3873d7754cc	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-15 11:44:30.910581+00	\N	quickbutton	\N
2391a45d-a899-49b1-882a-9cac42e5204d	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 13:18:05.164774+00	\N	quickbutton	\N
a15b7cc0-41bc-4828-af97-a65aa35a15c4	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 13:23:45.620751+00	\N	quickbutton	\N
075d3790-ccb8-4d3f-bfc5-942354679b8a	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 13:33:07.19452+00	\N	quickbutton	\N
b9c1aa9d-abab-4d8a-a4d8-dbe061f78278	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-15 13:40:53.562611+00	\N	quickbutton	\N
42911cc5-00e3-4e8c-a404-bdea44503889	ac303c84-21a1-4c2b-a367-2323a765fa93	7	2025-10-15 13:40:54.541192+00	\N	quickbutton	\N
7dafbfef-3266-4dad-acec-84df0250ba38	ac303c84-21a1-4c2b-a367-2323a765fa93	6	2025-10-15 13:40:55.97518+00	\N	quickbutton	\N
fda9df0a-8e1c-4f0f-ac87-88dc594c0d6c	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-15 13:40:57.324314+00	\N	quickbutton	\N
e72f4b0c-fd67-488f-aed6-e8b3c927bb01	ac303c84-21a1-4c2b-a367-2323a765fa93	4	2025-10-15 13:40:58.696271+00	\N	quickbutton	\N
292a3e2b-eb7f-4a6e-a4a5-bbf50249377b	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 13:45:57.884533+00	\N	quickbutton	\N
6c5938d0-eb64-4cc0-8727-9784b8f24a60	ac303c84-21a1-4c2b-a367-2323a765fa93	2	2025-10-15 13:46:07.61455+00	\N	quickbutton	\N
dc00cf11-137d-4ec2-b997-5473c5d945aa	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 13:46:18.539332+00	\N	quickbutton	\N
75be330a-441f-4d5c-9665-ee6b004af585	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 13:50:48.471965+00	\N	quickbutton	\N
9402af64-d64e-4424-a757-c6a4c83e91a4	b46c7ed9-133f-4d4a-94a3-90f715fedc75	3	2025-10-15 13:58:12.098011+00	\N	quickbutton	\N
8093fb4a-4eb7-4f39-9ad3-ea197a5c7d64	b46c7ed9-133f-4d4a-94a3-90f715fedc75	1	2025-10-15 13:58:24.362535+00	\N	quickbutton	\N
c5f3d5b9-bb9d-45f7-b27d-0c65c5458203	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	3	2025-10-15 13:58:54.992113+00	\N	quickbutton	\N
f9cb8ff3-01fa-4a48-8b22-c4159f0aa502	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:00:08.105649+00	\N	quickbutton	\N
69d636ac-6c81-4a46-b07e-12c5cdf5ed86	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:00:16.600017+00	\N	quickbutton	\N
d29aabc5-3232-4fa5-8c47-e5d6e9295b8d	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 14:00:24.255048+00	\N	quickbutton	\N
e786a4e2-e70f-43b9-8e47-e4e96ae6609e	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:12:34.514126+00	\N	quickbutton	\N
80ab6075-ab6d-4ff4-9659-208a710b2c26	b46c7ed9-133f-4d4a-94a3-90f715fedc75	3	2025-10-15 14:16:22.090471+00	\N	quickbutton	\N
a1648990-0a92-4983-b472-19134a2e4fd2	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 14:16:24.286223+00	\N	quickbutton	\N
3ad03a7d-a9e9-45bc-9138-0cb374843cc5	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 14:16:27.7166+00	\N	quickbutton	\N
a6c2b1d7-b6a5-49f0-b4db-d4062d7979d5	ac303c84-21a1-4c2b-a367-2323a765fa93	5	2025-10-15 14:16:29.325837+00	\N	quickbutton	\N
dffccca5-15ca-4f52-861a-bce351c01d53	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:16:31.228475+00	\N	quickbutton	\N
07f734e0-74e3-4bde-8647-b80fcc0b21b6	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 14:16:33.868964+00	\N	quickbutton	\N
0bbc5834-957e-4f6c-b1d9-1a49f0dc6d4d	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 14:16:36.637625+00	\N	quickbutton	\N
7c8ee07f-8a6f-492f-ade3-4f6a7e82f0cb	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 14:16:38.299976+00	\N	quickbutton	\N
20667bde-6d40-477c-8a7d-4b3432af3835	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:16:39.247172+00	\N	quickbutton	\N
099c704c-cd8b-4dec-929d-3b412dcb420b	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:16:40.589589+00	\N	quickbutton	\N
58af7cbd-0473-498e-9c3f-770d6007e58a	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:16:41.204522+00	\N	quickbutton	\N
fed9eb84-7f2b-4923-a550-ecc0ffcd45c4	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 14:16:42.549081+00	\N	quickbutton	\N
a4f187e7-fa8a-414d-8f82-88a82fad40b5	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 14:16:43.314982+00	\N	quickbutton	\N
24e460b0-f3b3-405f-b70d-6f077930c1bf	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 14:16:43.913939+00	\N	quickbutton	\N
f9421e58-b442-435b-bd50-a3eb37ab1133	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 14:16:44.522804+00	\N	quickbutton	\N
a392cd13-f4ae-4964-b49a-935539d0f1be	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 14:16:45.157456+00	\N	quickbutton	\N
d3563bd9-98c3-431b-8650-725c6ad48af2	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 14:16:46.406431+00	\N	quickbutton	\N
6d90819e-c18b-47f9-bf1e-27ed68cba489	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 14:16:51.863066+00	\N	quickbutton	\N
61ec520e-5569-4e2c-abda-f665c6daba99	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 14:16:53.267943+00	\N	quickbutton	\N
5d596ccb-ab94-48bf-9fc5-c1eab1940eaf	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 14:16:54.640136+00	\N	quickbutton	\N
1a5d67c0-8892-4a5a-b8b0-bd926bda4c60	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:16:56.344401+00	\N	quickbutton	\N
c1027271-7d6f-4eff-ad48-777b1466f84f	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:16:57.182325+00	\N	quickbutton	\N
a4a21b8a-74a1-4e52-978f-f33dac567a8f	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:16:58.024928+00	\N	quickbutton	\N
8ca2f149-1287-4911-94dc-240d0fd52048	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:16:58.811974+00	\N	quickbutton	\N
c33c95a2-51b2-45e8-a842-6a3f8e0e0e1e	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:16:59.524367+00	\N	quickbutton	\N
4847af2b-8f90-4192-814f-e1fc4355a56e	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:00.234011+00	\N	quickbutton	\N
aadf0109-7020-4067-87a3-6c1cb32887c3	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:00.83859+00	\N	quickbutton	\N
0e884554-7a55-4876-860d-7ae55ce271f3	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:01.439356+00	\N	quickbutton	\N
c032877d-1b0f-4cf9-a77c-07a6f78bce85	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:02.45678+00	\N	quickbutton	\N
afa7fcf7-52f6-4d51-a418-2ae232520ead	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:03.578692+00	\N	quickbutton	\N
1d17e13f-876e-4936-80a3-4ff89fe62f78	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:04.196983+00	\N	quickbutton	\N
e033329a-ea42-4da3-a5e2-0661733dd06e	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:04.812905+00	\N	quickbutton	\N
fda9d0a0-ab71-4d84-a686-3a666f8d5344	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:05.42233+00	\N	quickbutton	\N
0ffd8835-1019-4529-a90b-9108c16e326f	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:06.080834+00	\N	quickbutton	\N
8fb677ed-6ac3-42e9-8315-d0868a9d76ee	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 14:17:07.677686+00	\N	quickbutton	\N
e107ca0a-8ba4-4412-9382-3e3a10535e9f	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 17:56:51.164811+00	\N	quickbutton	\N
f3a561ac-5470-4ba8-a4a7-d9be1439549b	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:56:53.127015+00	\N	quickbutton	\N
992cf944-2ab6-42d9-acee-c0d5b5c5f58a	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:56:53.996866+00	\N	quickbutton	\N
ae87cf36-350b-46a8-8327-f8e0b8b0fdb0	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:56:54.969593+00	\N	quickbutton	\N
e517b9e1-5ba1-4bbd-96d0-2e6a2b70ea5f	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:56:55.860621+00	\N	quickbutton	\N
33dbe747-91c1-4faa-b785-e24a6b365f3e	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:56:57.252651+00	\N	quickbutton	\N
0ac64095-175b-44a8-96b8-fbe55c85b690	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:56:58.123687+00	\N	quickbutton	\N
77b29a47-e495-4ac9-89bb-c27ad68dfcf3	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:56:59.05339+00	\N	quickbutton	\N
c29f974e-67c3-43c5-baeb-e565d690246d	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:57:00.288781+00	\N	quickbutton	\N
d47883da-043e-4df3-a55e-37642cf95a7d	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:57:00.934925+00	\N	quickbutton	\N
23d51b62-43d7-47fb-aafe-b017b0c52bb1	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:57:01.62851+00	\N	quickbutton	\N
f99712f4-cf93-49ac-8ef0-fc2c7a14a971	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-15 17:57:02.336839+00	\N	quickbutton	\N
f563fa26-d2fc-4299-8fa8-febe5c350b85	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 17:57:03.544972+00	\N	quickbutton	\N
d32257ee-6713-41d5-9446-c2d3143c8fd0	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 17:57:04.152487+00	\N	quickbutton	\N
bba43c81-c919-414d-8c4c-70cc04c37685	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 17:57:06.517854+00	\N	quickbutton	\N
746b0986-20cc-4ac0-ad83-fe16baf7ef9b	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 17:57:08.159968+00	\N	quickbutton	\N
c8803f46-ce12-47e3-9d06-05abd5233043	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 17:57:10.169101+00	\N	quickbutton	\N
07bf2127-6f9b-4504-83b8-ea4d556a5539	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 17:57:10.801598+00	\N	quickbutton	\N
099fe0ec-35f8-45c3-b4b7-6ad032406e95	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 17:57:11.559954+00	\N	quickbutton	\N
b269eeda-d354-42f3-8f74-08ad8107e8f3	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 17:57:12.107498+00	\N	quickbutton	\N
d3ecfc2f-2595-4e71-8391-00adfdcf16a5	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 17:57:13.020733+00	\N	quickbutton	\N
21ae85d8-bb50-4cd4-912c-8b2242588e79	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 17:57:14.696354+00	\N	quickbutton	\N
ca6ae5e1-e282-4ff4-ab92-d760c0682d05	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 17:57:15.562139+00	\N	quickbutton	\N
5e41a5d2-35fe-480e-9a9a-e3dc4c8b8741	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 17:57:16.404231+00	\N	quickbutton	\N
09a80189-fce9-4b30-8a71-303e33743ffc	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 17:57:17.921206+00	\N	quickbutton	\N
3b3c4d3c-ec5a-42fe-871a-2fe381b75134	b46c7ed9-133f-4d4a-94a3-90f715fedc75	1	2025-10-15 18:01:02.999644+00	\N	quickbutton	\N
49dd6800-c54a-4477-b1f0-05f4fa07cbcd	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-15 18:18:46.584176+00	\N	quickbutton	\N
93cbe33a-b035-44ab-a2ce-ede2a6e695f7	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-15 18:25:57.597206+00	\N	quickbutton	\N
d3165bd0-d44e-4a55-b07b-642f233e1481	b46c7ed9-133f-4d4a-94a3-90f715fedc75	1	2025-10-15 18:26:40.670204+00	\N	quickbutton	\N
3d69d201-60dd-48ec-b4fb-af4a2c6ff012	b46c7ed9-133f-4d4a-94a3-90f715fedc75	1	2025-10-15 18:26:42.069699+00	\N	quickbutton	\N
9754794d-65dd-46d2-ad78-f5fd61fdc6bb	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 18:28:01.174175+00	\N	quickbutton	\N
4c3d6479-60e7-40d7-a10b-22e80fa45a65	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 18:28:02.077222+00	\N	quickbutton	\N
65b5e213-116c-4a06-bf38-9404dd95a65b	b46c7ed9-133f-4d4a-94a3-90f715fedc75	-1	2025-10-15 18:28:03.00756+00	\N	quickbutton	\N
7f1752a5-a56b-4ea2-bc14-87e23ec0abdc	7ef4d865-94d3-4f22-9e06-211df4320fda	1	2025-10-15 18:52:15.484724+00	\N	quickbutton	\N
d53472e3-16ee-4f4b-9af0-6fda301a90ea	8f98cf53-a984-418e-af3f-32bd0d52a75c	1	2025-10-15 18:52:21.850449+00	\N	quickbutton	\N
f0b3827b-c288-4474-bbc8-811eba645694	ac303c84-21a1-4c2b-a367-2323a765fa93	-1	2025-10-15 20:06:14.186241+00	\N	quickbutton	\N
74b2c9f5-eb1f-4e9b-81ec-ed8dc7c8a3ef	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 20:06:16.794942+00	\N	quickbutton	\N
2d347fcb-4995-46ae-9774-77efcec4b620	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 20:11:57.182675+00	\N	quickbutton	\N
007f5ddf-cc09-4c77-99df-67fc8a8b8360	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-15 20:11:59.974801+00	\N	quickbutton	\N
f330e3d6-27ce-428a-8352-a6281b66f8b9	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-15 20:12:01.910973+00	\N	quickbutton	\N
a14ce246-5807-49ee-b4d2-1c0c03c53039	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	5	2025-10-15 20:12:10.426781+00	\N	quickbutton	\N
95ba60c0-f676-4e02-98cc-3fd590c8119d	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-15 20:30:18.970481+00	\N	quickbutton	\N
aef9a20e-d102-4f89-94d9-883b64737742	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	1	2025-10-15 20:30:21.852246+00	\N	quickbutton	\N
2b022f33-1891-4ad8-8781-838563e57eeb	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	7	2025-10-15 20:30:23.245442+00	\N	quickbutton	\N
6eab4530-41dd-4cfa-836f-0b8baa95e783	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	9	2025-10-15 20:30:24.353071+00	\N	quickbutton	\N
4530dc36-8af2-4b47-848b-69f13b515966	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-15 20:30:25.489429+00	\N	quickbutton	\N
6e22f64d-3a57-480f-af7c-19bc9dc66539	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-15 20:30:26.710723+00	\N	quickbutton	\N
ab1ad659-5ca8-4557-b5ca-53d680647568	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-15 20:30:27.747719+00	\N	quickbutton	\N
5cf97ace-1de7-41c4-a0c7-4b6b81343c79	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-15 20:30:28.708501+00	\N	quickbutton	\N
14d54bae-5415-4202-ae8e-e4c22ce3ac29	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-15 20:30:29.72228+00	\N	quickbutton	\N
1c26c29f-337e-4d25-99c1-938fca9758df	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-15 20:30:30.566059+00	\N	quickbutton	\N
acb12c32-e37d-448a-8dd3-417ee9b4c677	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	6	2025-10-15 20:30:33.423946+00	\N	quickbutton	\N
3a0bebbe-57b0-4194-aa70-4ba03b80ce54	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:39.090205+00	\N	quickbutton	\N
f4c3920e-23b6-4b1b-b678-1c2ee5bedb9c	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:41.495013+00	\N	quickbutton	\N
ecd4ebc7-ec4e-4d61-ba4a-d3e288a8dafc	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:42.249779+00	\N	quickbutton	\N
81bd941e-dd7c-4e84-8c29-d488c93180eb	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	1	2025-10-15 20:30:47.833798+00	\N	quickbutton	\N
112332df-7507-45c8-9466-1e6cad2e0b29	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-15 20:30:31.530976+00	\N	quickbutton	\N
b1d08e31-5832-48cb-9af0-976ee5b77cea	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:40.712358+00	\N	quickbutton	\N
b41701cb-9d10-4e06-bbbd-8c75c96d8bcb	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:43.629552+00	\N	quickbutton	\N
3058352e-0fd5-4e39-a7a2-fd77dbd11dc6	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:36.529072+00	\N	quickbutton	\N
30184779-65a2-45b6-8271-9163fb6e0331	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:38.249452+00	\N	quickbutton	\N
03b60ea0-35c0-4435-93e0-e7910ec0ae7a	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:37.363948+00	\N	quickbutton	\N
2078d7af-a2ca-43ff-b26d-454140daafb3	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:44.961083+00	\N	quickbutton	\N
58ad394f-be3d-435f-ba53-ae6ea45959fd	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:39.917697+00	\N	quickbutton	\N
29045d52-6cfe-47d6-9a36-25787512d5ca	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:42.937752+00	\N	quickbutton	\N
ff01147e-27f9-41e9-98b1-e61c506333da	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:46.081512+00	\N	quickbutton	\N
1a852f48-7a08-41c9-978f-6cf04b278cb7	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:44.298178+00	\N	quickbutton	\N
577e7303-6e6a-4991-8482-8cdabf29f19b	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	-1	2025-10-15 20:30:45.537545+00	\N	quickbutton	\N
d7740252-3acf-47f6-9eba-da1ce0b1d91c	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:31.152854+00	\N	quickbutton	\N
6e893ace-6415-4f41-bfa7-d3110fa2ebff	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:31.222249+00	\N	quickbutton	\N
729bbe91-e516-450f-bbd2-e8311ce2f469	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:31.410772+00	\N	quickbutton	\N
47a5eee0-1b78-4f7f-9c41-a108f245d638	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:31.697048+00	\N	quickbutton	\N
9016ef02-b0ca-4daf-aa0a-9a735e73830a	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:31.773471+00	\N	quickbutton	\N
dbc1e0f5-1e83-4811-8344-f65d381d1bad	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:31.844581+00	\N	quickbutton	\N
bcb6edfe-e696-4047-80f7-52c599efc9e7	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:32.095093+00	\N	quickbutton	\N
ef1946eb-6a29-444b-a35c-267607b319df	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:32.231469+00	\N	quickbutton	\N
b4b6662e-7eec-4191-99e3-33d2eaf53883	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:32.372404+00	\N	quickbutton	\N
15ba90d9-efe6-480d-83cf-09e6cc782cda	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:32.585521+00	\N	quickbutton	\N
4124e10a-cfbb-4286-adfa-e26f72d15bb7	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:32.795184+00	\N	quickbutton	\N
9ac319a3-f541-481a-9678-fe864df83c8c	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:32.94229+00	\N	quickbutton	\N
c7bbd14e-9a47-459b-88a5-74a90374b490	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 19:59:33.04807+00	\N	quickbutton	\N
49ffc159-a3e0-4325-80ed-1e94fb2b3e45	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 19:59:33.170681+00	\N	quickbutton	\N
b40ad5cc-89bf-409d-9be9-0a051b703305	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 19:59:33.314437+00	\N	quickbutton	\N
4f0f41d9-0f4b-40c4-8b64-8b509da95294	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 19:59:33.436169+00	\N	quickbutton	\N
9c8fd69a-0f50-479d-8e1d-d62725b4d607	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 19:59:33.675871+00	\N	quickbutton	\N
055400c0-3c34-4379-99bd-3da0043c7f59	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 19:59:33.781991+00	\N	quickbutton	\N
b6d8c854-afb3-4d02-81f2-585ef6b4379e	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 19:59:33.947299+00	\N	quickbutton	\N
6eeceb64-0b6c-4a1b-96e0-15988d332fa2	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 19:59:34.115797+00	\N	quickbutton	\N
6ae82598-00b1-4e1c-bfe6-dab47913d686	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 19:59:34.306415+00	\N	quickbutton	\N
75e3943b-44db-418b-b327-6406285daa8d	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 19:59:34.481937+00	\N	quickbutton	\N
3c9cb6da-9548-4ad8-a474-973cc38a512f	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:34.485882+00	\N	quickbutton	\N
d809c181-aa3c-4bab-af5b-b5e029309c89	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:34.655941+00	\N	quickbutton	\N
f44604c9-524c-449f-9cd4-5fa47cf31bc7	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:34.876509+00	\N	quickbutton	\N
d4361580-0699-4fbd-9e85-49e5ccd935d3	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:35.062673+00	\N	quickbutton	\N
1b225e8a-c2c4-4861-ba81-e88b95db6409	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:35.217365+00	\N	quickbutton	\N
274d4926-9f2c-4831-b1d4-ac5be691c18c	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:35.339419+00	\N	quickbutton	\N
855bfe46-694a-42c3-9d04-5e368ba21fa0	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:35.668968+00	\N	quickbutton	\N
39ace5a2-92b4-443d-aa65-e8fe4d9c8bac	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:35.803328+00	\N	quickbutton	\N
a6465bcd-ea18-46b0-a7ea-960b93e13180	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:35.826606+00	\N	quickbutton	\N
f97ac797-b2c6-4851-bb60-b4542b16acfa	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:36.015903+00	\N	quickbutton	\N
620905d3-2f41-44e3-828c-a409110378fd	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:36.245648+00	\N	quickbutton	\N
7961784a-1e1c-4d33-ab2e-253923408bce	ac303c84-21a1-4c2b-a367-2323a765fa93	13	2025-10-16 19:59:36.426907+00	\N	quickbutton	\N
2fa9a370-f053-4c6d-8d1b-9de7069b5d35	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:47.653175+00	\N	quickbutton	\N
3abb1fcc-21bd-46ad-bfc6-0442b42047f1	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:47.730375+00	\N	quickbutton	\N
ed4ace15-a308-4c66-bda2-d5e72d804af9	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:47.872126+00	\N	quickbutton	\N
0c95498a-39b1-4128-a33a-12323be6c751	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:48.116204+00	\N	quickbutton	\N
980c4c1e-1f2f-4340-8a5b-20cd9ff45b71	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:48.215846+00	\N	quickbutton	\N
9dce4061-cbf9-4140-b98c-0804a2612ea2	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:48.47515+00	\N	quickbutton	\N
9894cffb-32a2-4fbb-8a92-4a122c129bf9	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:48.558893+00	\N	quickbutton	\N
bc16b126-2204-492d-b860-bfebaf6ee484	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:48.831057+00	\N	quickbutton	\N
d8924757-08d7-4eba-9882-553591298a65	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:48.948066+00	\N	quickbutton	\N
77a07943-06fb-4b2a-9185-67ab76868fd9	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:49.186995+00	\N	quickbutton	\N
32009f2d-88d0-46ae-81cd-59c913bc1b1b	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:49.312364+00	\N	quickbutton	\N
98ae9db9-c75a-45e1-a352-c2ac6cc66fcc	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:49.597855+00	\N	quickbutton	\N
0c0d278f-8efa-4e05-b78e-0a9bbd9a42c2	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:49.642177+00	\N	quickbutton	\N
bde7b307-257b-43de-8d98-e7a36a666633	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:49.837986+00	\N	quickbutton	\N
495761d5-7b07-4245-b061-9f31c66d9411	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:50.043198+00	\N	quickbutton	\N
ef3ec9c9-aa0c-4679-a94b-478378b5a96c	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:50.191507+00	\N	quickbutton	\N
8531a105-3de6-4935-be0d-f26abae821f9	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:50.431309+00	\N	quickbutton	\N
ce561d9c-a6be-4186-891f-eb4afa6c056a	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:50.52644+00	\N	quickbutton	\N
82456b21-55b3-4f37-9648-16baa2186300	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:50.806479+00	\N	quickbutton	\N
c1e7e249-fa61-4499-9812-f9511f71b0f5	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:50.914686+00	\N	quickbutton	\N
d671b229-6c47-4560-ab0a-1450d7efcae0	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:51.066012+00	\N	quickbutton	\N
7974f01d-16a0-465f-8d85-26ba006c40e1	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:51.254827+00	\N	quickbutton	\N
d5804f8e-48cc-4f1d-b0ae-6e9ac2133291	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:51.412521+00	\N	quickbutton	\N
0d479e94-a719-42be-9b3b-45e92acc8c1a	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:51.608505+00	\N	quickbutton	\N
021e3472-0f60-43b5-9867-17774625a2b0	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:51.76583+00	\N	quickbutton	\N
af5a35ec-2e87-4976-b5ec-ce244b7c685d	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:51.977975+00	\N	quickbutton	\N
7c993f2b-7112-4b8b-a3a8-3d37336a9c4f	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:52.115288+00	\N	quickbutton	\N
dfc36ff7-9be6-46e4-bf0b-3f6cce582b91	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:52.325498+00	\N	quickbutton	\N
bc59af97-b834-4c43-a6e7-d72ec4bdcc95	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:52.513286+00	\N	quickbutton	\N
5cd49265-5967-493c-bb7b-c88b878e67d9	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:52.653311+00	\N	quickbutton	\N
473af63d-4525-41ea-ab04-15b05e807a9a	ac303c84-21a1-4c2b-a367-2323a765fa93	11	2025-10-16 19:59:52.76393+00	\N	quickbutton	\N
790d0ec2-82e9-47de-ae54-e718bcc0d406	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 20:04:17.360241+00	\N	quickbutton	\N
5ccec5ab-770a-4a7d-9577-ccdc0e48afad	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 20:04:17.429307+00	\N	quickbutton	\N
e5ba9d40-9cd3-4c16-be9b-512c81518b29	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 20:04:17.632137+00	\N	quickbutton	\N
f1342985-9f1b-40f2-ab0c-7ae73566cac3	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 20:04:17.873086+00	\N	quickbutton	\N
40e3d865-287f-4334-b519-dd776b34b593	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 20:04:18.20502+00	\N	quickbutton	\N
2da51bb7-aff1-4efd-bb50-0168af973489	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 20:04:18.397481+00	\N	quickbutton	\N
5659ebd3-2d74-46af-aea6-7ad10a0731ce	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-16 20:04:18.766117+00	\N	quickbutton	\N
830f4469-42fc-4096-96bb-41f5850507fb	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:18.790325+00	\N	quickbutton	\N
042f7c69-5ccd-49b5-a508-1981709b0d0d	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:18.992526+00	\N	quickbutton	\N
71b884f1-2c24-4919-a17c-0d9ad264fad3	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:19.190392+00	\N	quickbutton	\N
512af49d-bbbd-4208-9b45-184cd4e9ef89	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:19.517434+00	\N	quickbutton	\N
eeef85d7-1ba5-4591-a708-1d4948bba89b	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:19.682772+00	\N	quickbutton	\N
10021748-b49d-4632-8f9c-0bca163f7fd5	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:20.020242+00	\N	quickbutton	\N
257e30ae-0c7a-47d5-aa5d-40813163dc06	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:20.203055+00	\N	quickbutton	\N
a1122e19-8a5e-4782-91e0-eea36c4a479b	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:20.525438+00	\N	quickbutton	\N
c30ce370-94ae-4ceb-bce6-f5ca8275c668	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:20.795906+00	\N	quickbutton	\N
ad22f6fe-62ed-43ed-9916-4d820bde31c9	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:21.048174+00	\N	quickbutton	\N
cfd38d76-5e7e-4eed-8dcb-35abbbe9f575	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:21.236147+00	\N	quickbutton	\N
ff63d9c3-e7e2-41a0-9d9a-614e759617b2	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:21.576935+00	\N	quickbutton	\N
71448351-1ffe-4f71-b917-a24e53b88858	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:21.752845+00	\N	quickbutton	\N
e1edbd20-3271-46f1-b312-0e8241ae2965	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:22.080758+00	\N	quickbutton	\N
fc8f13ba-b8e1-4bda-8168-6ee55551beaf	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:22.310373+00	\N	quickbutton	\N
c6c00fd9-1b87-41ff-a817-6dfbae9ccd56	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:04:22.631089+00	\N	quickbutton	\N
d1589446-26d1-40b3-b938-a273a220dba9	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-16 20:04:30.522909+00	\N	quickbutton	\N
7f8f9f35-ce41-47fd-bb36-3f2e61363bbe	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:32.000676+00	\N	quickbutton	\N
caa48349-5221-4581-9585-5a8acab03554	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:32.296658+00	\N	quickbutton	\N
d1ad49cb-a008-4259-8216-c4400637f932	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:33.372818+00	\N	quickbutton	\N
82b8342b-ef9b-4673-a1c5-164274b4e7b8	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:33.907074+00	\N	quickbutton	\N
b3c5a00b-e17d-41ba-859d-7d42aa822ec8	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-16 20:04:29.98662+00	\N	quickbutton	\N
7d332747-9bc2-49af-a55a-d8b025a98e7a	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-16 20:04:30.774971+00	\N	quickbutton	\N
4c2e995b-d43e-466d-a8e0-0085eb6ac49a	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:33.043216+00	\N	quickbutton	\N
9ef29fce-1289-4cf0-8a3d-6eabab9a61a3	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-16 20:04:30.184689+00	\N	quickbutton	\N
c410fd7a-50fa-4843-9ae8-a0a8e1e6c76d	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:30.766933+00	\N	quickbutton	\N
032cd61b-ae51-44d6-ae25-d15821b18d7b	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:31.491778+00	\N	quickbutton	\N
43737a5e-bf0f-479f-9bfb-cf0a940d5cfa	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:34.327987+00	\N	quickbutton	\N
5ae496b9-f8fd-41d0-bffd-204886e42f29	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:34.820569+00	\N	quickbutton	\N
3933fb1d-7698-4bf8-a4ac-14ac0afe3c0f	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:35.154956+00	\N	quickbutton	\N
8cde4980-b786-4476-88fc-50f70952f327	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:30.978382+00	\N	quickbutton	\N
d66e8df1-6028-47b2-8062-ff7edf23c38a	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:31.241107+00	\N	quickbutton	\N
748275c5-5e8e-45e5-8dd9-d2fc283e8fc7	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:32.861086+00	\N	quickbutton	\N
0e13f79e-2b6d-4300-855c-d251cd5a9895	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:34.067923+00	\N	quickbutton	\N
6ec196dc-39d5-4c06-885b-9e020ca1269b	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:31.75055+00	\N	quickbutton	\N
d432647e-1a4f-4098-ad31-b31f1bb7f11e	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:32.520211+00	\N	quickbutton	\N
d5538957-3dae-4d60-8782-c27f5f623f94	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:33.553324+00	\N	quickbutton	\N
dc119c93-6e0b-49b8-9bdb-8b9ebd5f6961	b46c7ed9-133f-4d4a-94a3-90f715fedc75	16	2025-10-16 20:04:34.583029+00	\N	quickbutton	\N
974c0825-1395-40f1-9ef5-674167af1644	b46c7ed9-133f-4d4a-94a3-90f715fedc75	5	2025-10-16 20:08:39.988685+00	\N	quickbutton	\N
fed50841-697c-4f88-ad99-b5c528045f8b	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	5	2025-10-16 20:29:30.994547+00	\N	quickbutton	\N
ccc6e1df-dfb7-4d15-b76c-643ea7d87a1a	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	8	2025-10-16 20:53:59.643777+00	\N	quickbutton	\N
580faa23-7742-4c6f-b1e1-4c7e9f73f8dd	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-16 20:55:03.521515+00	\N	quickbutton	\N
f4683b66-9648-49c3-9b8f-f3b0284e0c70	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-17 16:27:43.841139+00	\N	quickbutton	\N
da72804f-c9db-4d8f-b3ac-1c2feb2e192c	b46c7ed9-133f-4d4a-94a3-90f715fedc75	5	2025-10-17 16:27:52.605127+00	\N	quickbutton	\N
f9f1a632-6037-4e65-9d76-44e82b0deda2	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	3	2025-10-17 16:27:54.280327+00	\N	quickbutton	\N
c2194909-f7bd-4023-9c6b-a5451fe34b32	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-17 16:57:21.545735+00	\N	quickbutton	\N
5d102336-dd9a-4d50-9111-f591d17189b8	b46c7ed9-133f-4d4a-94a3-90f715fedc75	5	2025-10-17 16:59:09.928927+00	\N	quickbutton	\N
f1db31d6-979f-486f-8730-43f9ec82f9eb	8b5a4c57-e1ff-40bd-9956-295c08b3fcf4	29	2025-10-17 16:59:46.813317+00	\N	quickbutton	\N
6d1c41ee-5d62-40d1-8961-f98af71222b9	b46c7ed9-133f-4d4a-94a3-90f715fedc75	8	2025-10-17 17:14:25.839823+00	\N	quickbutton	\N
41f059f4-d3cc-4284-8856-45d21a50f8c1	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-17 17:14:39.171125+00	\N	quickbutton	\N
8fcaa1fd-866f-4df5-859a-f8b9d0156dea	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-20 10:55:16.915073+00	\N	quickbutton	\N
92309161-36fe-4f5a-bee8-6421d837b3f1	ac303c84-21a1-4c2b-a367-2323a765fa93	4	2025-10-20 10:55:49.416773+00	\N	quickbutton	\N
5e72061a-62c1-41b5-942c-4e0fe69590a1	ac303c84-21a1-4c2b-a367-2323a765fa93	3	2025-10-20 10:55:56.285383+00	\N	quickbutton	\N
cd5894ab-26bf-46c0-b9fd-1b1ef9440d48	ac303c84-21a1-4c2b-a367-2323a765fa93	8	2025-10-20 15:30:27.809332+00	\N	quickbutton	\N
430856da-42b5-4161-a081-9ddf3dc59664	ac303c84-21a1-4c2b-a367-2323a765fa93	9	2025-10-20 15:30:42.740644+00	\N	quickbutton	\N
44ff1f89-d3fd-493b-9dd4-c63b8b53e6ad	ac303c84-21a1-4c2b-a367-2323a765fa93	1	2025-10-20 15:30:58.523884+00	\N	quickbutton	\N
5e3c961f-f8b1-46b1-b897-14eb8ea187c6	8f98cf53-a984-418e-af3f-32bd0d52a75c	3	2025-10-20 16:15:53.482177+00	\N	quickbutton	\N
d02fb5f3-c88b-4fbf-9848-15b012ba8a2e	7004b6af-023c-49da-a687-4cff66d69b52	5	2025-10-20 16:15:55.645237+00	\N	quickbutton	\N
7edda6fb-d155-463e-9007-a8bdc60642a5	7ef4d865-94d3-4f22-9e06-211df4320fda	13	2025-10-20 16:15:57.005409+00	\N	quickbutton	\N
3abb42fd-3535-4d4c-81ee-3cc78d2a659d	7ef4d865-94d3-4f22-9e06-211df4320fda	36	2025-10-20 16:16:08.539487+00	\N	quickbutton	\N
\.


--
-- Data for Name: messages_2025_10_18; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_18 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_19; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_19 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_20; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_20 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_21; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_21 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_22; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_22 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_23; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_23 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_24; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_24 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-10-14 11:36:20
20211116045059	2025-10-14 11:36:22
20211116050929	2025-10-14 11:36:24
20211116051442	2025-10-14 11:36:26
20211116212300	2025-10-14 11:36:28
20211116213355	2025-10-14 11:36:29
20211116213934	2025-10-14 11:36:31
20211116214523	2025-10-14 11:36:33
20211122062447	2025-10-14 11:36:34
20211124070109	2025-10-14 11:36:36
20211202204204	2025-10-14 11:36:37
20211202204605	2025-10-14 11:36:39
20211210212804	2025-10-14 11:36:44
20211228014915	2025-10-14 11:36:46
20220107221237	2025-10-14 11:36:47
20220228202821	2025-10-14 11:36:49
20220312004840	2025-10-14 11:36:51
20220603231003	2025-10-14 11:36:53
20220603232444	2025-10-14 11:36:55
20220615214548	2025-10-14 11:36:57
20220712093339	2025-10-14 11:36:59
20220908172859	2025-10-14 11:37:00
20220916233421	2025-10-14 11:37:02
20230119133233	2025-10-14 11:37:03
20230128025114	2025-10-14 11:37:06
20230128025212	2025-10-14 11:37:07
20230227211149	2025-10-14 11:37:09
20230228184745	2025-10-14 11:37:11
20230308225145	2025-10-14 11:37:12
20230328144023	2025-10-14 11:37:14
20231018144023	2025-10-14 11:37:16
20231204144023	2025-10-14 11:37:18
20231204144024	2025-10-14 11:37:20
20231204144025	2025-10-14 11:37:21
20240108234812	2025-10-14 11:37:23
20240109165339	2025-10-14 11:37:24
20240227174441	2025-10-14 11:37:27
20240311171622	2025-10-14 11:37:29
20240321100241	2025-10-14 11:37:32
20240401105812	2025-10-14 11:37:37
20240418121054	2025-10-14 11:37:39
20240523004032	2025-10-14 11:37:45
20240618124746	2025-10-14 11:37:46
20240801235015	2025-10-14 11:37:48
20240805133720	2025-10-14 11:37:49
20240827160934	2025-10-14 11:37:51
20240919163303	2025-10-14 11:37:53
20240919163305	2025-10-14 11:37:54
20241019105805	2025-10-14 11:37:56
20241030150047	2025-10-14 11:38:02
20241108114728	2025-10-14 11:38:04
20241121104152	2025-10-14 11:38:05
20241130184212	2025-10-14 11:38:07
20241220035512	2025-10-14 11:38:08
20241220123912	2025-10-14 11:38:10
20241224161212	2025-10-14 11:38:11
20250107150512	2025-10-14 11:38:13
20250110162412	2025-10-14 11:38:14
20250123174212	2025-10-14 11:38:16
20250128220012	2025-10-14 11:38:17
20250506224012	2025-10-14 11:38:19
20250523164012	2025-10-14 11:38:20
20250714121412	2025-10-14 11:38:22
20250905041441	2025-10-14 11:38:23
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-10-14 11:36:16.501878
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-10-14 11:36:16.533001
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-10-14 11:36:16.538768
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-10-14 11:36:16.578165
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-10-14 11:36:16.631039
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-10-14 11:36:16.635358
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-10-14 11:36:16.642531
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-10-14 11:36:16.647609
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-10-14 11:36:16.651394
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-10-14 11:36:16.655047
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-10-14 11:36:16.658568
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-10-14 11:36:16.662611
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-10-14 11:36:16.669088
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-10-14 11:36:16.672971
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-10-14 11:36:16.676881
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-10-14 11:36:16.703727
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-10-14 11:36:16.707394
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-10-14 11:36:16.710962
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-10-14 11:36:16.714692
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-10-14 11:36:16.72075
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-10-14 11:36:16.724333
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-10-14 11:36:16.730779
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-10-14 11:36:16.757226
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-10-14 11:36:16.768773
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-10-14 11:36:16.773083
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-10-14 11:36:16.778433
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-10-14 11:36:16.782552
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-10-14 11:36:16.823984
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-10-14 11:36:17.361567
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-10-14 11:36:17.366826
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-10-14 11:36:17.371911
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-10-14 11:36:17.378939
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-10-14 11:36:17.385776
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-10-14 11:36:17.396179
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-10-14 11:36:17.40069
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-10-14 11:36:17.407253
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-10-14 11:36:17.411119
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-10-14 11:36:17.417595
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-10-14 11:36:17.421865
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-10-14 11:36:17.429691
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-10-14 11:36:17.433804
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-10-14 11:36:17.441953
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-10-14 11:36:17.447591
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-10-14 11:36:17.452385
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 76, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (user_id);


--
-- Name: sets sets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_18 messages_2025_10_18_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_18
    ADD CONSTRAINT messages_2025_10_18_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_19 messages_2025_10_19_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_19
    ADD CONSTRAINT messages_2025_10_19_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_20 messages_2025_10_20_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_20
    ADD CONSTRAINT messages_2025_10_20_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_21 messages_2025_10_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_21
    ADD CONSTRAINT messages_2025_10_21_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_22 messages_2025_10_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_22
    ADD CONSTRAINT messages_2025_10_22_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_23 messages_2025_10_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_23
    ADD CONSTRAINT messages_2025_10_23_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_24 messages_2025_10_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_24
    ADD CONSTRAINT messages_2025_10_24_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_exercises_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exercises_user ON public.exercises USING btree (user_id);


--
-- Name: idx_sets_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sets_created_at ON public.sets USING btree (created_at);


--
-- Name: idx_sets_exercise; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sets_exercise ON public.sets USING btree (exercise_id);


--
-- Name: idx_sets_not_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sets_not_deleted ON public.sets USING btree (deleted_at);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_18_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_18_inserted_at_topic_idx ON realtime.messages_2025_10_18 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_19_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_19_inserted_at_topic_idx ON realtime.messages_2025_10_19 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_20_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_20_inserted_at_topic_idx ON realtime.messages_2025_10_20 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_21_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_21_inserted_at_topic_idx ON realtime.messages_2025_10_21 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_22_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_22_inserted_at_topic_idx ON realtime.messages_2025_10_22 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_23_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_23_inserted_at_topic_idx ON realtime.messages_2025_10_23 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_24_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_24_inserted_at_topic_idx ON realtime.messages_2025_10_24 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: messages_2025_10_18_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_18_inserted_at_topic_idx;


--
-- Name: messages_2025_10_18_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_18_pkey;


--
-- Name: messages_2025_10_19_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_19_inserted_at_topic_idx;


--
-- Name: messages_2025_10_19_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_19_pkey;


--
-- Name: messages_2025_10_20_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_20_inserted_at_topic_idx;


--
-- Name: messages_2025_10_20_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_20_pkey;


--
-- Name: messages_2025_10_21_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_21_inserted_at_topic_idx;


--
-- Name: messages_2025_10_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_21_pkey;


--
-- Name: messages_2025_10_22_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_22_inserted_at_topic_idx;


--
-- Name: messages_2025_10_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_22_pkey;


--
-- Name: messages_2025_10_23_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_23_inserted_at_topic_idx;


--
-- Name: messages_2025_10_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_23_pkey;


--
-- Name: messages_2025_10_24_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_24_inserted_at_topic_idx;


--
-- Name: messages_2025_10_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_24_pkey;


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: exercises exercises_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sets sets_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: exercises; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

--
-- Name: exercises exercises_delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY exercises_delete ON public.exercises FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: exercises exercises_insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY exercises_insert ON public.exercises FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: exercises exercises_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY exercises_select ON public.exercises FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: exercises exercises_update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY exercises_update ON public.exercises FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY profiles_select ON public.profiles FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: profiles profiles_update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: profiles profiles_upsert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY profiles_upsert ON public.profiles FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: sets; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sets ENABLE ROW LEVEL SECURITY;

--
-- Name: sets sets_delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sets_delete ON public.sets FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.exercises e
  WHERE ((e.id = sets.exercise_id) AND (e.user_id = auth.uid())))));


--
-- Name: sets sets_insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sets_insert ON public.sets FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.exercises e
  WHERE ((e.id = sets.exercise_id) AND (e.user_id = auth.uid())))));


--
-- Name: sets sets_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sets_select ON public.sets FOR SELECT USING (((deleted_at IS NULL) AND (EXISTS ( SELECT 1
   FROM public.exercises e
  WHERE ((e.id = sets.exercise_id) AND (e.user_id = auth.uid()))))));


--
-- Name: sets sets_update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sets_update ON public.sets FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.exercises e
  WHERE ((e.id = sets.exercise_id) AND (e.user_id = auth.uid())))));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: supabase_admin
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime_messages_publication OWNER TO supabase_admin;

--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: supabase_admin
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION current_user_id(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.current_user_id() TO anon;
GRANT ALL ON FUNCTION public.current_user_id() TO authenticated;
GRANT ALL ON FUNCTION public.current_user_id() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE exercises; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exercises TO anon;
GRANT ALL ON TABLE public.exercises TO authenticated;
GRANT ALL ON TABLE public.exercises TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE sets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sets TO anon;
GRANT ALL ON TABLE public.sets TO authenticated;
GRANT ALL ON TABLE public.sets TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE messages_2025_10_18; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_18 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_18 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_19; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_19 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_19 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_20; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_20 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_20 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_21; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_21 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_21 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_22; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_22 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_22 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_23; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_23 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_23 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_24; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_24 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_24 TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict QjUcH1SAbUSONKJi1JTCbI27oYmW7J1GIkqZXmZjT1BbcO1U1g7EY5L1OxoYvye

--
-- PostgreSQL database cluster dump complete
--

