import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format, addDays } from "date-fns";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  currentDate: Date;
}

export function DateSelector({ selectedDate, onDateSelect, currentDate }: DateSelectorProps) {
  const dates = [
    currentDate,
    addDays(currentDate, 1),
    addDays(currentDate, 2),
  ];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center">
        <span className="text-red-500 mr-1">*</span>
        Select your delivery date
      </Label>
      <RadioGroup
        value={selectedDate?.toISOString()}
        onValueChange={(value) => onDateSelect(new Date(value))}
        className="grid grid-cols-2 gap-4"
      >
        {dates.map((date) => (
          <div key={date.toISOString()} className="p-3 bg-white border rounded hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={date.toISOString()} id={date.toISOString()} />
              <Label htmlFor={date.toISOString()} className="text-sm">
                {format(date, "dd/MM/yyyy")}
              </Label>
            </div>
          </div>
        ))}
        <div className="p-3 bg-white border rounded hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom-date" />
            <Label htmlFor="custom-date" className="text-sm">
              Customize your date
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}