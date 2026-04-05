import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminBuilder from "./pages/AdminBuilder";
import AttemptsHistory from "./pages/AttemptsHistory";
import Certificate from "./pages/Certificate";
import Dashboard from "./pages/Dashboard";
import DecisionScenario from "./pages/DecisionScenario";
import FAQPage from "./pages/FAQPage";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import ModuleDetail from "./pages/ModuleDetail";
import Modules from "./pages/Modules";
import Register from "./pages/Register";
import Sections from "./pages/Sections";
import SectionModules from "./pages/SectionModules";
import Simulations from "./pages/Simulations";
import ThreatLibrary from "./pages/ThreatLibrary";
import Welcome from "./pages/Welcome";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                  element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome"           element={<Welcome />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/register/success"  element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/sections" element={
            <ProtectedRoute><Sections /></ProtectedRoute>
          } />
          <Route path="/sections/:id/modules" element={
            <ProtectedRoute><SectionModules /></ProtectedRoute>
          } />
          <Route path="/modules" element={
            <ProtectedRoute><Modules /></ProtectedRoute>
          } />
          <Route path="/modules/:id" element={
            <ProtectedRoute><ModuleDetail /></ProtectedRoute>
          } />
          <Route path="/simulations" element={
            <ProtectedRoute><Simulations /></ProtectedRoute>
          } />
          <Route path="/scenarios/:id" element={
            <ProtectedRoute><DecisionScenario /></ProtectedRoute>
          } />
          <Route path="/threat-library" element={
            <ProtectedRoute><ThreatLibrary /></ProtectedRoute>
          } />
          <Route path="/attempts-history" element={
            <ProtectedRoute><AttemptsHistory /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute><Leaderboard /></ProtectedRoute>
          } />
          <Route path="/certificate" element={
            <ProtectedRoute><Certificate /></ProtectedRoute>
          } />
          <Route path="/faq" element={
            <ProtectedRoute><FAQPage /></ProtectedRoute>
          } />
          <Route path="/admin-builder" element={
            <ProtectedRoute><AdminBuilder /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
