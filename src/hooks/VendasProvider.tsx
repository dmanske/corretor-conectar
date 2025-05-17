import React, { createContext, useContext } from "react";
import useVendasHook from "./useVendas";

const VendasContext = createContext(null);

export const VendasProvider = ({ children }: { children: React.ReactNode }) => {
  const vendasHook = useVendasHook();
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