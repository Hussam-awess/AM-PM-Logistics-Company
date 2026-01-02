-- Add is_management column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_management BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Update the role column to be more flexible
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Update existing policies to work with new role system
DROP POLICY IF EXISTS "Admins can insert trucks" ON public.trucks;
DROP POLICY IF EXISTS "Admins can update trucks" ON public.trucks;
DROP POLICY IF EXISTS "Admins can delete trucks" ON public.trucks;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.transport_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.transport_requests;
DROP POLICY IF EXISTS "Authorized users can view shipments" ON public.shipments;
DROP POLICY IF EXISTS "Admins can insert shipments" ON public.shipments;
DROP POLICY IF EXISTS "Admins can update shipments" ON public.shipments;

-- Trucks policies (admins and management can modify)
CREATE POLICY "Admins and management can insert trucks" ON public.trucks FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

CREATE POLICY "Admins and management can update trucks" ON public.trucks FOR UPDATE 
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

-- Transport requests policies
CREATE POLICY "Authorized users can view all requests" ON public.transport_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

CREATE POLICY "Customers can view own requests" ON public.transport_requests FOR SELECT 
  USING (
    requester_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Management and admins can update requests" ON public.transport_requests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

-- Shipments policies
CREATE POLICY "Authorized users can view shipments" ON public.shipments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true OR role = 'driver')
    )
  );

CREATE POLICY "Management and admins can insert shipments" ON public.shipments FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

CREATE POLICY "Management and admins can update shipments" ON public.shipments FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

-- Create communications table for management-customer communication
CREATE TABLE IF NOT EXISTS public.communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES public.transport_requests(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  sender_type TEXT CHECK (sender_type IN ('management', 'customer')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Management and customers can view related communications" ON public.communications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    ) OR
    EXISTS (
      SELECT 1 FROM public.transport_requests tr
      JOIN public.profiles p ON p.email = tr.requester_email
      WHERE tr.id = communications.request_id AND p.id = auth.uid()
    )
  );

CREATE POLICY "Authorized users can insert communications" ON public.communications FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Create meetings table for admin team management
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_type TEXT CHECK (meeting_type IN ('team', 'management', 'all_hands')),
  created_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and management can view meetings" ON public.meetings FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

CREATE POLICY "Admins can manage meetings" ON public.meetings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create job assignments table for management
CREATE TABLE IF NOT EXISTS public.job_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES public.transport_requests(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id),
  assigned_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Management can view assignments" ON public.job_assignments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    ) OR
    assigned_to = auth.uid()
  );

CREATE POLICY "Admins and management can create assignments" ON public.job_assignments FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

CREATE POLICY "Assigned users can update their assignments" ON public.job_assignments FOR UPDATE 
  USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (is_admin = true OR is_management = true)
    )
  );

-- Create indexes
CREATE INDEX idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;
CREATE INDEX idx_profiles_is_management ON public.profiles(is_management) WHERE is_management = true;
CREATE INDEX idx_communications_request ON public.communications(request_id);
CREATE INDEX idx_job_assignments_assigned_to ON public.job_assignments(assigned_to);
CREATE INDEX idx_meetings_scheduled_time ON public.meetings(scheduled_time);
