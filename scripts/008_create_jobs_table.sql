-- 008_create_jobs_table.sql
-- Adds a simple jobs table for customer job requests

BEGIN;

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Customers (authenticated users) can INSERT jobs; ensure new jobs have status = 'requested'
CREATE POLICY allow_insert_authenticated ON public.jobs
  FOR INSERT
  USING (auth.role() = 'authenticated')
  WITH CHECK (status = 'requested');

-- Management can SELECT jobs (for their dashboard)
CREATE POLICY management_select ON public.jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'management'
    )
  );

-- Management can UPDATE only to set status = 'completed'
CREATE POLICY management_update_completed ON public.jobs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'management'
    )
  )
  WITH CHECK (status = 'completed');

-- Admins can SELECT jobs for analytics
CREATE POLICY admin_select ON public.jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

COMMIT;
