
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Comissao, ComissaoStatus } from "@/types/comissao.types";
import { calcularTotais, filtrarComissoes } from "@/utils/comissao.helpers";
import { obterNomeMes } from "@/utils/comissao.utils";
import { exportarComissoesParaCSV } from "@/services/csv.service";
import { exportarComissoesParaPDF } from "@/services/pdf.service";
import { 
  fetchComissoes,
  adicionarComissao as addComissao,
  atualizarComissao as updateComissao,
  excluirComissao as deleteComissao,
  marcarComoPago as markAsPaid,
  getRecebimentosByComissaoId,
  adicionarRecebimento as addRecebimento
} from "@/services/comissao.service";
import {
  fetchMetaMensal,
  getMetaMensal,
  adicionarMetaMensal,
  atualizarMeta as updateMeta,
  getTotalRecebidoPorMesAno
} from "@/services/meta.service";

export { type ComissaoStatus, type StatusValor, type Comissao } from "@/types/comissao.types";

export const useComissoes = () => {
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

  // Load meta mensal
  useEffect(() => {
    if (!user) return;
    
    const loadMeta = async () => {
      const valor = await fetchMetaMensal(mesAtual, anoAtual, user.id);
      setMetaComissao(valor);
    };
    
    loadMeta();
  }, [mesAtual, anoAtual, user]);

  // Function to add a comissão
  const adicionarComissao = async (comissao: Omit<Comissao, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return null;

    const novaComissao = await addComissao(comissao, user.id, toast);
    if (novaComissao) {
      setComissoes([novaComissao, ...comissoes]);
    }
    return novaComissao;
  };

  // Function to update a comissão
  const atualizarComissao = async (id: string, comissaoAtualizada: Partial<Comissao>) => {
    if (!user) return false;

    const success = await updateComissao(id, comissaoAtualizada, user.id, toast);
    if (success) {
      setComissoes(
        comissoes.map((comissao) =>
          comissao.id === id ? { ...comissao, ...comissaoAtualizada, updatedAt: new Date().toISOString() } : comissao
        )
      );
    }
    return success;
  };

  // Function to mark a comissão as paid
  const marcarComoPago = async (id: string) => {
    if (!user) return false;

    const success = await markAsPaid(id, user.id, toast);
    if (success) {
      setComissoes(
        comissoes.map((comissao) =>
          comissao.id === id
            ? {
                ...comissao,
                status: "Recebido",
                dataPagamento: new Date().toISOString(),
              }
            : comissao
        )
      );
    }
    return success;
  };

  // Function to delete a comissão
  const excluirComissao = async (id: string) => {
    if (!user) return false;

    const success = await deleteComissao(id, user.id, toast);
    if (success) {
      setComissoes(comissoes.filter((comissao) => comissao.id !== id));
    }
    return success;
  };

  // Function to get comissão by ID
  const getComissaoById = (id: string) => {
    return comissoes.find((comissao) => comissao.id === id) || null;
  };

  // Function to get comissões by venda ID
  const getComissoesByVendaId = (vendaId: string) => {
    return comissoes.filter((comissao) => comissao.vendaId === vendaId);
  };

  // Function to get comissões by status
  const getComissoesByStatus = (status: ComissaoStatus) => {
    return comissoes.filter((comissao) => comissao.status === status);
  };

  // Function to export to CSV
  const exportarParaCSV = (comissoesParaExportar: Comissao[], filtros: any) => {
    exportarComissoesParaCSV(comissoesParaExportar, filtros, toast);
  };

  // Function to export to PDF
  const exportarParaPDF = (comissoesParaExportar: Comissao[], filtros: any) => {
    exportarComissoesParaPDF(comissoesParaExportar, calcularTotais, filtros, toast);
  };

  // Function to add a recebimento (payment receipt)
  const adicionarRecebimento = async (comissaoId: string, valor: number, data: string) => {
    return addRecebimento(comissaoId, valor, data, toast);
  };

  // Function to update meta
  const atualizarMeta = async (valor: number, mes: number, ano: number) => {
    if (!user) return false;

    const success = await updateMeta(valor, mes, ano, user.id, toast);
    if (success && mes === mesAtual && ano === anoAtual) {
      setMetaComissao(valor);
    }
    return success;
  };

  // Function to change current period
  const alterarPeriodoAtual = (mes: number, ano: number) => {
    setMesAtual(mes);
    setAnoAtual(ano);
  };

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

  return {
    comissoes,
    metaComissao,
    isLoading,
    adicionarComissao,
    atualizarComissao,
    marcarComoPago,
    excluirComissao,
    atualizarMeta,
    filtrarComissoes: (tab: string, filtro: string, periodo: string) => filtrarComissoes(comissoes, tab, filtro, periodo),
    totais,
    mesAtual,
    anoAtual,
    alterarPeriodoAtual,
    obterNomeMes,
    getRecebimentosByComissaoId,
    adicionarRecebimento,
    calcularTotais: (comissoes: Comissao[]) => calcularTotais(comissoes),
    exportarParaCSV,
    exportarParaPDF,
    getMetaMensal,
    getTotalRecebidoPorMesAno,
    getComissaoById,
    getComissoesByVendaId,
    getComissoesByStatus
  };
};
