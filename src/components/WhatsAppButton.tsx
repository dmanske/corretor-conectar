import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  telefone: string;
  mensagem?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const WhatsAppButton = ({
  telefone,
  mensagem = "Olá! Estou entrando em contato através do sistema Corretor Conecta.",
  className,
  variant = "default",
  size = "default"
}: WhatsAppButtonProps) => {
  const formatarNumero = (numero: string) => {
    // Remove caracteres não numéricos
    const numerosApenas = numero.replace(/\D/g, '');
    
    // Se o número não começar com 55 (código do Brasil), adiciona
    const numeroCompleto = numerosApenas.startsWith('55') 
      ? numerosApenas 
      : `55${numerosApenas}`;
      
    return numeroCompleto;
  };
  
  const handleClick = () => {
    const numeroFormatado = formatarNumero(telefone);
    const mensagemCodificada = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numeroFormatado}?text=${mensagemCodificada}`;
    window.open(url, '_blank');
  };
  
  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 ${className}`}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
