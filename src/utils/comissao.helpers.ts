
import { Comissao, ComissaoTotais } from "@/types/comissao.types";

export const filtrarComissoes = (comissoes: Comissao[], tab: string, filtro: string, periodo: string) => {
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
  if (periodo !== "todos") {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    comissoesFiltradas = comissoesFiltradas.filter((comissao) => {
      const dataVenda = new Date(comissao.dataVenda);
      return dataVenda >= inicioMes && dataVenda <= fimMes;
    });
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
