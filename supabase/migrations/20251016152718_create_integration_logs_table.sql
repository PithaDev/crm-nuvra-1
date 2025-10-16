/*
  # Create Integration Logs Table

  1. New Tables
    - `integration_logs` - Stores integration activity logs
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS integration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid,
  event_type text NOT NULL DEFAULT 'webhook_received',
  payload jsonb,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_integration_logs_integration ON integration_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_created ON integration_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_integration_logs_status ON integration_logs(status);

ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all integration_logs"
  ON integration_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert integration_logs"
  ON integration_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update integration_logs"
  ON integration_logs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete integration_logs"
  ON integration_logs FOR DELETE
  TO authenticated
  USING (true);
