
import { Comissao, ComissaoStatus } from "@/types/comissao.types";
import { filtrarComissoes } from "@/utils/comissao.helpers";

// Hook for querying and filtering comissoes
export const useQueryComissoes = (comissoes: Comissao[]) => {
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

  // Function to filter comissões
  const filterComissoes = (tab: string, filtro: string, periodo: string, dataInicio?: string, dataFim?: string) => 
    filtrarComissoes(comissoes, tab, filtro, periodo, dataInicio, dataFim);

  return {
    getComissaoById,
    getComissoesByVendaId,
    getComissoesByStatus,
    filtrarComissoes: filterComissoes
  };
};
