
import { Comissao, ComissaoTotais } from "@/types/comissao.types";

export const filtrarComissoes = (comissoes: Comissao[], tab: string, filtro: string, periodo: string, dataInicio?: string, dataFim?: string) => {
  let comissoesFiltradas = [...comissoes];

  // Filtra por status (tab)
  if (tab !== "todas") {
    comissoesFiltradas = comissoesFiltradas.filter(
      (comissao) => comissao.status === tab
    );
  }

  // Filtra por texto (filtro)
  if (filtro) {
    const filtroLower = filtro.toLowerCase();
    comissoesFiltradas = comissoesFiltradas.filter(
      (comissao) =>
        comissao.cliente.toLowerCase().includes(filtroLower) ||
        comissao.imovel.toLowerCase().includes(filtroLower)
    );
  }

  // Filtra por período
  if (periodo && periodo !== "todos") {
    const hoje = new Date();
    
    if (periodo === "mes") {
      // Mês atual
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      
      comissoesFiltradas = comissoesFiltradas.filter((comissao) => {
        const dataVenda = new Date(comissao.dataVenda);
        return dataVenda >= inicioMes && dataVenda <= fimMes;
      });
    } 
    else if (periodo === "trimestre") {
      // Trimestre atual
      const trimAtual = Math.floor(hoje.getMonth() / 3);
      const inicioTrimestre = new Date(hoje.getFullYear(), trimAtual * 3, 1);
      const fimTrimestre = new Date(hoje.getFullYear(), trimAtual * 3 + 3, 0);
      
      comissoesFiltradas = comissoesFiltradas.filter((comissao) => {
        const dataVenda = new Date(comissao.dataVenda);
        return dataVenda >= inicioTrimestre && dataVenda <= fimTrimestre;
      });
    } 
    else if (periodo === "ano") {
      // Ano atual
      const inicioAno = new Date(hoje.getFullYear(), 0, 1);
      const fimAno = new Date(hoje.getFullYear(), 11, 31);
      
      comissoesFiltradas = comissoesFiltradas.filter((comissao) => {
        const dataVenda = new Date(comissao.dataVenda);
        return dataVenda >= inicioAno && dataVenda <= fimAno;
      });
    } 
    else if (periodo === "personalizado" && dataInicio && dataFim) {
      // Período personalizado
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      // Ajustar fim para incluir todo o dia final
      fim.setHours(23, 59, 59, 999);
      
      comissoesFiltradas = comissoesFiltradas.filter((comissao) => {
        const dataVenda = new Date(comissao.dataVenda);
        return dataVenda >= inicio && dataVenda <= fim;
      });
    }
  }

  return comissoesFiltradas;
};

export const calcularTotais = (comissoesFiltradas: Comissao[]): ComissaoTotais => {
  const total = comissoesFiltradas.reduce((acc, comissao) => acc + (comissao.valorComissaoCorretor || 0), 0);
  const recebido = comissoesFiltradas
    .filter(c => c.status === "Recebido")
    .reduce((acc, comissao) => acc + (comissao.valorComissaoCorretor || 0), 0);
  const pendente = comissoesFiltradas
    .filter(c => c.status === "Pendente")
    .reduce((acc, comissao) => acc + (comissao.valorComissaoCorretor || 0), 0);
  const parcial = comissoesFiltradas
    .filter(c => c.status === "Parcial")
    .reduce((acc, comissao) => {
      return acc + (comissao.valorComissaoCorretor || 0) / 2;
    }, 0);
  
  // Add these properties needed by Relatorios.tsx
  const totalComissoes = total;
  const totalRecebido = recebido;
  const totalPendente = pendente;
  const recebidoCount = comissoesFiltradas.filter(c => c.status === "Recebido").length;
  const pendenteCount = comissoesFiltradas.filter(c => c.status === "Pendente").length;
  const metaComissao = 0; // This is a placeholder - the actual value comes from component state
  const atingidoPercentual = 0; // Placeholder - calculated in the component

  return { 
    total, 
    recebido, 
    pendente, 
    parcial, 
    totalComissoes,
    totalRecebido,
    totalPendente,
    recebidoCount,
    pendenteCount,
    metaComissao,
    atingidoPercentual
  };
};
