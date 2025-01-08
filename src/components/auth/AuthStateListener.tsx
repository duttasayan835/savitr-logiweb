import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AuthStateListener() {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in:", session?.user.email);
        
        try {
          const { data: adminProfile, error } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (error) {
            console.error("Error checking admin status:", error);
            toast({
              title: "Error",
              description: "An error occurred while checking permissions.",
              variant: "destructive",
            });
            return;
          }

          if (adminProfile) {
            console.log("Admin user detected, redirecting to admin/parcels");
            toast({
              title: "Welcome back, Admin!",
              description: "You have successfully signed in.",
            });
            navigate("/admin/parcels");
          } else {
            console.log("Regular user detected");
            toast({
              title: "Welcome back!",
              description: "You have successfully signed in.",
            });
            navigate("/");
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          toast({
            title: "Error",
            description: "An error occurred while processing your login.",
            variant: "destructive",
          });
        }
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
}