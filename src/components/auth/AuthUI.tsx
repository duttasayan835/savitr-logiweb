import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuthErrorHandler } from "./AuthErrorHandler";
import { useAuthStateManager } from "./AuthStateManager";
import { useEffect } from "react";
import { AuthError } from "@supabase/supabase-js";

interface AuthUIProps {
  view: "sign_up" | "sign_in";
  onViewChange?: (view: "sign_up" | "sign_in") => void;
}

export function AuthUI({ view, onViewChange }: AuthUIProps) {
  const { handleAuthError } = useAuthErrorHandler({ onViewChange });
  useAuthStateManager();

  const redirectTo = `${window.location.origin}/auth/callback`;
  console.log("Auth UI initialized with view:", view);
  console.log("Redirect URL:", redirectTo);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("Auth state change event:", event);
      
      if (event === "USER_DELETED" || event === "SIGNED_OUT") {
        // Handle potential auth errors through the error handler
        const error = new AuthError('Authentication error occurred');
        handleAuthError(error);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleAuthError]);

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
            link_text: "Don't have an account? Sign up",
          },
          sign_in: {
            button_label: "Sign in",
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email address",
            password_input_placeholder: "Your password",
            link_text: "Already have an account? Sign in",
          }
        }
      }}
      view={view}
      showLinks={true}
    />
  );
}