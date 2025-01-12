import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import HomePage from "@/pages/Index";
import ConsumerDashboard from "@/components/consumer/ConsumerDashboard";
import RecipientDashboard from "@/components/recipient/RecipientDashboard";
import LoginPage from "@/pages/auth/Login";
import { useAuthStateManager } from "@/components/auth/AuthStateManager";
import { Auth } from "@/components/auth/Auth";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ModifySchedulePage from "@/pages/delivery/ModifySchedule";
import AdminDashboard from "@/pages/admin/Dashboard";
import ParcelManagementPage from "@/pages/admin/ParcelManagement";
import SlotManagement from "@/pages/admin/SlotManagement";
import ConsignmentTracker from "@/pages/admin/ConsignmentTracker";
import GeneratePOD from "@/pages/admin/GeneratePOD";

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </Router>
  );
}

function AppContent() {
  useAuthStateManager();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/consumer/dashboard"
            element={
              <Auth requiredRole="recipient">
                <ConsumerDashboard />
              </Auth>
            }
          />
          <Route
            path="/recipient/dashboard"
            element={
              <Auth requiredRole="recipient">
                <RecipientDashboard />
              </Auth>
            }
          />
          <Route
            path="/delivery/modify"
            element={
              <Auth requiredRole="recipient">
                <ModifySchedulePage />
              </Auth>
            }
          />
          <Route
            path="/admin"
            element={
              <Auth requiredRole="admin">
                <AdminDashboard />
              </Auth>
            }
          />
          <Route
            path="/admin/parcels"
            element={
              <Auth requiredRole="admin">
                <ParcelManagementPage />
              </Auth>
            }
          />
          <Route
            path="/admin/slots"
            element={
              <Auth requiredRole="admin">
                <SlotManagement />
              </Auth>
            }
          />
          <Route
            path="/admin/tracker"
            element={
              <Auth requiredRole="admin">
                <ConsignmentTracker />
              </Auth>
            }
          />
          <Route
            path="/admin/pod"
            element={
              <Auth requiredRole="admin">
                <GeneratePOD />
              </Auth>
            }
          />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default App;