/*
  # Create Integrations Table

  1. New Tables
    - `integrations` - Stores integration configurations
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'webhook',
  url text,
  headers jsonb DEFAULT '{}',
  config jsonb DEFAULT '{}',
  field_mapping jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_integrations_active ON integrations(active);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all integrations"
  ON integrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert integrations"
  ON integrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update integrations"
  ON integrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete integrations"
  ON integrations FOR DELETE
  TO authenticated
  USING (true);
