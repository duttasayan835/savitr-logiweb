import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface AuthUIProps {
  view: "sign_up" | "sign_in";
  onViewChange?: (view: "sign_up" | "sign_in") => void;
}

export function AuthUI({ view, onViewChange }: AuthUIProps) {
  const { toast } = useToast();
  const redirectTo = `${window.location.origin}/auth/callback`;
  console.log("Redirect URL:", redirectTo);

  useEffect(() => {
    // Listen for auth errors
    const handleAuthError = (error: any) => {
      console.error("Auth error details:", error);
      
      if (error.message.includes("missing email")) {
        toast({
          title: "Missing Email",
          description: "Please enter your email address.",
          variant: "destructive",
        });
      } else if (error.message.includes("user_already_exists") || error.message.includes("User already registered")) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        // Switch to sign in view if the user already exists
        onViewChange?.("sign_in");
      }
    };

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("User signed in successfully:", session?.user.email);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
      }

      // Check for auth errors in the session
      const error = (session as any)?.error;
      if (error) {
        handleAuthError(error);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, onViewChange]);

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
      redirectTo={redirectTo}
      localization={{
        variables: {
          sign_up: {
            button_label: "Create account",
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email address",
            password_input_placeholder: "Choose a strong password",
            link_text: "Already have an account? Sign in",
          },
          sign_in: {
            button_label: "Sign in",
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email address",
            password_input_placeholder: "Your password",
            link_text: "Don't have an account? Sign up",
          }
        }
      }}
      view={view}
      showLinks={true}
    />
  );
}