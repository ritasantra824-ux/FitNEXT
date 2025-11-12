-- Fix search_path for cleanup function
DROP FUNCTION IF EXISTS public.cleanup_old_rate_limits();

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.otp_rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Add service role policy for edge functions to access rate limit table
CREATE POLICY "Service role can manage rate limits"
ON public.otp_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);