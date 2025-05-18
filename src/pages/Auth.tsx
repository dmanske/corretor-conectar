
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
    // Se o usuário já estiver autenticado, redireciona para a página inicial
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

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
