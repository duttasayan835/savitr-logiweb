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
        Customize Time Slot (₹2 per 30 minutes after scheduled delivery time)
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