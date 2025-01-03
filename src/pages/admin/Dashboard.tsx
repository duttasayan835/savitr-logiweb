import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/");
        } else {
          console.log("Session found, user is authenticated");
          // Check if user is an admin
          const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (!adminProfile) {
            console.log("User is not an admin, redirecting");
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT') {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default DashboardPage;