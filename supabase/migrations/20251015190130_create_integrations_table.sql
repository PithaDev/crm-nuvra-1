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

CREATE POLICY "Allow authenticated users full access to integrations"
  ON integrations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);