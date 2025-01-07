import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  consignmentNo: string;
  deliveryDate: string;
  timeSlot: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Email function invoked");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    console.log("Received email request:", emailRequest);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Delivery Notification</h2>
        <p>Consignment No: ${emailRequest.consignmentNo}</p>
        <p>Your package is scheduled to be delivered on ${emailRequest.deliveryDate} during the ${emailRequest.timeSlot}.</p>
        <p>Track your package at: <a href="https://savitr-ai.com/track">https://savitr-ai.com/track</a></p>
        <p>To reschedule your delivery, visit: <a href="https://savitr-ai.com/reschedule">https://savitr-ai.com/reschedule</a></p>
        <p>Thank you for choosing our service!</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Savitr-AI <noreply@savitr-ai.com>",
        to: emailRequest.to,
        subject: emailRequest.subject,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-email function:", error);
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