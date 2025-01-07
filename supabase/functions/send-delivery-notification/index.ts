import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  recipientEmail: string;
  recipientPhone: string;
  consignmentNo: string;
  expectedDeliveryDate: string;
  expectedDeliveryTime: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Delivery notification function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientPhone, consignmentNo, expectedDeliveryDate, expectedDeliveryTime } = await req.json() as NotificationRequest;

    // Format the time slot for display
    const timeSlot = expectedDeliveryTime.replace(/_/g, ' ').replace(/(\w+)/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

    // Send email notification
    const emailResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({
          to: [recipientEmail],
          subject: `Delivery Notification - ${consignmentNo}`,
          consignmentNo,
          deliveryDate: expectedDeliveryDate,
          timeSlot,
        }),
      }
    );

    if (!emailResponse.ok) {
      console.error("Error sending email:", await emailResponse.text());
      throw new Error("Failed to send email notification");
    }

    console.log("Notifications sent successfully");
    return new Response(
      JSON.stringify({ message: "Notifications sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in delivery notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);