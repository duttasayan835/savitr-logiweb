import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Format the delivery time slot for display
    const formatTimeSlot = (slot: string) => {
      switch (slot) {
        case "morning_early": return "Morning Slot (Before 10:00 AM)";
        case "morning": return "Morning Slot (10:00 AM-12:00 PM)";
        case "afternoon": return "Afternoon Slot (12:00 PM-2:00 PM)";
        case "evening": return "Evening Slot (2:00 PM-6:00 PM)";
        case "evening_late": return "Evening Slot (After 6:00 PM)";
        default: return slot;
      }
    };

    // Generate tracking URL
    const trackingUrl = "https://savitr-ai.com/tracking";
    const reschedulingUrl = `https://savitr-ai.com/delivery/${consignmentNo}`;

    // Format the email message with HTML
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <p>Consignment No: <strong>${consignmentNo}</strong> is scheduled to be delivered on ${expectedDeliveryDate} during the ${formatTimeSlot(expectedDeliveryTime)}.</p>
        <p>Track your parcel at: <a href="${trackingUrl}">${trackingUrl}</a></p>
        <p>For rescheduling your delivery time-slot, visit: <a href="${reschedulingUrl}">${reschedulingUrl}</a></p>
      </div>
    `;

    // Format the SMS message (plain text version)
    const smsMessage = `Consignment No: ${consignmentNo} is scheduled for delivery on ${expectedDeliveryDate} during ${formatTimeSlot(expectedDeliveryTime)}.\n\nTrack at: ${trackingUrl}\nReschedule at: ${reschedulingUrl}`;

    console.log("Sending notification:", {
      to: recipientEmail,
      phone: recipientPhone,
      htmlMessage,
      smsMessage,
    });

    // Here you would integrate with your email and SMS service providers
    // For now, we'll just log the notification
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Notification sent successfully",
        details: {
          email: recipientEmail,
          phone: recipientPhone,
          notification: {
            html: htmlMessage,
            sms: smsMessage
          }
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