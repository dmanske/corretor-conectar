
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Formatadores para exibir valores
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
};

export const formatarData = (data: string): string => {
  try {
    return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR });
  } catch (e) {
    return data || "";
  }
};

export const formatarTelefone = (telefone: string): string => {
  if (!telefone) return "";
  if (telefone.length === 11) {
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
  }
  return telefone;
};
