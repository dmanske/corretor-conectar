
export type ComissaoStatus = "Pendente" | "Parcial" | "Recebido";
export type StatusValor = "Atualizado" | "Desatualizado" | "Justificado";

export interface Comissao {
  id: string;
  vendaId: string;
  cliente: string;
  imovel: string;
  valorVenda: number;
  valorComissaoImobiliaria: number;
  valorComissaoCorretor: number;
  dataContrato: string;
  dataVenda: string;
  dataPagamento: string | null;
  status: ComissaoStatus;
  // Campos adicionais para conformidade com o banco de dados
  valorOriginalVenda?: number;
  valorAtualVenda?: number;
  diferencaValor?: number;
  statusValor?: StatusValor;
  justificativa?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComissaoTotais {
  total: number;
  recebido: number;
  pendente: number;
  parcial: number;
  totalComissoes: number;
  totalRecebido: number;
  totalPendente: number;
  recebidoCount: number;
  pendenteCount: number;
  metaComissao: number;
  atingidoPercentual: number;
}
