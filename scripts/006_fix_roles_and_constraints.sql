-- Drop old role-based policies
DROP POLICY IF EXISTS "Admins can insert trucks" ON public.trucks;
DROP POLICY IF EXISTS "Admins can update trucks" ON public.trucks;
DROP POLICY IF EXISTS "Admins can delete trucks" ON public.trucks;
DROP POLICY IF EXISTS "Admins can insert routes" ON public.routes;
DROP POLICY IF EXISTS "Admins can update routes" ON public.routes;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.transport_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.transport_requests;
DROP POLICY IF EXISTS "Authorized users can view shipments" ON public.shipments;
DROP POLICY IF EXISTS "Admins can insert shipments" ON public.shipments;
DROP POLICY IF EXISTS "Admins can update shipments" ON public.shipments;

-- Add is_admin and is_management columns if they don't exist
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_management BOOLEAN DEFAULT FALSE;

-- Update profiles table to remove role constraint
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Recreate policies with new role system
CREATE POLICY "Admins can insert trucks" ON public.trucks FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );
  
CREATE POLICY "Admins can update trucks" ON public.trucks FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );
  
CREATE POLICY "Admins can delete trucks" ON public.trucks FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert routes" ON public.routes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );
  
CREATE POLICY "Admins can update routes" ON public.routes FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

CREATE POLICY "Admins can view all requests" ON public.transport_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );
  
CREATE POLICY "Admins can update requests" ON public.transport_requests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

CREATE POLICY "Authorized users can view shipments" ON public.shipments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );
  
CREATE POLICY "Admins can insert shipments" ON public.shipments FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );
  
CREATE POLICY "Admins can update shipments" ON public.shipments FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

-- Allow users to view their own transport requests
CREATE POLICY "Users can view own requests" ON public.transport_requests FOR SELECT
  USING (requester_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));
