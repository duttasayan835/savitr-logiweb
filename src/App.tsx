import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DashboardPage from "@/pages/admin/Dashboard";
import ParcelManagementPage from "@/pages/admin/ParcelManagement";
import SlotManagement from "@/pages/admin/SlotManagement";
import ConsignmentTracker from "@/pages/admin/ConsignmentTracker";
import GeneratePOD from "@/pages/admin/GeneratePOD";
import HomePage from "@/pages/Index";
import LoginPage from "@/pages/auth/Login";
import ModifySchedulePage from "@/pages/delivery/ModifySchedule";
import RecipientDashboard from "@/components/recipient/RecipientDashboard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthStateListener } from "@/components/auth/AuthStateListener";
import { NotificationProvider } from "@/contexts/NotificationContext";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          console.log("Admin profile check:", adminProfile);
          setIsAdmin(!!adminProfile);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        setIsAdmin(!!adminProfile);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <NotificationProvider>
        <AuthStateListener />
        <Navigation />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={
              !user ? (
                <LoginPage />
              ) : (
                <Navigate to={isAdmin ? "/admin/dashboard" : "/recipient/dashboard"} />
              )
            } 
          />

          {/* Recipient routes */}
          <Route 
            path="/recipient/dashboard" 
            element={
              user && !isAdmin ? (
                <RecipientDashboard />
              ) : (
                <Navigate to={isAdmin ? "/admin/dashboard" : "/login"} />
              )
            } 
          />
          <Route 
            path="/delivery/modify" 
            element={
              user && !isAdmin ? (
                <ModifySchedulePage />
              ) : (
                <Navigate to="/login" state={{ from: "/delivery/modify" }} />
              )
            } 
          />

          {/* Admin routes */}
          <Route 
            path="/admin/*" 
            element={
              user && isAdmin ? (
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/parcels" element={<ParcelManagementPage />} />
                  <Route path="/slots" element={<SlotManagement />} />
                  <Route path="/tracker" element={<ConsignmentTracker />} />
                  <Route path="/pod" element={<GeneratePOD />} />
                </Routes>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
};

export default App;