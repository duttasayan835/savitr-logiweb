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
      
      // Extract error details from the response body
      let errorDetails;
      try {
        // Handle both string and object error messages
        if (typeof error.message === 'string') {
          try {
            errorDetails = JSON.parse(error.message);
          } catch {
            errorDetails = { message: error.message };
          }
        } else {
          errorDetails = error.message;
        }
        console.log("Parsed error details:", errorDetails);
      } catch (e) {
        console.error("Error parsing error details:", e);
        errorDetails = { message: error.message };
      }

      // Handle user already exists error
      if (
        errorDetails?.code === "user_already_exists" || 
        errorDetails?.message?.includes("already registered")
      ) {
        console.log("User already exists, switching to sign in view");
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        onViewChange?.("sign_in");
        return;
      }

      // Handle invalid credentials error
      if (
        errorDetails?.code === "invalid_credentials" || 
        errorDetails?.message?.includes("invalid login credentials")
      ) {
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
        description: errorDetails?.message || "An error occurred during authentication.",
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