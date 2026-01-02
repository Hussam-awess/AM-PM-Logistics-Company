-- Add container number field to transport_requests table
ALTER TABLE transport_requests
ADD COLUMN IF NOT EXISTS container_number TEXT;

-- Add comment to document the column
COMMENT ON COLUMN transport_requests.container_number IS 'Container identification number provided by customer to avoid confusion';
