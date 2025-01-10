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
      <AuthStateListener />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={
            !user ? (
              <LoginPage />
            ) : (
              <Navigate to={isAdmin ? "/admin/parcels" : "/dashboard"} />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              isAdmin ? (
                <Navigate to="/admin/parcels" />
              ) : (
                <RecipientDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/delivery/modify" 
          element={
            user ? (
              <ModifySchedulePage />
            ) : (
              <Navigate to="/login" state={{ from: "/delivery/modify" }} />
            )
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            user && isAdmin ? (
              <Routes>
                <Route path="/" element={<DashboardPage />} />
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
      </Routes>
    </Router>
  );
};

export default App;