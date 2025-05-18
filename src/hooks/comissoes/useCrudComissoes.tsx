
import { useToast } from "@/hooks/use-toast";
import { 
  Comissao,
  ComissaoStatus
} from "@/types/comissao.types";
import {
  adicionarComissao as addComissao,
  atualizarComissao as updateComissao,
  excluirComissao as deleteComissao,
  marcarComoPago as markAsPaid
} from "@/services/comissao.service";

// Hook for CRUD operations on comissoes
export const useCrudComissoes = (
  comissoes: Comissao[], 
  setComissoes: React.Dispatch<React.SetStateAction<Comissao[]>>,
  userId: string | undefined,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  // Function to add a comissão
  const adicionarComissao = async (comissao: Omit<Comissao, "id" | "createdAt" | "updatedAt">) => {
    if (!userId) return null;

    const novaComissao = await addComissao(comissao, userId, toast);
    if (novaComissao) {
      setComissoes([novaComissao, ...comissoes]);
    }
    return novaComissao;
  };

  // Function to update a comissão
  const atualizarComissao = async (id: string, comissaoAtualizada: Partial<Comissao>) => {
    if (!userId) return false;

    const success = await updateComissao(id, comissaoAtualizada, userId, toast);
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
    if (!userId) return false;

    const success = await markAsPaid(id, userId, toast);
    if (success) {
      setComissoes(
        comissoes.map((comissao) =>
          comissao.id === id
            ? {
                ...comissao,
                status: "Recebido" as ComissaoStatus,
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
    if (!userId) return false;

    const success = await deleteComissao(id, userId, toast);
    if (success) {
      setComissoes(comissoes.filter((comissao) => comissao.id !== id));
    }
    return success;
  };

  return {
    adicionarComissao,
    atualizarComissao,
    marcarComoPago,
    excluirComissao
  };
};
