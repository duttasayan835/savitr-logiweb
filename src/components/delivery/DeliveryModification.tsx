import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const [acceptDefault, setAcceptDefault] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(currentTimeSlot);
  const [additionalCharges, setAdditionalCharges] = useState(0);

  // Calculate if we're within the 12-hour modification window
  const canModify = () => {
    const now = new Date();
    const deliveryDate = new Date(currentDate);
    const hoursDifference = (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference >= 12;
  };

  // Calculate additional charges based on time slot
  const calculateCharges = (timeSlot: string) => {
    if (timeSlot === "morning_early") return 20;
    if (timeSlot === "evening_late") return 20;
    return 0;
  };

  const handleTimeSlotChange = (value: string) => {
    setSelectedTimeSlot(value);
    const charges = calculateCharges(value);
    setAdditionalCharges(charges);
  };

  const handleSubmit = async () => {
    if (!canModify()) {
      toast({
        title: "Modification window closed",
        description: "Changes can only be made 12 hours before delivery",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Invalid date",
        description: "Please select a valid delivery date",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("delivery_slots")
        .update({
          selected_date: selectedDate.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
          selected_time_slot: selectedTimeSlot,
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
            reason: "Special time slot selection",
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
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Modify Delivery Schedule</h2>
        <p className="text-muted-foreground">
          Consignment: {consignmentNo}
        </p>

        <div className="space-y-4">
          <RadioGroup
            defaultValue={acceptDefault ? "yes" : "no"}
            onValueChange={(value) => setAcceptDefault(value === "yes")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="accept-default" />
              <Label htmlFor="accept-default">Accept default schedule</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="modify-schedule" />
              <Label htmlFor="modify-schedule">Modify schedule</Label>
            </div>
          </RadioGroup>

          {!acceptDefault && (
            <div className="space-y-4">
              <div>
                <Label>Select New Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const now = new Date();
                    return date < now;
                  }}
                  className="rounded-md border"
                />
              </div>

              <div>
                <Label>Select Time Slot</Label>
                <RadioGroup
                  value={selectedTimeSlot}
                  onValueChange={handleTimeSlotChange}
                  className="grid grid-cols-1 gap-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="morning_early" id="morning-early" />
                    <Label htmlFor="morning-early" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Early Morning (6:00 AM - 10:00 AM)
                      <span className="text-sm text-muted-foreground">(₹20 additional charge)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="morning" id="morning" />
                    <Label htmlFor="morning" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Morning (10:00 AM - 2:00 PM)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="afternoon" id="afternoon" />
                    <Label htmlFor="afternoon" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Afternoon (2:00 PM - 6:00 PM)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="evening_late" id="evening-late" />
                    <Label htmlFor="evening-late" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Late Evening (6:00 PM - 10:00 PM)
                      <span className="text-sm text-muted-foreground">(₹20 additional charge)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {additionalCharges > 0 && (
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Additional charges of ₹{additionalCharges} will apply</span>
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!canModify()}
        >
          Save Preferences
        </Button>

        {!canModify() && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Modification window has closed (changes must be made 12 hours before delivery)
          </p>
        )}
      </div>
    </Card>
  );
}