import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  recipientEmail: string;
  recipientPhone: string;
  consignmentNo: string;
  expectedDeliveryDate: string;
  expectedDeliveryTime: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientPhone, consignmentNo, expectedDeliveryDate, expectedDeliveryTime } = await req.json() as NotificationRequest;

    // Generate a temporary password (in production, this should be more secure)
    const tempPassword = Math.random().toString(36).slice(-8);

    // Format the delivery time slot for display
    const formatTimeSlot = (slot: string) => {
      switch (slot) {
        case "morning_early": return "Before 10 AM";
        case "morning": return "10 AM - 12 PM";
        case "afternoon": return "12 PM - 2 PM";
        case "evening": return "2 PM - 6 PM";
        case "evening_late": return "After 6 PM";
        default: return slot;
      }
    };

    const message = `Your parcel [${consignmentNo}] is scheduled for delivery on ${expectedDeliveryDate} at ${formatTimeSlot(expectedDeliveryTime)}. 
    To modify the delivery schedule, please visit: https://savitr-ai.com/delivery/${consignmentNo}
    Temporary login credentials:
    User ID: ${recipientPhone}
    Password: ${tempPassword}`;

    console.log("Sending notification:", {
      to: recipientEmail,
      phone: recipientPhone,
      message: message,
    });

    // Here you would integrate with your SMS and email service providers
    // For now, we'll just log the notification
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Notification sent successfully",
        details: {
          email: recipientEmail,
          phone: recipientPhone,
          notification: message,
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});