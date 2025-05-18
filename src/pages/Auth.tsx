
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent } from "@/components/ui/tabs";

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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Corretor Conecta</h1>
          <p className="text-gray-600">Sistema de Gestão Imobiliária</p>
        </div>
        
        <AuthContainer
          title=""
          description=""
          showTabs={false}
        >
          <Tabs defaultValue="login" className="w-full">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </div>
          </Tabs>
        </AuthContainer>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 Sistema de Gestão Imobiliária. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default Auth;
