import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mobile } = await req.json();

    if (!mobile || !mobile.startsWith('+91') || mobile.length !== 13) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid mobile number. Must be in format +91XXXXXXXXXX' 
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

    console.log('Sending OTP to:', mobile);

    // Send OTP using EasyOTP API
    const response = await fetch('https://api.easyotp.in/v1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${easyOtpApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: mobile,
        channel: 'sms',
      }),
    });

    const data = await response.json();
    console.log('EasyOTP response:', data);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: data.message || 'Failed to send OTP' 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        data: data
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-otp function:', error);
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
