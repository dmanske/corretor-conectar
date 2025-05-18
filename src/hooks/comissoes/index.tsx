
import { obterNomeMes } from "@/utils/comissao.utils";
import { useComissoesCore } from "./useComissoesCore";
import { useCrudComissoes } from "./useCrudComissoes";
import { useQueryComissoes } from "./useQueryComissoes";
import { useMetaComissoes } from "./useMetaComissoes";
import { useParcelasComissoes } from "./useParcelasComissoes";
import { useExportComissoes } from "./useExportComissoes";
import { 
  Comissao,
  ComissaoStatus,
  StatusValor
} from "@/types/comissao.types";

// Export the types that are used by other components
export type { Comissao, ComissaoStatus, StatusValor };

// The main hook that combines all the smaller hooks
export const useComissoes = () => {
  const core = useComissoesCore();
  const { 
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
  } = core;

  const { 
    adicionarComissao, 
    atualizarComissao, 
    marcarComoPago, 
    excluirComissao 
  } = useCrudComissoes(comissoes, setComissoes, user?.id, toast);

  const { 
    getComissaoById, 
    getComissoesByVendaId, 
    getComissoesByStatus, 
    filtrarComissoes 
  } = useQueryComissoes(comissoes);

  const { 
    atualizarMeta, 
    getMetaMensal, 
    getTotalRecebidoPorMesAno 
  } = useMetaComissoes(user?.id, mesAtual, anoAtual, setMetaComissao, toast);

  const { 
    parcelasPendentes, 
    isLoadingParcelas,
    getRecebimentosByComissaoId, 
    adicionarRecebimento 
  } = useParcelasComissoes(user?.id, comissoes, toast);

  const { 
    exportarParaCSV, 
    exportarParaExcel, 
    exportarParaPDF, 
    calcularTotais 
  } = useExportComissoes(toast, parcelasPendentes);

  // Return all the functionality from the smaller hooks
  return {
    // State
    comissoes,
    parcelasPendentes,
    metaComissao,
    isLoading,
    isLoadingParcelas,
    mesAtual,
    anoAtual,

    // CRUD operations
    adicionarComissao,
    atualizarComissao,
    marcarComoPago,
    excluirComissao,
    
    // Queries and filters
    filtrarComissoes,
    getComissaoById,
    getComissoesByVendaId,
    getComissoesByStatus,
    
    // Meta management
    atualizarMeta,
    getMetaMensal,
    alterarPeriodoAtual,
    getTotalRecebidoPorMesAno,
    
    // Calculations and utils
    totais,
    obterNomeMes,
    calcularTotais,
    
    // Parcelas and recebimentos
    getRecebimentosByComissaoId,
    adicionarRecebimento,
    
    // Export functions
    exportarParaCSV,
    exportarParaExcel,
    exportarParaPDF,
  };
};
