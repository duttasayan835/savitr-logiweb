import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  currentDate: Date;
}

export function DateSelector({ selectedDate, onDateSelect, currentDate }: DateSelectorProps) {
  const dates = [
    currentDate,
    new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // next day
    new Date(currentDate.getTime() + 48 * 60 * 60 * 1000), // day after next
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Select your delivery date</Label>
      <div className="grid grid-cols-1 gap-2 p-4 bg-muted/10 rounded-lg border border-muted">
        {dates.map((date) => (
          <div key={date.toISOString()} className="flex items-center space-x-2">
            <RadioGroupItem
              value={date.toISOString()}
              id={date.toISOString()}
              checked={selectedDate?.toISOString() === date.toISOString()}
              onClick={() => onDateSelect(date)}
            />
            <Label htmlFor={date.toISOString()}>
              {format(date, "dd/MM/yyyy")}
            </Label>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom-date" />
          <Label htmlFor="custom-date">Customize your date</Label>
        </div>
      </div>
    </div>
  );
}