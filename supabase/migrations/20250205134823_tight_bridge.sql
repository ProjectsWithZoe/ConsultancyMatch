/*
  # Add country field to consultants and firms tables

  1. Changes
    - Add country column to consultants table
    - Add country column to firms table

  2. Notes
    - Both columns are required (NOT NULL)
    - Default value set to 'Global' for existing records
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultants' AND column_name = 'country'
  ) THEN
    ALTER TABLE consultants ADD COLUMN country text NOT NULL DEFAULT 'Global';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'firms' AND column_name = 'country'
  ) THEN
    ALTER TABLE firms ADD COLUMN country text NOT NULL DEFAULT 'Global';
  END IF;
END $$;