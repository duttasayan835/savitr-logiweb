import { useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AccountTypeDialog } from "./AccountTypeDialog";
import { AuthTabs } from "./AuthTabs";

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
      console.log("User signed out");
    } else if (event === "SIGNED_IN") {
      console.log("User signed in:", session?.user.email);
    }
  });

  return (
    <>
      <AccountTypeDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userType={userType}
        setUserType={setUserType}
        onContinue={handleContinue}
      />

      <div className="w-full max-w-[400px] mx-auto p-4 rounded-lg bg-white shadow-lg">
        <AuthTabs view={view} onViewChange={handleViewChange} />

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