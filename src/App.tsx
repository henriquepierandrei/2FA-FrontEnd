import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/home/Dashboard";
import Register from "./pages/auth/Register";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import '@fortawesome/fontawesome-free/css/all.min.css';
import SmtpAccounts from "./components/smtp/SmtpAccounts";
import EmailTemplateBuilder from "./components/email/EmailTemplateBuilder";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard/*" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/smtp/*" element={
          <PrivateRoute>
            <SmtpAccounts />
          </PrivateRoute>
        } />

        <Route path="/template" element={
          <PrivateRoute>
            <EmailTemplateBuilder />
          </PrivateRoute>
        } />

        {/* Default Route */}
        <Route path="*" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;