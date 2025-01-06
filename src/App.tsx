import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import DashboardPage from "./pages/admin/Dashboard";
import LoginPage from "./pages/auth/Login";
import ParcelManagementPage from "./pages/admin/ParcelManagement";
import ModifySchedulePage from "./pages/delivery/ModifySchedule";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/parcels" element={<ParcelManagementPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/delivery/modify" element={<ModifySchedulePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;