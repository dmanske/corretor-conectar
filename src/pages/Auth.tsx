
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Corretor Conecta</h1>
          <p className="text-gray-600 dark:text-gray-300">Sistema de Gestão Imobiliária</p>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl transform transition-all">
          <Tabs defaultValue="login" className="w-full">
            <div className="px-1 pt-1">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login" className="rounded-t-lg py-3">Entrar</TabsTrigger>
                <TabsTrigger value="register" className="rounded-t-lg py-3">Cadastrar</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© 2025 Sistema de Gestão Imobiliária. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default Auth;
