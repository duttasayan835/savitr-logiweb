import { z } from "zod";

export const parcelFormSchema = z.object({
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

export type ParcelFormValues = z.infer<typeof parcelFormSchema>;