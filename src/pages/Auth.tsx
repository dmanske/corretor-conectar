
import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./Landing";

const Auth = () => {
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgotPassword">("login");
  const { isAuthenticated, isLoading } = useAuth();

  // If authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  // Display landing page with login form in a modal
  return <Landing />;
};

export default Auth;
