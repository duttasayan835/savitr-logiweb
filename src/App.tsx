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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthStateListener } from "@/components/auth/AuthStateListener";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user ?? null);
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
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/delivery/modify" />} />
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
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/parcels" element={<ParcelManagementPage />} />
        <Route path="/admin/slots" element={<SlotManagement />} />
        <Route path="/admin/tracker" element={<ConsignmentTracker />} />
        <Route path="/admin/pod" element={<GeneratePOD />} />
      </Routes>
    </Router>
  );
};

export default App;