/*
  # Create API Keys Table

  1. New Tables
    - `api_keys` - Stores hashed API keys
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid,
  key_hash text NOT NULL,
  key_prefix text NOT NULL,
  name text NOT NULL,
  active boolean DEFAULT true,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(active);
CREATE INDEX IF NOT EXISTS idx_api_keys_product ON api_keys(product_id);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to api_keys"
  ON api_keys FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);