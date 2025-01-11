import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthCheck = (requiredRole?: "admin" | "recipient") => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/login");
          return;
        }

        if (requiredRole) {
          if (requiredRole === "admin") {
            const { data: adminProfile, error: adminError } = await supabase
              .from("admin_profiles")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            if (adminError || !adminProfile) {
              console.log("User is not an admin, redirecting");
              toast({
                title: "Access Denied",
                description: "You don't have permission to access this page.",
                variant: "destructive",
              });
              navigate("/recipient/dashboard");
              return;
            }
          } else {
            // Check for recipient profile
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .eq("user_type", "recipient")
              .single();

            if (profileError || !profile) {
              console.log("User is not a recipient, redirecting");
              toast({
                title: "Access Denied",
                description: "You don't have permission to access this page.",
                variant: "destructive",
              });
              navigate("/admin");
              return;
            }
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/login");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, requiredRole]);

  return { isLoading };
};