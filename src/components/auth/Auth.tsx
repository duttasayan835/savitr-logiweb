import { useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function Auth() {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<"recipient" | "admin">("recipient");

  const handleContinue = () => {
    // Set the metadata that will be used in the database trigger
    supabase.auth.signUp({
      options: {
        data: {
          user_type: userType,
        },
      },
    });
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Account Type</DialogTitle>
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
          <Button onClick={handleContinue}>Continue</Button>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-[400px] mx-auto p-4 rounded-lg bg-white shadow-lg">
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#E31E24',
                  brandAccent: '#C41A1F',
                }
              }
            }
          }}
          providers={[]}
          onlyThirdPartyProviders={false}
          redirectTo={window.location.origin}
          onSignUp={() => setIsOpen(true)}
        />
      </div>
    </>
  );
}