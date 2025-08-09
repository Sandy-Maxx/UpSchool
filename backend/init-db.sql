-- Initialize PostgreSQL database for School Platform
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Set timezone
SET timezone = 'UTC';

-- Create additional databases for multi-tenancy (optional)
-- These can be created dynamically by the application
-- CREATE DATABASE tenant_1;
-- CREATE DATABASE tenant_2;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE school_platform TO postgres;

-- Create a function to generate UUIDs (if not using uuid-ossp)
CREATE OR REPLACE FUNCTION generate_uuid() RETURNS uuid AS $$
BEGIN
    RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql; 