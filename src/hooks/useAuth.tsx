import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

// Using the client from our integrations for consistency
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth provider montado");
    
    let mounted = true;
    
    // Set up listener for auth state changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Evento de autenticação:", event);
        
        if (!mounted) return;
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);
        
        if (event === 'SIGNED_IN' && newSession) {
          console.log("Usuário autenticado, redirecionando...");
          toast({
            title: "Login bem-sucedido",
            description: `Bem-vindo, ${newSession.user.user_metadata.name || newSession.user.email}!`
          });
          
          // Use setTimeout to avoid multiple redirections in the same tick
          setTimeout(() => {
            if (mounted) {
              navigate("/", { replace: true });
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log("Usuário deslogado");
          // Limpar o estado local
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          // Use replace to prevent back button from going back to protected routes
          navigate("/auth", { replace: true });
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log("Sessão atual:", currentSession ? "Autenticado" : "Não autenticado");
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };
    
    checkSession();

    // Limpar subscription ao desmontar
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!"
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Verifique seu email para confirmar o cadastro."
        });
      }
    } catch (error: any) {
      console.error("Register error:", error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível completar o seu cadastro. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Link de recuperação enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Erro ao enviar link de recuperação",
        description: error.message || "Não foi possível enviar o link de recuperação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const logout = async () => {
    try {
      // 1. Limpar estado local
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // 2. Limpar apenas os dados do Supabase do localStorage
      const supabaseKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || 
        key.includes('supabase') || 
        key.includes('supa')
      );
      supabaseKeys.forEach(key => localStorage.removeItem(key));
      
      // 3. Tentar fazer o logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        // Mesmo com erro, continuamos com o processo
      }
      
      // 4. Redirecionar para a página de auth
      window.location.replace('/#/auth');
      
    } catch (error) {
      console.error("Logout error:", error);
      // Mesmo com erro, forçar redirecionamento
      window.location.replace('/#/auth');
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Get the absolute URL for redirection
      const origin = window.location.origin;
      // Para HashRouter, o correto é usar /#/
      const redirectTo = `${origin}/#/`;
      console.log("Redirecionando para login com Google com URL:", redirectTo);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) {
        console.error("Google login error:", error);
        toast({
          title: "Erro no login com Google",
          description: error.message || "Não foi possível fazer login com o Google. Tente novamente.",
          variant: "destructive"
        });
      } else {
        console.log("Redirecionando para o Google...");
      }
    } catch (error: any) {
      console.error("Login com Google error:", error);
      toast({
        title: "Erro no login com Google",
        description: error.message || "Não foi possível fazer login com o Google. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      isLoading, 
      loginWithGoogle,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
