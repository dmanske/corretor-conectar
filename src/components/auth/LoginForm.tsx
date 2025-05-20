import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { Loader2, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import ForgotPasswordForm from "./ForgotPasswordForm";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = ({ onSwitchToRegister }: { onSwitchToRegister?: () => void }) => {
  const { login, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Não vamos resetar o estado isGoogleLoading porque o usuário será redirecionado
      // para a página de autenticação do Google
    } catch (error) {
      setIsGoogleLoading(false);
      console.error("Error initiating Google login:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const switchToRegister = () => {
    // Busca o botão da aba de cadastro pelo texto
    const tabs = document.querySelectorAll('[role="tab"]');
    tabs.forEach(tab => {
      if (tab.textContent?.toLowerCase().includes('cadastrar')) {
        (tab as HTMLElement).click();
      }
    });
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Entrar</h2>
        <p className="text-sm text-gray-600 mt-1">Entre com suas credenciais para acessar</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <FormControl>
                    <Input 
                      placeholder="seu@email.com" 
                      className="pl-10" 
                      {...field} 
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Senha</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <FormControl>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••" 
                      className="pl-10" 
                      {...field} 
                    />
                  </FormControl>
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              onClick={() => setShowForgotPassword(true)}
            >
              Esqueceu a senha?
            </button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">ou continue com</span>
        </div>
      </div>
      
      <Button
        variant="outline"
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="w-full flex items-center justify-center gap-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-100 font-medium"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FcGoogle size={20} />
        )}
        {isGoogleLoading ? "Redirecionando..." : "Entrar com Google"}
      </Button>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Não possui uma conta?{" "}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            onClick={onSwitchToRegister}
            tabIndex={0}
          >
            Cadastre-se
          </button>
        </p>
      </div>
      
      {showForgotPassword && (
        <ForgotPasswordForm onCancel={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default LoginForm;
