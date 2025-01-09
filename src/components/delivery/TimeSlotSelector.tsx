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
      <Label className="text-sm font-medium flex items-center">
        <span className="text-red-500 mr-1">*</span>
        Select your time-slot
      </Label>
      <RadioGroup
        value={selectedTimeSlot}
        onValueChange={onTimeSlotChange}
        className="grid grid-cols-2 gap-4"
      >
        <div className="p-3 bg-white border rounded hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="morning" id="morning" />
            <Label htmlFor="morning" className="text-sm">
              Morning Slot (10:00AM-12:00PM)
            </Label>
          </div>
        </div>
        <div className="p-3 bg-white border rounded hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="afternoon" id="afternoon" />
            <Label htmlFor="afternoon" className="text-sm">
              Afternoon Slot (12:00PM-3:00PM)
            </Label>
          </div>
        </div>
        <div className="p-3 bg-white border rounded hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="evening" id="evening" />
            <Label htmlFor="evening" className="text-sm">
              Evening Slot (3:00PM-5:00PM)
            </Label>
          </div>
        </div>
        <div className="p-3 bg-white border rounded hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="text-sm">
              Customize your Slot
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}