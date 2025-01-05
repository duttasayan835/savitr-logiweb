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

    // Create a custom event handler for auth errors
    const handleAuthError = (error: AuthError) => {
      console.error("Auth error:", error);
      const errorMessage = error.message.toLowerCase();
      const errorCode = (error as any).code?.toLowerCase();

      if (errorCode === "user_already_exists" || errorMessage.includes("user already registered")) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else if (errorCode === "invalid_credentials" || errorMessage.includes("invalid login credentials")) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password and try again.",
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

    // Subscribe to auth state changes and handle errors
    const authErrorSubscription = supabase.auth.onError((error) => {
      if (error) {
        handleAuthError(error);
      }
    });

    return () => {
      subscription.unsubscribe();
      authErrorSubscription.unsubscribe();
    };
  }, [toast]);

  return null;
}