import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TimeSlotSelectorProps {
  selectedTimeSlot: string;
  onTimeSlotChange: (value: string) => void;
  additionalCharges: number;
}

export function TimeSlotSelector({ selectedTimeSlot, onTimeSlotChange, additionalCharges }: TimeSlotSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Select your time-slot</Label>
      <RadioGroup
        value={selectedTimeSlot}
        onValueChange={onTimeSlotChange}
        className="grid grid-cols-1 gap-2 p-4 bg-muted/10 rounded-lg border border-muted"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="morning" id="morning" />
          <Label htmlFor="morning" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Morning Slot (10:00AM-12:00PM)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="afternoon" id="afternoon" />
          <Label htmlFor="afternoon" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Afternoon Slot (12:00PM-3:00PM)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="evening" id="evening" />
          <Label htmlFor="evening" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Evening Slot (3:00PM-5:00PM)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Customize your Slot
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}