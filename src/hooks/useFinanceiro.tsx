
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { TransacaoFinanceira } from "@/types";
import { useComissoes } from "./useComissoes";

export const useFinanceiro = () => {
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { comissoes } = useComissoes();
  
  // Since we don't have a transacoes table yet, we'll derive them from comissoes
  useEffect(() => {
    if (comissoes.length >= 0) {
      // Create financial transactions from commissions
      const transacoesDeComissoes = comissoes
        .filter(comissao => comissao.status === "Recebido" && comissao.dataPagamento)
        .map((comissao): TransacaoFinanceira => ({
          id: `com-${comissao.id}`,
          tipo: "Entrada",
          descricao: `Comissão - ${comissao.imovel}`,
          valor: comissao.valorComissaoCorretor,
          data: comissao.dataPagamento || comissao.dataVenda,
          formaPagamento: "PIX",
          comissaoId: comissao.id,
          clienteId: undefined,
          createdAt: comissao.dataVenda,
          updatedAt: comissao.dataPagamento || comissao.dataVenda
        }));
      
      setTransacoes(transacoesDeComissoes);
      setIsLoading(false);
    }
  }, [comissoes]);

  // Dummy method for generating a fake expense - in a real app, you'd save this to a real table
  const adicionarDespesa = (despesa: {
    descricao: string;
    valor: number;
    data: string;
    formaPagamento: "Dinheiro" | "PIX" | "Cartão" | "Cheque";
  }) => {
    const novaDespesa: TransacaoFinanceira = {
      id: `desp-${Date.now()}`,
      tipo: "Saída",
      descricao: despesa.descricao,
      valor: despesa.valor,
      data: despesa.data,
      formaPagamento: despesa.formaPagamento,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTransacoes([novaDespesa, ...transacoes]);
    return novaDespesa;
  };

  const filtrarTransacoes = (
    tipo: string,
    termo: string,
    periodo: string
  ) => {
    return transacoes.filter(transacao => {
      // Filtro por tipo
      if (tipo !== "todos" && transacao.tipo !== tipo) return false;
      
      // Filtro por termo de busca
      if (
        termo && 
        !transacao.descricao.toLowerCase().includes(termo.toLowerCase())
      ) {
        return false;
      }
      
      // Filtro por período (em uma implementação real, verificaria datas)
      if (periodo !== "todos") {
        const data = new Date(transacao.data);
        const hoje = new Date();
        
        if (periodo === "7dias") {
          const seteDiasAtras = new Date();
          seteDiasAtras.setDate(hoje.getDate() - 7);
          if (data < seteDiasAtras) return false;
        } else if (periodo === "30dias") {
          const trintaDiasAtras = new Date();
          trintaDiasAtras.setDate(hoje.getDate() - 30);
          if (data < trintaDiasAtras) return false;
        } else if (periodo === "90dias") {
          const noventaDiasAtras = new Date();
          noventaDiasAtras.setDate(hoje.getDate() - 90);
          if (data < noventaDiasAtras) return false;
        }
      }
      
      return true;
    });
  };

  const calcularTotais = () => {
    const totalEntradas = transacoes
      .filter(t => t.tipo === "Entrada")
      .reduce((acc, t) => acc + t.valor, 0);
      
    const totalSaidas = transacoes
      .filter(t => t.tipo === "Saída")
      .reduce((acc, t) => acc + t.valor, 0);
      
    const saldoTotal = totalEntradas - totalSaidas;
    
    return { totalEntradas, totalSaidas, saldoTotal };
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return {
    transacoes,
    isLoading,
    adicionarDespesa,
    filtrarTransacoes,
    calcularTotais,
    formatarMoeda
  };
};

export default useFinanceiro;
