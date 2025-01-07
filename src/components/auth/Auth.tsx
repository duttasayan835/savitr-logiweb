import { useState, useEffect } from "react";
import { AuthContainer } from "./AuthContainer";
import { AuthStateListener } from "./AuthStateListener";
import { AccountTypeDialog } from "./AccountTypeDialog";
import { AuthTabs } from "./AuthTabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Auth() {
  const [isOpen, setIsOpen] = useState(true);
  const [userType, setUserType] = useState<"recipient" | "admin">("recipient");
  const [view, setView] = useState<"sign_up" | "sign_in">("sign_up");
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      } else if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Password recovery",
          description: "Check your email for password reset instructions.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleContinue = async () => {
    localStorage.setItem("signUpUserType", userType);
    setIsOpen(false);
  };

  const handleViewChange = (newView: "sign_up" | "sign_in") => {
    setView(newView);
  };

  return (
    <>
      <AuthStateListener />
      <Toaster />
      
      <AccountTypeDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userType={userType}
        setUserType={setUserType}
        onContinue={handleContinue}
      />

      <div className="w-full max-w-[400px] mx-auto p-4 rounded-lg bg-white shadow-lg">
        <AuthTabs view={view} onViewChange={handleViewChange} />
        <AuthContainer view={view} onViewChange={handleViewChange} />
      </div>
    </>
  );
}