
import React, { createContext, useContext } from "react";
import { useVendas } from "./useVendas";

// Importante: Definir o tipo correto para o contexto
type VendasContextType = ReturnType<typeof useVendas>;

// Inicialize o contexto com um valor padrão em vez de null
const defaultContextValue: VendasContextType = {
  vendas: [],
  isLoading: true,
  adicionarVenda: async () => null,
  excluirVenda: async () => false,
  atualizarVenda: async () => false,
  getVendaById: () => null,
  getVendasByClienteId: () => [],
  formatarMoeda: () => '',
  formatarData: () => '',
  getDashboardData: () => ({ totalVendas: 0, valorTotalVendas: 0, vendasRecentes: [] })
};

const VendasContext = createContext<VendasContextType>(defaultContextValue);

export const VendasProvider = ({ children }: { children: React.ReactNode }) => {
  // Use o hook dentro do componente funcional
  const vendasHook = useVendas();
  
  return (
    <VendasContext.Provider value={vendasHook}>
      {children}
    </VendasContext.Provider>
  );
};

export const useVendasContext = () => {
  const ctx = useContext(VendasContext);
  return ctx;
}; 
