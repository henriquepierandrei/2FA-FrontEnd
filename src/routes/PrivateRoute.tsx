import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('🛡️ PrivateRoute -> isAuthenticated:', isAuthenticated);
  console.log('🕒 PrivateRoute -> isLoading:', isLoading);

  if (isLoading) {
    console.log('⏳ Carregando autenticação...');
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    console.log('🚫 Usuário não autenticado, redirecionando para o login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;