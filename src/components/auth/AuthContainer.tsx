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
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === "SIGNED_OUT") {
        console.log("User signed out");
      } else if (event === "SIGNED_IN") {
        console.log("User signed in successfully:", session?.user.email);
      } else if (event === "USER_UPDATED") {
        console.log("User updated:", session?.user.email);
      }

      // Handle session expiration
      if (!session && event === "TOKEN_REFRESHED") {
        console.error("Session expired");
        toast({
          title: "Session expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
      }
    });

    // Listen for auth errors
    const authErrorHandler = (error: any) => {
      console.error("Auth error:", error);
      
      if (error.message?.includes("Invalid login credentials")) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password and try again.",
          variant: "destructive",
        });
      } else if (error.message?.includes("User already registered")) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
      }
    };

    // Subscribe to auth error events
    supabase.auth.onError(authErrorHandler);

    return () => {
      subscription.unsubscribe();
      supabase.auth.onError(null);
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
      redirectTo="https://lovable.dev/auth/callback"
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