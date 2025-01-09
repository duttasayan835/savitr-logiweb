import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AuthStateListener() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session);

      if (event === "SIGNED_IN") {
        try {
          const { data: adminProfile, error: adminError } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (adminError) {
            console.error("Error checking admin status:", adminError);
            return;
          }

          if (adminProfile) {
            navigate("/admin/parcels");
            toast({
              title: "Welcome Admin",
              description: "You have been signed in successfully.",
            });
          } else {
            navigate("/");
            toast({
              title: "Welcome",
              description: "You have been signed in successfully.",
            });
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          toast({
            title: "Error",
            description: "An error occurred while signing in.",
            variant: "destructive",
          });
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/login");
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return null;
}