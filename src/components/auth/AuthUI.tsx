import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { AuthError } from "@supabase/supabase-js";

interface AuthUIProps {
  view: "sign_up" | "sign_in";
  onViewChange?: (view: "sign_up" | "sign_in") => void;
}

export function AuthUI({ view, onViewChange }: AuthUIProps) {
  const { toast } = useToast();
  const redirectTo = `${window.location.origin}/auth/callback`;
  console.log("Auth UI initialized with view:", view);
  console.log("Redirect URL:", redirectTo);

  useEffect(() => {
    const handleAuthError = (error: AuthError) => {
      console.error("Auth error:", error);
      
      let errorMessage = error.message;
      let errorCode = "";
      
      // Try to parse the error message if it's a JSON string
      try {
        const parsedError = JSON.parse(error.message);
        errorMessage = parsedError.message || errorMessage;
        errorCode = parsedError.code || "";
        console.log("Parsed error details:", { errorCode, errorMessage });
      } catch (e) {
        // If parsing fails, use the original message
        console.log("Using original error message:", errorMessage);
      }

      // Handle user already exists error
      if (errorCode === "user_already_exists" || errorMessage.includes("already registered")) {
        console.log("User already exists, switching to sign in view");
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        onViewChange?.("sign_in");
        return;
      }

      // Handle other common errors
      if (errorMessage.includes("invalid_credentials")) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password and try again.",
          variant: "destructive",
        });
        return;
      }

      // Default error message
      toast({
        title: "Error",
        description: errorMessage || "An error occurred during authentication.",
        variant: "destructive",
      });
    };

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session);
      
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