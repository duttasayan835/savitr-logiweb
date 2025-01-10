import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import HomePage from "@/pages/Index";
import ConsumerDashboard from "@/components/consumer/ConsumerDashboard";
import RecipientDashboard from "@/components/recipient/RecipientDashboard";
import LoginPage from "@/pages/auth/Login";
import { useAuthStateManager } from "@/components/auth/AuthStateManager";
import { Auth } from "@/components/auth/Auth";

function App() {
  return (
    <Router>
      <AppContent />
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
              <Auth>
                <ConsumerDashboard />
              </Auth>
            }
          />
          <Route
            path="/recipient/dashboard"
            element={
              <Auth>
                <RecipientDashboard />
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