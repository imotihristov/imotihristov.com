-- =====================================================
-- UPDATE PROPERTY ID SEQUENCE TO START FROM 1000
-- Run this AFTER the main schema if you need to update existing database
-- =====================================================

-- Drop the existing sequence and recreate it starting from 1000
-- This ensures all new properties get 4-digit IDs

-- First, check the current max ID
DO $$
DECLARE
  max_id INTEGER;
BEGIN
  SELECT COALESCE(MAX(id), 0) INTO max_id FROM public.properties;
  
  -- If max_id is less than 1000, we can safely reset
  -- If it's >= 1000, we'll start from max_id + 1
  IF max_id < 1000 THEN
    -- Alter the sequence to start from 1000
    ALTER SEQUENCE IF EXISTS properties_id_seq RESTART WITH 1000;
    
    -- If using IDENTITY column, use this instead:
    ALTER TABLE public.properties 
    ALTER COLUMN id 
    RESTART WITH 1000;
    
    RAISE NOTICE 'Property ID sequence reset to start from 1000';
  ELSE
    -- Start from next available ID
    ALTER TABLE public.properties 
    ALTER COLUMN id 
    RESTART WITH %;
    
    RAISE NOTICE 'Property ID sequence set to continue from %', max_id + 1;
  END IF;
END $$;

-- Verify the change
SELECT 
  table_name,
  column_name,
  column_default
FROM information_schema.columns
WHERE table_name = 'properties' 
  AND column_name = 'id';

-- Test by viewing what the next ID would be (don't actually insert)
-- SELECT nextval('properties_id_seq') as next_id; -- for SERIAL
-- For IDENTITY, the next ID will be used on next INSERT
