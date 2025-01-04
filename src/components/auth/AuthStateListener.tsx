import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AuthStateListener() {
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      
      if (event === "SIGNED_OUT") {
        console.log("User signed out");
      } else if (event === "SIGNED_IN") {
        console.log("User signed in:", session?.user.email);
      }
    });
  }, []);

  return null;
}