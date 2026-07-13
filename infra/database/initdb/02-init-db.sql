-- =========================================================
-- Bootstrap script for initializing the database
-- Executes only on the first creation of the Postgres volume
-- =========================================================

-- Explicitly define main schema
CREATE SCHEMA IF NOT EXISTS public;

-- Optional: standardize session/database timezone
SET TIME ZONE 'America/Sao_Paulo';

-- Example of a database comment
COMMENT ON SCHEMA public IS 'Schema principal do sistema de monitoramento Sentinel';