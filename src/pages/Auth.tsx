
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário já estiver autenticado e não estiver carregando, redireciona para a página inicial
    if (isAuthenticated && !isLoading) {
      console.log("Usuário já autenticado na página Auth, redirecionando para /");
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Se estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContainer
      title="Sistema de Gestão Imobiliária"
      description="Faça login ou cadastre-se para acessar o sistema"
    >
      <LoginForm />
      <RegisterForm />
    </AuthContainer>
  );
};

export default Auth;
