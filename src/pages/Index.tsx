import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LandingPage from "@landingpage/pages/Index";
// Nota: não precisamos mais importar o CSS da landing page diretamente, pois os estilos estão encapsulados
// import "../../landingpage/src/index.css";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("Usuário autenticado no Index, redirecionando para /app");
      navigate("/app");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Função para lidar com links internos
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.hash) {
        e.preventDefault();
        const element = document.querySelector(link.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Se estiver autenticado, redireciona para o app
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  
  // Se não estiver autenticado, mostra a landing page
  return <LandingPage />;
};

export default Index;
