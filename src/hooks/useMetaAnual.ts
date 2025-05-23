import { useState, useEffect } from "react";
import { MetaAnual } from "@/types/meta-anual.types";
import { metaAnualService } from "@/services/meta-anual.service";

export const useMetaAnual = (ano: number) => {
  const [metaAnual, setMetaAnual] = useState<MetaAnual | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetaAnual = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await metaAnualService.getByAno(ano);
      setMetaAnual(data);
    } catch (err) {
      setError("Erro ao carregar meta anual");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMetaAnual = async (valor: number) => {
    try {
      setIsLoading(true);
      setError(null);

      if (metaAnual) {
        const updated = await metaAnualService.update(metaAnual.id, { valor });
        if (updated) {
          setMetaAnual(updated);
        }
      } else {
        const created = await metaAnualService.create({ ano, valor });
        if (created) {
          setMetaAnual(created);
        }
      }
    } catch (err) {
      setError("Erro ao atualizar meta anual");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetaAnual();
  }, [ano]);

  return {
    metaAnual,
    isLoading,
    error,
    updateMetaAnual,
    refreshMetaAnual: fetchMetaAnual,
  };
}; 