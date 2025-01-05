import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export function AuthStateListener() {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in:", session?.user.email);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      } else if (event === "TOKEN_REFRESHED") {
        if (!session) {
          console.error("Session expired");
          toast({
            title: "Session expired",
            description: "Your session has expired. Please sign in again.",
            variant: "destructive",
          });
        }
      }
    });

    // Listen for auth errors
    const handleAuthError = (event: CustomEvent<AuthError>) => {
      console.error("Auth error:", event.detail);
      const error = event.detail;

      if (error.message.includes("invalid_credentials")) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password and try again.",
          variant: "destructive",
        });
      } else if (error.message.includes("user_already_exists")) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "An error occurred during authentication.",
          variant: "destructive",
        });
      }
    };

    // Create and dispatch a custom event for auth errors
    const dispatchAuthError = (error: AuthError) => {
      const event = new CustomEvent('supabase.auth.error', { detail: error });
      window.dispatchEvent(event);
    };

    // Add error handler to Supabase auth
    const { data: { subscription: errorSubscription } } = supabase.auth.onError((error) => {
      console.error("Supabase auth error:", error);
      dispatchAuthError(error);
    });

    window.addEventListener('supabase.auth.error', handleAuthError as EventListener);

    return () => {
      subscription.unsubscribe();
      errorSubscription?.unsubscribe();
      window.removeEventListener('supabase.auth.error', handleAuthError as EventListener);
    };
  }, [toast]);

  return null;
}