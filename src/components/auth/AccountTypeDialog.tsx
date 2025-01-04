import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface AccountTypeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userType: "recipient" | "admin";
  setUserType: (type: "recipient" | "admin") => void;
  onContinue: () => void;
}

export function AccountTypeDialog({
  isOpen,
  setIsOpen,
  userType,
  setUserType,
  onContinue,
}: AccountTypeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Account Type</DialogTitle>
          <DialogDescription>Select your account type to continue</DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <RadioGroup
            defaultValue="recipient"
            onValueChange={(value: "recipient" | "admin") => setUserType(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="recipient" id="recipient" />
              <Label htmlFor="recipient">Recipient</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
          </RadioGroup>
        </div>
        <Button onClick={onContinue}>Continue</Button>
      </DialogContent>
    </Dialog>
  );
}