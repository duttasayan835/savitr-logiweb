import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { AuthError } from "@supabase/supabase-js";

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
    });

    // Listen for auth errors
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("Successful sign in");
      } else {
        // Check for auth errors in the URL
        const url = new URL(window.location.href);
        const errorDescription = url.searchParams.get("error_description");
        
        if (errorDescription) {
          toast({
            title: "Authentication error",
            description: "Invalid credentials. Please check your email and password.",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      authListener.data.subscription.unsubscribe();
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
  );
}