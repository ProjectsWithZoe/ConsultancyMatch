/*
  # Add CV and bio fields to consultants table

  1. Changes
    - Add `cv_url` column to store the URL of uploaded CVs
    - Add `bio` column for consultant professional biographies
  
  2. Security
    - No changes to RLS policies needed as existing policies cover these new columns
*/

DO $$ 
BEGIN
  -- Add cv_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultants' AND column_name = 'cv_url'
  ) THEN
    ALTER TABLE consultants ADD COLUMN cv_url text;
  END IF;

  -- Add bio column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultants' AND column_name = 'bio'
  ) THEN
    ALTER TABLE consultants ADD COLUMN bio text;
  END IF;
END $$;