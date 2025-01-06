import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
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
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ParcelFormValues } from "./types";

interface ParcelFormFieldsProps {
  form: UseFormReturn<ParcelFormValues>;
}

export const ParcelFormFields: React.FC<ParcelFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="parcelType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type of Consignment *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select parcel type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="document">Letter / Document</SelectItem>
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
            <FormLabel>Recipient Name *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter recipient name" />
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
            <FormLabel>Recipient Phone *</FormLabel>
            <FormControl>
              <Input {...field} type="tel" placeholder="Enter phone number" />
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
            <FormLabel>Recipient Email *</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Enter email address" />
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
            <FormLabel>Expected Delivery Date *</FormLabel>
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
            <FormLabel>Expected Delivery Time *</FormLabel>
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
    </>
  );
};