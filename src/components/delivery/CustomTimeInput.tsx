import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
}

export function CustomTimeInput({ value, onChange, visible }: CustomTimeInputProps) {
  if (!visible) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="custom-time" className="text-base font-semibold">
        Customize Time Slot (₹5 for slots before 10:00 AM or after 6:00 PM)
      </Label>
      <Input
        id="custom-time"
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[200px]"
      />
    </div>
  );
}