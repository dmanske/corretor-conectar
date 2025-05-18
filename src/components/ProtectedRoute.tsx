
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log when the protected route renders to help with debugging
    console.log("ProtectedRoute renderizado:", {
      isAuthenticated,
      isLoading,
      path: location.pathname
    });
  }, [isAuthenticated, isLoading, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log("Não autenticado em ProtectedRoute, redirecionando para /auth");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Only render children when user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
