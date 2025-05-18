
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Comissao, 
  ComissaoStatus, 
  ComissaoTotais
} from "@/types/comissao.types";
import { filtrarComissoes } from "@/utils/comissao.helpers";
import { fetchComissoes } from "@/services/comissao.service";

// Core hook for managing comissoes state and basic calculations
export const useComissoesCore = () => {
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metaComissao, setMetaComissao] = useState<number>(0);
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1);
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const { user } = useAuth();
  const { toast } = useToast();

  // Load comissões data
  useEffect(() => {
    const loadComissoes = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await fetchComissoes(user.id);
        setComissoes(data);
      } catch (error) {
        console.error("Erro ao buscar comissões:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar comissões",
          description: "Não foi possível carregar as comissões.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadComissoes();
  }, [user, toast]);

  // Calculate commission totals
  const totais = useMemo(() => {
    const comissoesFiltradas = filtrarComissoes(comissoes, "todas", "", "todos");
    const totalComissoes = comissoesFiltradas.reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
    const totalPendente = comissoesFiltradas
      .filter(c => c.status === "Pendente")
      .reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
    const totalRecebido = comissoesFiltradas
      .filter(c => c.status === "Recebido")
      .reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
    const totalCount = comissoesFiltradas.length;
    const recebidoCount = comissoesFiltradas.filter(c => c.status === "Recebido").length;
    const pendenteCount = comissoesFiltradas.filter(c => c.status === "Pendente").length;
    const atingidoPercentual = metaComissao > 0 ? (totalRecebido / metaComissao) * 100 : 0;

    return {
      totalComissoes,
      totalPendente,
      totalRecebido,
      totalCount,
      recebidoCount,
      pendenteCount,
      atingidoPercentual
    };
  }, [comissoes, metaComissao]);

  // Period management
  const alterarPeriodoAtual = (mes: number, ano: number) => {
    setMesAtual(mes);
    setAnoAtual(ano);
  };

  return {
    comissoes,
    setComissoes,
    metaComissao,
    setMetaComissao,
    isLoading,
    mesAtual,
    anoAtual,
    alterarPeriodoAtual,
    totais,
    user,
    toast
  };
};
