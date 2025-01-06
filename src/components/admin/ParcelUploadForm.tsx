import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ParcelFormFields } from "./ParcelFormFields";
import { parcelFormSchema, type ParcelFormValues } from "./types";

const generateConsignmentNo = () => {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${timestamp}-${randomStr}`;
};

const ParcelUploadForm = () => {
  const { toast } = useToast();
  const form = useForm<ParcelFormValues>({
    resolver: zodResolver(parcelFormSchema),
    defaultValues: {
      parcelType: "",
      recipientName: "",
      recipientPhone: "",
      recipientEmail: "",
      expectedDeliveryTime: "",
    },
  });

  const onSubmit = async (values: ParcelFormValues) => {
    try {
      console.log("Submitting parcel data:", values);
      
      // Generate a unique consignment number
      const consignmentNo = generateConsignmentNo();
      
      // Format the date for Supabase
      const formattedDate = format(values.expectedDeliveryDate, "yyyy-MM-dd");
      
      // Insert into parcels table
      const { data: parcel, error: parcelError } = await supabase
        .from("parcels")
        .insert({
          consignment_no: consignmentNo,
          parcel_type: values.parcelType,
          recipient_name: values.recipientName,
          recipient_phone: values.recipientPhone,
          recipient_email: values.recipientEmail,
          expected_delivery_date: formattedDate,
          expected_delivery_time: values.expectedDeliveryTime,
        })
        .select()
        .single();

      if (parcelError) {
        console.error("Error inserting parcel:", parcelError);
        throw parcelError;
      }

      // Create delivery slot
      const { error: slotError } = await supabase
        .from("delivery_slots")
        .insert({
          consignment_no: consignmentNo,
          type_of_consignment: values.parcelType,
          expected_delivery_date: formattedDate,
          expected_time_slot: values.expectedDeliveryTime,
          time_aligned: true,
        });

      if (slotError) {
        console.error("Error creating delivery slot:", slotError);
        throw slotError;
      }

      // Call the notification edge function
      const { error: notificationError } = await supabase.functions.invoke(
        "send-delivery-notification",
        {
          body: {
            recipientEmail: values.recipientEmail,
            recipientPhone: values.recipientPhone,
            consignmentNo: consignmentNo,
            expectedDeliveryDate: format(values.expectedDeliveryDate, "PPP"),
            expectedDeliveryTime: values.expectedDeliveryTime,
          },
        }
      );

      if (notificationError) {
        console.error("Error sending notification:", notificationError);
        throw notificationError;
      }

      toast({
        title: "Success",
        description: `Parcel details uploaded with consignment number: ${consignmentNo}`,
      });

      form.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description: "Failed to upload parcel details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <ParcelFormFields form={form} />
        <Button type="submit">Upload Parcel Details</Button>
      </form>
    </Form>
  );
};

export default ParcelUploadForm;