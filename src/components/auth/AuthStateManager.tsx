import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthStateManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in successfully:", session?.user.email);
        
        // Check if user is an admin using maybeSingle() instead of single()
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
          console.log("Admin user detected, redirecting to admin dashboard");
          toast({
            title: "Welcome back, Admin!",
            description: "You have successfully signed in.",
          });
          navigate("/admin");
        } else {
          console.log("Regular user detected");
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          navigate("/recipient/dashboard");
        }
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);
};