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
      <Label htmlFor="custom-time" className="text-sm font-medium flex items-center">
        <span className="text-red-500 mr-1">*</span>
        Customize Time Slot (Pls. Enter Your Preferred Time)
      </Label>
      <Input
        id="custom-time"
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[200px] border rounded"
      />
    </div>
  );
}