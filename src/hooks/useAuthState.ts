import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export function useAuthState() {
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      console.log("Session:", session);
      
      if (event === "SIGNED_OUT") {
        console.log("User signed out");
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
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
      }
    });

    // Listen for auth errors
    const handleAuthError = (event: CustomEvent<AuthError>) => {
      console.error("Auth error:", event.detail);
      const error = event.detail;

      if (error.message.includes("user_already_exists") || error.message.includes("User already registered")) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else if (error.message.includes("invalid_credentials")) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('supabase.auth.error', handleAuthError as EventListener);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('supabase.auth.error', handleAuthError as EventListener);
    };
  }, [toast]);
}