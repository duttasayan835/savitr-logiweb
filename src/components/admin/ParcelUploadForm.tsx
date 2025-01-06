import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  consignmentNo: z.string().min(1, "Consignment number is required"),
  parcelType: z.string().min(1, "Parcel type is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientPhone: z.string().min(10, "Valid phone number is required"),
  recipientEmail: z.string().email("Valid email is required"),
  expectedDeliveryDate: z.date({
    required_error: "Expected delivery date is required",
  }),
  expectedDeliveryTime: z.string().min(1, "Expected delivery time is required"),
});

const ParcelUploadForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consignmentNo: "",
      parcelType: "",
      recipientName: "",
      recipientPhone: "",
      recipientEmail: "",
      expectedDeliveryTime: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting parcel data:", values);
      
      // Insert into parcels table
      const { data: parcel, error: parcelError } = await supabase
        .from("parcels")
        .insert({
          consignment_no: values.consignmentNo,
          parcel_type: values.parcelType,
          recipient_name: values.recipientName,
          recipient_phone: values.recipientPhone,
          recipient_email: values.recipientEmail,
          expected_delivery_date: values.expectedDeliveryDate,
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
          consignment_no: values.consignmentNo,
          type_of_consignment: values.parcelType,
          expected_delivery_date: values.expectedDeliveryDate,
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
            consignmentNo: values.consignmentNo,
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
        description: "Parcel details uploaded and notification sent.",
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
        <FormField
          control={form.control}
          name="consignmentNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consignment Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parcelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parcel Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parcel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="package">Package</SelectItem>
                  <SelectItem value="fragile">Fragile</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipientPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Phone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipientEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedDeliveryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expected Delivery Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedDeliveryTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Delivery Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="morning_early">Before 10 AM (₹20 extra)</SelectItem>
                  <SelectItem value="morning">10 AM - 12 PM</SelectItem>
                  <SelectItem value="afternoon">12 PM - 2 PM</SelectItem>
                  <SelectItem value="evening">2 PM - 6 PM</SelectItem>
                  <SelectItem value="evening_late">After 6 PM (₹20 extra)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Upload Parcel Details</Button>
      </form>
    </Form>
  );
};

export default ParcelUploadForm;