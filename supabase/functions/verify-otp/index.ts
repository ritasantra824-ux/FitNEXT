import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mobile, otp } = await req.json();

    if (!mobile || !otp) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Mobile number and OTP are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const easyOtpApiKey = Deno.env.get('EASYOTP_API_KEY');
    
    if (!easyOtpApiKey) {
      console.error('EASYOTP_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'OTP service not configured' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Verifying OTP for:', mobile);

    // Verify OTP using EasyOTP API
    const response = await fetch('https://api.easyotp.in/v1/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${easyOtpApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: mobile,
        otp: otp,
      }),
    });

    const data = await response.json();
    console.log('EasyOTP verify response:', data);

    if (!response.ok || !data.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: data.message || 'Invalid OTP' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase session after successful OTP verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Sign in or create user with phone number
    const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
      phone: mobile,
    });

    if (authError) {
      console.error('Auth error:', authError);
      // If user doesn't exist, try to create one
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        phone: mobile,
        phone_confirm: true,
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to create user session' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP verified successfully',
          user: signUpData.user
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully',
        data: authData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in verify-otp function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
