import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientPhone, consignmentNo, expectedDeliveryDate, expectedDeliveryTime } = await req.json();

    // Here you would integrate with your SMS and email service providers
    // For now, we'll just log the notification
    console.log("Sending notification to:", {
      email: recipientEmail,
      phone: recipientPhone,
      message: `Your parcel [${consignmentNo}] is scheduled for delivery on ${expectedDeliveryDate} at ${expectedDeliveryTime}. Visit our portal to modify the delivery schedule if needed.`,
    });

    return new Response(
      JSON.stringify({ message: "Notification sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});