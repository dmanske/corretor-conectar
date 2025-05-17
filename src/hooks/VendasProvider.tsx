
import React, { createContext, useContext } from "react";
import { useVendas } from "./useVendas";

// Importante: Definir o tipo correto para o contexto
type VendasContextType = ReturnType<typeof useVendas> | null;

// Inicialize o contexto com null
const VendasContext = createContext<VendasContextType>(null);

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
  if (!ctx) throw new Error("useVendasContext deve ser usado dentro de <VendasProvider>");
  return ctx;
}; 
