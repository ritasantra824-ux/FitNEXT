-- Create rate limiting table for OTP requests
CREATE TABLE IF NOT EXISTS public.otp_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  last_request_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hour_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_phone ON public.otp_rate_limits(phone);
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_hour_key ON public.otp_rate_limits(phone, hour_key);

-- Enable RLS (rate limiting is internal, no user access needed)
ALTER TABLE public.otp_rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies needed - this table is only accessed by edge functions with service role

-- Function to clean up old rate limit records (optional, for maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.otp_rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;