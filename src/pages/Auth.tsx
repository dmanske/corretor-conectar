
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    // Log when the Auth page renders to help with debugging
    console.log("Auth page renderizada:", { isAuthenticated, isLoading, from });
    
    // Se o usuário já estiver autenticado e não estiver carregando, redireciona para a página inicial ou a página anterior
    if (isAuthenticated && !isLoading) {
      console.log("Usuário já autenticado na página Auth, redirecionando para", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Se estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <AuthContainer
      title="Sistema de Gestão Imobiliária"
      description="Faça login ou cadastre-se para acessar o sistema"
    >
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Cadastro</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </AuthContainer>
  );
};

export default Auth;
