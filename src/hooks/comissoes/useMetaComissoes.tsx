
import { useEffect } from "react";
import {
  fetchMetaMensal,
  atualizarMeta as updateMeta,
  getMetaMensal as getMeta,
  getTotalRecebidoPorMesAno as getTotalPorMesAno
} from "@/services/meta.service";

// Hook for managing metas
export const useMetaComissoes = (
  userId: string | undefined,
  mesAtual: number,
  anoAtual: number,
  setMetaComissao: React.Dispatch<React.SetStateAction<number>>,
  toast: any
) => {
  // Load meta mensal
  useEffect(() => {
    if (!userId) return;
    
    const loadMeta = async () => {
      const valor = await fetchMetaMensal(mesAtual, anoAtual, userId);
      setMetaComissao(valor);
    };
    
    loadMeta();
  }, [mesAtual, anoAtual, userId, setMetaComissao]);

  // Function to update meta
  const atualizarMeta = async (valor: number, mes: number, ano: number) => {
    if (!userId) return false;

    const success = await updateMeta(valor, mes, ano, userId, toast);
    if (success && mes === mesAtual && ano === anoAtual) {
      setMetaComissao(valor);
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

  return {
    atualizarMeta,
    getMetaMensal,
    getTotalRecebidoPorMesAno
  };
};
