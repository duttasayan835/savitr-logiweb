import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DashboardPage from "@/pages/admin/Dashboard";
import ParcelManagementPage from "@/pages/admin/ParcelManagement";
import SlotManagement from "@/pages/admin/SlotManagement";
import ConsignmentTracker from "@/pages/admin/ConsignmentTracker";
import GeneratePOD from "@/pages/admin/GeneratePOD";
import HomePage from "@/pages/Index";
import LoginPage from "@/pages/auth/Login";
import ModifySchedulePage from "@/pages/delivery/ModifySchedule";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/parcels" element={<ParcelManagementPage />} />
        <Route path="/admin/slots" element={<SlotManagement />} />
        <Route path="/admin/tracker" element={<ConsignmentTracker />} />
        <Route path="/admin/pod" element={<GeneratePOD />} />
        <Route path="/delivery/modify" element={<ModifySchedulePage />} />
      </Routes>
    </Router>
  );
};

export default App;