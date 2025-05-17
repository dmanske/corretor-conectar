
import { useState, useEffect } from "react";
import { useClientes } from "./useClientes";
import { useVendas } from "./useVendas";
import { useComissoes } from "./useComissoes";
import { DashboardData } from "@/types";

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { clientes, getAniversariantes } = useClientes();
  const { vendas, getDashboardData: getVendasData } = useVendas();
  const { comissoes } = useComissoes();
  
  useEffect(() => {
    // When all data has loaded, build dashboard data
    if (clientes.length >= 0 && vendas.length >= 0 && comissoes.length >= 0) {
      const { aniversariantesSemana, aniversariantesMes } = getAniversariantes();
      const { totalVendas, valorTotalVendas, vendasRecentes } = getVendasData();
      
      const data: DashboardData = {
        aniversariantesSemana,
        aniversariantesMes,
        vendasRecentes,
        totalClientes: clientes.length,
        totalVendas,
        valorTotalVendas
      };
      
      setDashboardData(data);
      setIsLoading(false);
    }
  }, [clientes, vendas, comissoes]);

  return {
    dashboardData,
    isLoading
  };
};

export default useDashboardData;
