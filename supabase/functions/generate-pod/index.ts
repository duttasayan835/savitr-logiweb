import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as pdf from "https://deno.land/x/pdfkit@v0.3.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date } = await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch consignments for the specified date
    const { data: consignments, error } = await supabaseClient
      .from('consignments')
      .select('*')
      .eq('expected_delivery_date', date);

    if (error) throw error;

    // Generate PDF
    const doc = new pdf.default();
    
    // Add content to PDF
    doc.fontSize(20).text('Proof of Delivery', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${date}`, { align: 'right' });
    doc.moveDown();

    consignments.forEach((consignment, index) => {
      doc.fontSize(14).text(`Consignment ${index + 1}`);
      doc.fontSize(12).text(`Consignment No: ${consignment.consignment_no}`);
      doc.text(`Recipient: ${consignment.recipient_name}`);
      doc.text(`Phone: ${consignment.phone_no}`);
      doc.text(`Address: ${consignment.address}`);
      doc.moveDown();
    });

    // Finalize PDF
    doc.end();

    // Return PDF as response
    return new Response(
      doc.toBuffer(),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});