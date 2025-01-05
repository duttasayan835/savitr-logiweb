import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface AuthContainerProps {
  view: "sign_up" | "sign_in";
}

export function AuthContainer({ view }: AuthContainerProps) {
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === "SIGNED_OUT") {
        console.log("User signed out");
      } else if (event === "SIGNED_IN") {
        console.log("User signed in successfully:", session?.user.email);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else if (event === "USER_UPDATED") {
        console.log("User updated:", session?.user.email);
      } else if (event === "TOKEN_REFRESHED") {
        if (!session) {
          console.error("Session expired");
          toast({
            title: "Session expired",
            description: "Your session has expired. Please sign in again.",
            variant: "destructive",
          });
        }
      } else if (event === "INITIAL_SESSION" && !session) {
        console.error("Authentication failed");
        
        // Check URL parameters for error messages
        const urlParams = new URLSearchParams(window.location.search);
        const errorDescription = urlParams.get('error_description');
        const errorCode = urlParams.get('error_code');
        
        if (errorDescription?.includes("User already registered")) {
          toast({
            title: "Account already exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else if (errorCode === "422") {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Authentication failed",
            description: "Please check your credentials and try again.",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
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
      redirectTo={window.location.origin + "/auth/callback"}
      localization={{
        variables: {
          sign_up: {
            button_label: "Create account",
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email address",
            password_input_placeholder: "Choose a strong password",
          },
          sign_in: {
            button_label: "Sign in",
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email address",
            password_input_placeholder: "Your password",
          }
        }
      }}
      view={view}
      showLinks={false}
    />
  );
}