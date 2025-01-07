import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DashboardPage from "@/pages/admin/Dashboard";
import ParcelManagementPage from "@/pages/admin/ParcelManagement";
import SlotManagement from "@/pages/admin/SlotManagement";
import ConsignmentTracker from "@/pages/admin/ConsignmentTracker";
import GeneratePOD from "@/pages/admin/GeneratePOD";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
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
