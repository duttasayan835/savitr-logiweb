import { useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useToast } from "../ui/use-toast";

export function Auth() {
  const [isOpen, setIsOpen] = useState(true);
  const [userType, setUserType] = useState<"recipient" | "admin">("recipient");
  const [view, setView] = useState<"sign_up" | "sign_in">("sign_up");
  const { toast } = useToast();

  const handleContinue = async () => {
    localStorage.setItem("signUpUserType", userType);
    setIsOpen(false);
  };

  const handleViewChange = (newView: "sign_up" | "sign_in") => {
    setView(newView);
  };

  // Handle auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth event:", event);
    
    if (event === "SIGNED_OUT") {
      // Handle sign out
      console.log("User signed out");
    } else if (event === "SIGNED_IN") {
      // Handle successful sign in
      console.log("User signed in:", session?.user.email);
    }
  });

  // Add error handling for sign up
  supabase.auth.onError((error) => {
    console.log("Auth error:", error);
    
    if (error.message.includes("User already registered")) {
      toast({
        title: "Account exists",
        description: "This email is already registered. Please sign in instead.",
        variant: "destructive",
      });
      setView("sign_in");
    }
  });

  return (
    <>
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
          <Button onClick={handleContinue}>Continue</Button>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-[400px] mx-auto p-4 rounded-lg bg-white shadow-lg">
        <div className="mb-4 flex justify-center space-x-4">
          <Button
            variant={view === "sign_up" ? "default" : "outline"}
            onClick={() => handleViewChange("sign_up")}
          >
            Sign Up
          </Button>
          <Button
            variant={view === "sign_in" ? "default" : "outline"}
            onClick={() => handleViewChange("sign_in")}
          >
            Sign In
          </Button>
        </div>

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
          redirectTo="https://lovable.dev/auth/callback"
          localization={{
            variables: {
              sign_up: {
                button_label: "Create account",
                email_label: "Email",
                password_label: "Password",
              },
              sign_in: {
                button_label: "Sign in",
                email_label: "Email",
                password_label: "Password",
              }
            }
          }}
          view={view}
          showLinks={false}
        />
      </div>
    </>
  );
}