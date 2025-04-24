import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("🛡️ PrivateRoute -> isAuthenticated:", isAuthenticated);
  console.log("🕒 PrivateRoute -> isLoading:", isLoading);

  // Exibe uma mensagem de carregamento enquanto a autenticação é verificada
  if (isLoading) {
    console.log("⏳ Carregando autenticação...");
    return <div><LoadingSpinner /></div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    console.log("🚫 Usuário não autenticado, redirecionando para o login.");
    return <Navigate to="/login" replace />;
  }

  // Se autenticado, renderiza a rota privada
  console.log("✅ Usuário autenticado, renderizando página.");
  return <Outlet />;
};

export default PrivateRoute;