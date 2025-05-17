import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

const supabaseUrl = 'https://dazmyjjanixtjiyiixqu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhem15amphbml4dGppeWlpeHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjI0NzAsImV4cCI6MjA2Mjc5ODQ3MH0.0ET70vWucSDbTsPai3fWZQiYDc625SzWxFySNKIZnZI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        navigate("/");
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

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Login com Google bem-sucedido",
          description: "Bem-vindo de volta!"
        });
      }
    } catch (error: any) {
      console.error("Login com Google error:", error);
      toast({
        title: "Erro no login com Google",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAuthenticated, login, register, logout, isLoading, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
