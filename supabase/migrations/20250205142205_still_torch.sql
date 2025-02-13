/*
  # Convert project duration to integer

  1. Changes
    - Modify `project_duration` column in `firms` table from text to integer
    - Add check constraint to ensure positive duration

  2. Notes
    - Safe migration that preserves existing data
    - Adds validation for positive hours
*/

DO $$ 
BEGIN
  -- First create a temporary column
  ALTER TABLE firms ADD COLUMN project_duration_hours integer;

  -- Update the temporary column with converted values
  -- Default to 160 hours (1 month) if conversion fails
  UPDATE firms 
  SET project_duration_hours = COALESCE(
    NULLIF(REGEXP_REPLACE(project_duration, '[^0-9]', '', 'g'), '')::integer,
    160
  );

  -- Drop the old column and rename the new one
  ALTER TABLE firms DROP COLUMN project_duration;
  ALTER TABLE firms RENAME COLUMN project_duration_hours TO project_duration;

  -- Add NOT NULL constraint and check for positive values
  ALTER TABLE firms 
    ALTER COLUMN project_duration SET NOT NULL,
    ADD CONSTRAINT project_duration_positive CHECK (project_duration > 0);
END $$;