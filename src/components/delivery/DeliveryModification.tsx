import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { DateSelector } from "./DateSelector";
import { CustomTimeInput } from "./CustomTimeInput";

interface DeliveryModificationProps {
  consignmentNo: string;
  currentDate: Date;
  currentTimeSlot: string;
}

export function DeliveryModification({
  consignmentNo,
  currentDate,
  currentTimeSlot,
}: DeliveryModificationProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(currentTimeSlot);
  const [customTime, setCustomTime] = useState("16:30"); // 4:30 PM default
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [timeAligned, setTimeAligned] = useState(false);

  const handleTimeSlotChange = (value: string) => {
    setSelectedTimeSlot(value);
    const charges = calculateCharges(value);
    setAdditionalCharges(charges);
  };

  const calculateCharges = (timeSlot: string) => {
    if (timeSlot === "custom") {
      // Calculate charges based on custom time selection
      return 2; // Base charge for custom slot
    }
    return 0;
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("delivery_slots")
        .update({
          selected_date: selectedDate?.toISOString().split('T')[0],
          selected_time_slot: selectedTimeSlot,
          custom_time: selectedTimeSlot === "custom" ? customTime : null,
          time_aligned: timeAligned,
          status: "modified",
        })
        .eq("consignment_no", consignmentNo);

      if (error) throw error;

      if (additionalCharges > 0) {
        const { error: chargeError } = await supabase
          .from("delivery_charges")
          .insert({
            delivery_slot_id: consignmentNo,
            amount: additionalCharges,
            reason: "Custom time slot selection",
          });

        if (chargeError) throw chargeError;
      }

      toast({
        title: "Schedule updated",
        description: "Your delivery preferences have been saved",
      });
    } catch (error) {
      console.error("Error updating delivery schedule:", error);
      toast({
        title: "Error",
        description: "Failed to update delivery schedule",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Dynamic Time Slot Management System</h2>
        <div className="text-sm text-muted-foreground">
          <p>Consignment No: {consignmentNo}</p>
          <p>Type of Consignment: Letter / Document</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Does the allotted time align with your schedule?</p>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={timeAligned}
                onChange={() => setTimeAligned(true)}
                className="radio"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={!timeAligned}
                onChange={() => setTimeAligned(false)}
                className="radio"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {!timeAligned && (
          <>
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              currentDate={currentDate}
            />

            <TimeSlotSelector
              selectedTimeSlot={selectedTimeSlot}
              onTimeSlotChange={handleTimeSlotChange}
              additionalCharges={additionalCharges}
            />

            <CustomTimeInput
              value={customTime}
              onChange={setCustomTime}
              visible={selectedTimeSlot === "custom"}
            />

            {additionalCharges > 0 && (
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <span>Additional charges of ₹{additionalCharges} will apply</span>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Confirm
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}