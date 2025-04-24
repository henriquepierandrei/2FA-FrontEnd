import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; 
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";


function App() {
  const { isAuthenticated } = useAuth(); // Obtenha o estado de autenticação

  return (
    <div>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Route>

        {/* Rota padrão */}
        <Route
          path="*"
          element={
        isAuthenticated ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <Navigate to="/login" replace />
        )
          }
        />
      </Routes>
    </div>
  );
}

export default App;