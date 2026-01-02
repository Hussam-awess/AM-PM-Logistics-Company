-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'driver')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trucks table
CREATE TABLE IF NOT EXISTS public.trucks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate_number TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  capacity_tons DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_transit', 'maintenance', 'inactive')),
  location TEXT,
  driver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  last_maintenance DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS public.routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance_km DECIMAL(10, 2),
  estimated_duration_hours DECIMAL(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transport_requests table
CREATE TABLE IF NOT EXISTS public.transport_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT NOT NULL,
  company_name TEXT,
  cargo_type TEXT NOT NULL,
  cargo_weight_tons DECIMAL(10, 2) NOT NULL,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  preferred_date DATE,
  special_requirements TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'assigned', 'in_progress', 'completed', 'cancelled')),
  assigned_truck_id UUID REFERENCES public.trucks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES public.transport_requests(id) ON DELETE CASCADE,
  truck_id UUID NOT NULL REFERENCES public.trucks(id),
  route_id UUID REFERENCES public.routes(id),
  driver_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'loading', 'in_transit', 'delivered', 'cancelled')),
  departure_date TIMESTAMPTZ,
  arrival_date TIMESTAMPTZ,
  actual_delivery_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trucks policies (admins only for insert/update/delete, all can view)
CREATE POLICY "Anyone can view trucks" ON public.trucks FOR SELECT USING (true);
CREATE POLICY "Admins can insert trucks" ON public.trucks FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
CREATE POLICY "Admins can update trucks" ON public.trucks FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
CREATE POLICY "Admins can delete trucks" ON public.trucks FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Routes policies (all can view, admins can modify)
CREATE POLICY "Anyone can view routes" ON public.routes FOR SELECT USING (true);
CREATE POLICY "Admins can insert routes" ON public.routes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
CREATE POLICY "Admins can update routes" ON public.routes FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Transport requests policies (anyone can insert, admins can view all)
CREATE POLICY "Anyone can insert transport requests" ON public.transport_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all requests" ON public.transport_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'driver')
    )
  );
CREATE POLICY "Admins can update requests" ON public.transport_requests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Shipments policies (admins and drivers can view/manage)
CREATE POLICY "Authorized users can view shipments" ON public.shipments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'driver')
    )
  );
CREATE POLICY "Admins can insert shipments" ON public.shipments FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
CREATE POLICY "Admins can update shipments" ON public.shipments FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_trucks_status ON public.trucks(status);
CREATE INDEX idx_trucks_driver ON public.trucks(driver_id);
CREATE INDEX idx_requests_status ON public.transport_requests(status);
CREATE INDEX idx_requests_created ON public.transport_requests(created_at DESC);
CREATE INDEX idx_shipments_status ON public.shipments(status);
CREATE INDEX idx_shipments_truck ON public.shipments(truck_id);
