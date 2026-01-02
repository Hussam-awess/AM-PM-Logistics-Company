-- Seed some routes
INSERT INTO public.routes (name, origin, destination, distance_km, estimated_duration_hours) VALUES
  ('Dar es Salaam - Mwanza', 'Dar es Salaam, Tanzania', 'Mwanza, Tanzania', 1200, 18),
  ('Dar es Salaam - Dodoma', 'Dar es Salaam, Tanzania', 'Dodoma, Tanzania', 450, 7),
  ('Dar es Salaam - Arusha', 'Dar es Salaam, Tanzania', 'Arusha, Tanzania', 650, 10),
  ('Dar es Salaam - Mbeya', 'Dar es Salaam, Tanzania', 'Mbeya, Tanzania', 850, 13),
  ('Dar es Salaam - DR Congo', 'Dar es Salaam, Tanzania', 'DR Congo', 2800, 48)
ON CONFLICT DO NOTHING;
