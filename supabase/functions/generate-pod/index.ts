import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://cdn.skypack.dev/pdf-lib";

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
    const { date } = await req.json();
    console.log('Generating POD for date:', date);

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

    if (error) {
      console.error('Error fetching consignments:', error);
      throw error;
    }

    console.log(`Found ${consignments?.length ?? 0} consignments for date ${date}`);

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height, width } = page.getSize();
    
    // Get the font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add title
    page.drawText('Proof of Delivery', {
      x: 50,
      y: height - 50,
      size: 20,
      font: boldFont,
    });

    // Add date
    page.drawText(`Date: ${date}`, {
      x: width - 200,
      y: height - 50,
      size: 12,
      font: font,
    });

    let yPosition = height - 100;

    // Add consignments
    consignments?.forEach((consignment, index) => {
      // Move to next page if needed
      if (yPosition < 100) {
        const newPage = pdfDoc.addPage();
        yPosition = newPage.getSize().height - 50;
      }

      page.drawText(`Consignment ${index + 1}`, {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
      });
      yPosition -= 20;

      page.drawText(`Consignment No: ${consignment.consignment_no}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: font,
      });
      yPosition -= 20;

      page.drawText(`Recipient: ${consignment.recipient_name}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: font,
      });
      yPosition -= 20;

      page.drawText(`Phone: ${consignment.phone_no}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: font,
      });
      yPosition -= 20;

      page.drawText(`Address: ${consignment.address}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: font,
      });
      yPosition -= 40; // Extra space between consignments
    });

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    console.log('PDF generated successfully');

    return new Response(
      pdfBytes,
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="POD_${date}.pdf"`,
        }
      }
    );
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});