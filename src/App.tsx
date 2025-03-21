import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRedirect from "./components/auth/AuthRedirect";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import DashboardLayout from "./components/layout/DashboardLayout";
import UserSettings from "./components/settings/UserSettings";
import InventoryManagement from "./components/inventory/InventoryManagement";
import HelpAndSupport from "./components/help/HelpAndSupport";

// Lazy load components
const DashboardOverview = lazy(
  () => import("./components/dashboard/DashboardOverview"),
);
const PatientManagement = lazy(
  () => import("./components/patients/PatientManagement"),
);
const CalendarView = lazy(() => import("./components/calendar/CalendarView"));
const TreatmentPlans = lazy(
  () => import("./components/treatments/TreatmentPlans"),
);
const AnalyticsDashboard = lazy(
  () => import("./components/analytics/AnalyticsDashboard"),
);
const CommunicationPortal = lazy(
  () => import("./components/communication/CommunicationPortal"),
);

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<AuthRedirect />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="patients" element={<PatientManagement />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="treatments" element={<TreatmentPlans />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="communication" element={<CommunicationPortal />} />
              <Route path="settings" element={<UserSettings />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="help" element={<HelpAndSupport />} />
              <Route path="logout" element={<Navigate to="/signin" />} />
            </Route>
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
            <Route path="*" element={<AuthRedirect />} />
          </Routes>
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
