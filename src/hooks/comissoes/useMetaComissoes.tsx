
import { useEffect, useState } from "react";
import {
  fetchMetaMensal,
  fetchMetaAnual,
  fetchMetasDoAno,
  atualizarMeta,
  atualizarMetaAnual,
  getMetaMensal as getMeta,
  getTotalRecebidoPorMesAno as getTotalPorMesAno,
  getTotalRecebidoPorAno,
  getRecebimentosPorMesAno,
  getValoresAReceberPorMesAno
} from "@/services/meta.service";

// Hook for managing metas
export const useMetaComissoes = (
  userId: string | undefined,
  mesAtual: number,
  anoAtual: number,
  setMetaComissao: React.Dispatch<React.SetStateAction<number>>,
  toast: any,
  comissoes: any[] = []
) => {
  const [metaAnual, setMetaAnual] = useState<number>(0);
  const [metasDoAno, setMetasDoAno] = useState<any[]>([]);
  const [recebimentosPorMes, setRecebimentosPorMes] = useState<{[mes: number]: number}>({});
  const [aReceberPorMes, setAReceberPorMes] = useState<{[mes: number]: number}>({});
  
  // Load meta mensal
  useEffect(() => {
    if (!userId) return;
    
    const loadMeta = async () => {
      const valor = await fetchMetaMensal(mesAtual, anoAtual, userId);
      setMetaComissao(valor);
    };
    
    loadMeta();
  }, [mesAtual, anoAtual, userId, setMetaComissao]);

  // Load meta anual
  useEffect(() => {
    if (!userId) return;
    
    const loadMetaAnual = async () => {
      const valor = await fetchMetaAnual(anoAtual, userId);
      setMetaAnual(valor);
      
      // Buscar todas as metas do ano
      const metas = await fetchMetasDoAno(anoAtual, userId);
      setMetasDoAno(metas);
      
      // Buscar recebimentos por mês
      const recebimentos = await getRecebimentosPorMesAno(anoAtual);
      setRecebimentosPorMes(recebimentos);
      
      // Buscar valores a receber por mês
      const aReceber = await getValoresAReceberPorMesAno(anoAtual, comissoes);
      setAReceberPorMes(aReceber);
    };
    
    loadMetaAnual();
  }, [anoAtual, userId, comissoes]);

  // Function to update meta
  const atualizarMetaMensal = async (valor: number, mes: number, ano: number) => {
    if (!userId) return false;

    const success = await atualizarMeta(valor, mes, ano, userId, toast);
    if (success && mes === mesAtual && ano === anoAtual) {
      setMetaComissao(valor);
    }
    return success;
  };
  
  // Function to update meta anual
  const atualizarMetaAnualFunc = async (valor: number, ano: number) => {
    if (!userId) return false;

    const success = await atualizarMetaAnual(valor, ano, userId, toast);
    if (success && ano === anoAtual) {
      setMetaAnual(valor);
    }
    return success;
  };

  // Function to get meta mensal - fixing the parameter issue
  const getMetaMensal = async (mes: number, ano: number) => {
    // The meta.service getMeta function only expects mes and ano, not userId
    return await getMeta(mes, ano);
  };

  // Function to get total received by month/year
  const getTotalRecebidoPorMesAno = async (mes: number, ano: number) => {
    return await getTotalPorMesAno(mes, ano);
  };
  
  // Function to get total received in a year
  const buscarTotalRecebidoAno = async (ano: number) => {
    return await getTotalRecebidoPorAno(ano);
  };

  return {
    atualizarMeta: atualizarMetaMensal,
    atualizarMetaAnual: atualizarMetaAnualFunc,
    getMetaMensal,
    getTotalRecebidoPorMesAno,
    buscarTotalRecebidoAno,
    metaAnual,
    metasDoAno,
    recebimentosPorMes,
    aReceberPorMes
  };
};
