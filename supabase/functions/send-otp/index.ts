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

    // Create Supabase client for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check 60-second cooldown
    const { data: recentRequest } = await supabase
      .from('otp_rate_limits')
      .select('last_request_at')
      .eq('phone', phone)
      .gte('last_request_at', new Date(Date.now() - 60000).toISOString())
      .single();

    if (recentRequest) {
      const timeSinceLastRequest = Date.now() - new Date(recentRequest.last_request_at).getTime();
      const remainingSeconds = Math.ceil((60000 - timeSinceLastRequest) / 1000);
      console.log(`Rate limit hit for ${phone}. ${remainingSeconds}s remaining`);
      return new Response(
        JSON.stringify({ 
          error: `Please wait ${remainingSeconds} seconds before requesting another OTP`,
          retryAfter: remainingSeconds
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check hourly limit (5 max)
    const hourKey = new Date().toISOString().slice(0, 13);
    const { data: hourlyData } = await supabase
      .from('otp_rate_limits')
      .select('request_count')
      .eq('phone', phone)
      .eq('hour_key', hourKey)
      .single();

    if (hourlyData && hourlyData.request_count >= 5) {
      console.log(`Hourly limit exceeded for ${phone}`);
      return new Response(
        JSON.stringify({ error: 'Maximum OTP requests per hour exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Store rate limiting data
    const newCount = (hourlyData?.request_count || 0) + 1;
    
    await supabase.from('otp_rate_limits').upsert({
      phone,
      request_count: newCount,
      hour_key: hourKey,
      last_request_at: new Date().toISOString()
    }, { onConflict: 'phone,hour_key' });

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
