
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Auth = () => {
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
