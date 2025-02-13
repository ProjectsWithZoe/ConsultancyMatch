/*
  # Initial schema setup for ConsultMatch

  1. New Tables
    - `consultants`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `category` (text)
      - `location` (text)
      - `hourly_rate` (integer)
      - `availability` (text)
      - `created_at` (timestamp)
    
    - `firms`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `company_name` (text)
      - `category` (text)
      - `location` (text)
      - `minimum_hourly_rate` (integer)
      - `project_duration` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create consultants table
CREATE TABLE IF NOT EXISTS consultants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  hourly_rate integer NOT NULL,
  availability text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create firms table
CREATE TABLE IF NOT EXISTS firms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  company_name text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  minimum_hourly_rate integer NOT NULL,
  project_duration text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;

-- Create policies for consultants
CREATE POLICY "Users can read own consultant profile"
  ON consultants
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can insert own consultant profile"
  ON consultants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own consultant profile"
  ON consultants
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- Create policies for firms
CREATE POLICY "Users can read own firm profile"
  ON firms
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can insert own firm profile"
  ON firms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own firm profile"
  ON firms
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);