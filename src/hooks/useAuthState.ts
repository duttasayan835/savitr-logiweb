import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAuthState() {
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
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
      } else if (event === "INITIAL_SESSION") {
        console.log("Checking for auth errors...");
        
        // Check URL parameters for error messages
        const urlParams = new URLSearchParams(window.location.search);
        const errorDescription = urlParams.get('error_description');
        const errorCode = urlParams.get('error_code');
        const error = urlParams.get('error');
        const bodyStr = urlParams.get('body');
        
        if (error === "invalid_credentials" || errorDescription?.includes("Invalid login credentials")) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive",
          });
        } else if (errorDescription?.includes("User already registered") || error === "user_already_registered") {
          toast({
            title: "Account already exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else if (bodyStr) {
          try {
            const body = JSON.parse(bodyStr);
            if (body.code === "user_already_exists") {
              toast({
                title: "Account already exists",
                description: "This email is already registered. Please sign in instead.",
                variant: "destructive",
              });
            }
          } catch (e) {
            console.error("Error parsing body:", e);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);
}