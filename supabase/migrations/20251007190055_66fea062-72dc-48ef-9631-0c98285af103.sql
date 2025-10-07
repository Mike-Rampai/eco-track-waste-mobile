-- Create table for storing OTPs
CREATE TABLE IF NOT EXISTS public.password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster email lookups
CREATE INDEX idx_password_reset_otps_email ON public.password_reset_otps(email);

-- Create trigger to automatically delete expired OTPs
CREATE OR REPLACE FUNCTION delete_expired_otps()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.password_reset_otps
  WHERE expires_at < now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_expired_otps
  AFTER INSERT ON public.password_reset_otps
  EXECUTE FUNCTION delete_expired_otps();

-- Enable RLS
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- No public access to OTPs - only edge functions can access
CREATE POLICY "Service role only access"
  ON public.password_reset_otps
  FOR ALL
  USING (false);