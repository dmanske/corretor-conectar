
import { useState, useEffect } from "react";
import { ParcelasPendentes, ComissaoRecebimento } from "@/types/comissao.types";
import { 
  getParcelasPendentes,
  getRecebimentosByComissaoId,
  adicionarRecebimento as addRecebimento
} from "@/services/comissao.service";

// Hook for managing parcelas and recebimentos
export const useParcelasComissoes = (
  userId: string | undefined,
  comissoes: any[],
  toast: any
) => {
  const [parcelasPendentes, setParcelasPendentes] = useState<ParcelasPendentes[]>([]);
  const [isLoadingParcelas, setIsLoadingParcelas] = useState(false);

  // Load parcelas pendentes
  useEffect(() => {
    const loadParcelasPendentes = async () => {
      if (!userId) return;
      
      try {
        setIsLoadingParcelas(true);
        const parcelas = await getParcelasPendentes(userId);
        setParcelasPendentes(parcelas);
      } catch (error) {
        console.error("Erro ao buscar parcelas pendentes:", error);
      } finally {
        setIsLoadingParcelas(false);
      }
    };
    
    loadParcelasPendentes();
  }, [userId, comissoes]);

  // Function to get recebimentos by comissão ID
  const getRecebimentos = async (comissaoId: string) => {
    return await getRecebimentosByComissaoId(comissaoId);
  };

  // Function to add a recebimento
  const adicionarRecebimento = async (comissaoId: string, valor: number, data: string) => {
    if (!userId) return false;
    return await addRecebimento(comissaoId, valor, data, toast);
  };

  return {
    parcelasPendentes,
    isLoadingParcelas,
    getRecebimentosByComissaoId: getRecebimentos,
    adicionarRecebimento
  };
};
