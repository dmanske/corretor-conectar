
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "./Dashboard";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If authenticated and done loading, ensure we stay on the page
    if (isAuthenticated && !isLoading) {
      console.log("Usuario autenticado no Index, carregando Dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    console.log("Não autenticado no Index, redirecionando para /auth");
    return <Navigate to="/auth" replace />;
  }
  
  // Only render the dashboard when we're sure the user is authenticated
  return <Dashboard />;
};

export default Index;
