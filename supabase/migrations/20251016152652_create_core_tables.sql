/*
  # Create Core Tables for Nuvra CRM

  1. New Tables
    - `leads` - Stores lead information
      - id (uuid, primary key)
      - name (text)
      - email (text, unique)
      - phone (text)
      - company (text)
      - position (text)
      - source (text)
      - status (text)
      - score (integer)
      - tags (jsonb)
      - metadata (jsonb)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - `products` - Stores product information
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - category (text)
      - price (numeric)
      - features (jsonb)
      - active (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - `sources` - Stores lead sources
      - id (uuid, primary key)
      - name (text)
      - type (text)
      - config (jsonb)
      - active (boolean)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their data
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  position text,
  source text DEFAULT 'manual',
  status text DEFAULT 'new',
  score integer DEFAULT 0,
  tags jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text DEFAULT 'general',
  price numeric DEFAULT 0,
  features jsonb DEFAULT '[]',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Users can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'manual',
  config jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(active);

ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all sources"
  ON sources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage sources"
  ON sources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
