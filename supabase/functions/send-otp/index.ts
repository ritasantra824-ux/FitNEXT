import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();

    console.log('Received OTP request for phone:', phone);

    // Server-side validation
    if (!phone || typeof phone !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone format (E.164 format for Indian numbers)
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid phone number format. Must be a valid Indian mobile number starting with +91' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Deno KV for rate limiting
    const kv = await Deno.openKv();

    // Check 60-second cooldown per phone number
    const cooldownKey = ['otp_cooldown', phone];
    const lastRequest = await kv.get(cooldownKey);

    if (lastRequest.value) {
      const timeSinceLastRequest = Date.now() - (lastRequest.value as number);
      const cooldownMs = 60000; // 60 seconds
      
      if (timeSinceLastRequest < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastRequest) / 1000);
        console.log(`Rate limit hit for ${phone}. ${remainingSeconds}s remaining`);
        return new Response(
          JSON.stringify({ 
            error: `Please wait ${remainingSeconds} seconds before requesting another OTP`,
            retryAfter: remainingSeconds
          }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': String(remainingSeconds)
            } 
          }
        );
      }
    }

    // Check hourly limit (5 requests max per hour)
    const hourlyKey = ['otp_hourly', phone, new Date().toISOString().slice(0, 13)];
    const hourlyCount = await kv.get(hourlyKey);

    if (hourlyCount.value && (hourlyCount.value as number) >= 5) {
      console.log(`Hourly limit exceeded for ${phone}`);
      return new Response(
        JSON.stringify({ 
          error: 'Maximum OTP requests per hour exceeded. Please try again later.',
          maxRetries: 5
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Send OTP using Supabase Auth
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    if (error) {
      console.error('OTP sending error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store rate limiting data after successful OTP send
    await kv.set(cooldownKey, Date.now(), { expireIn: 60000 }); // 60 second expiry
    const newCount = ((hourlyCount.value as number) || 0) + 1;
    await kv.set(hourlyKey, newCount, { expireIn: 3600000 }); // 1 hour expiry

    console.log(`OTP sent successfully to ${phone}. Count this hour: ${newCount}`);

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
