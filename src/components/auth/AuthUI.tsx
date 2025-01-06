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
      
      // Parse error details from the response body
      let errorDetails;
      try {
        const errorBody = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
        errorDetails = JSON.parse(errorBody);
        console.log("Parsed error details:", errorDetails);
      } catch (e) {
        console.error("Error parsing details, using original:", e);
        errorDetails = { 
          code: error.message.includes("invalid_credentials") ? "invalid_credentials" : "",
          message: error.message 
        };
      }

      // Handle specific error cases
      switch (errorDetails.code) {
        case "user_already_exists":
          console.log("User already exists, switching to sign in");
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
          onViewChange?.("sign_in");
          break;

        case "invalid_credentials":
          console.log("Invalid credentials provided");
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive",
          });
          break;

        default:
          // Check message content for additional error cases
          if (errorDetails.message.includes("already registered")) {
            console.log("User already registered (message check)");
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
            onViewChange?.("sign_in");
          } else if (errorDetails.message.includes("invalid login credentials")) {
            console.log("Invalid login credentials (message check)");
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password and try again.",
              variant: "destructive",
            });
          } else {
            console.log("Unhandled error:", errorDetails.message);
            toast({
              title: "Error",
              description: errorDetails.message || "An error occurred during authentication.",
              variant: "destructive",
            });
          }
      }
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