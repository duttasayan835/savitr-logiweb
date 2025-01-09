import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { DateSelector } from "./DateSelector";
import { CustomTimeInput } from "./CustomTimeInput";
import { format } from "date-fns";

interface DeliveryModificationProps {
  consignmentNo: string;
  currentDate: Date;
  currentTimeSlot: string;
  typeOfConsignment: string;
}

export function DeliveryModification({
  consignmentNo,
  currentDate,
  currentTimeSlot,
  typeOfConsignment,
}: DeliveryModificationProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(currentTimeSlot);
  const [customTime, setCustomTime] = useState("16:30");
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [timeAligned, setTimeAligned] = useState(false);

  const handleTimeSlotChange = (value: string) => {
    setSelectedTimeSlot(value);
    calculateCharges(value);
  };

  const calculateCharges = (timeSlot: string) => {
    const baseRate = 2; // Rs. 2 per gm
    let charges = 0;

    if (timeSlot === "custom") {
      const time = customTime.split(":");
      const hour = parseInt(time[0]);
      const minutes = parseInt(time[1]);
      
      // Calculate charges based on time difference
      const scheduledTime = new Date();
      scheduledTime.setHours(15, 0, 0); // 3:00 PM default delivery time
      const selectedTime = new Date();
      selectedTime.setHours(hour, minutes, 0);
      
      const diffInMinutes = Math.abs(selectedTime.getTime() - scheduledTime.getTime()) / (1000 * 60);
      charges = Math.floor(diffInMinutes / 30) * 5; // Rs. 5 every 30 minutes
    }

    setAdditionalCharges(charges);
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
    <Card className="p-6 space-y-6 max-w-2xl mx-auto bg-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/8a28cf14-d9ce-4238-9030-24fdfccf76f7.png" alt="India Post Logo" className="h-12" />
            <h1 className="text-2xl font-bold text-red-600">Savitr-AI</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-600 cursor-pointer">QuickHelp</span>
            <HelpCircle className="h-4 w-4 text-blue-600" />
          </div>
        </div>

        <div className="text-sm text-gray-600 border-b pb-2">
          You Are Here: Home >> Savitr-AI
        </div>
        
        <h2 className="text-xl font-semibold">Dynamic Time Slot Management System</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium flex items-center">
              <span className="text-red-500 mr-1">*</span>
              Consignment No.
            </label>
            <div className="p-2 bg-gray-100 rounded border">{consignmentNo}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Type of Consignment</label>
            <div className="p-2 bg-gray-100 rounded border">
              {typeOfConsignment}
              <div className="text-xs text-blue-600">Auto Detected</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Expected Delivery Date</label>
            <div className="p-2 bg-gray-100 rounded border">
              {format(currentDate, "dd/MM/yyyy")}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Expected time of delivery</label>
            <div className="p-2 bg-gray-100 rounded border text-red-600">
              Evening Slot (3:00PM-6:00PM)
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <span className="text-red-500 mr-1">*</span>
            Does the allotted time align with your schedule?
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={timeAligned}
                onChange={() => setTimeAligned(true)}
                className="radio text-red-600"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={!timeAligned}
                onChange={() => setTimeAligned(false)}
                className="radio text-red-600"
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
              <div className="text-red-600 text-sm">
                [2 Rs. Per gm & 5 Rs. Every 30 minutes after the scheduled delivery time]
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}