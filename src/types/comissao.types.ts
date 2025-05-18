
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

export interface ComissaoRecebimento {
  id: string;
  comissao_id: string;
  valor: number;
  data: string;
}

export interface ParcelasPendentes {
  comissaoId: string;
  cliente: string;
  imovel: string;
  valorTotal: number;
  valorPago: number;
  valorPendente: number;
  dataVenda: string;
  dataUltimoPagamento: string | null;
  proximoVencimento: string | null;
  diasEmAtraso: number;
}

export interface CsvExportOptions {
  incluirCliente?: boolean;
  incluirImovel?: boolean;
  incluirValorVenda?: boolean;
  incluirValorComissao?: boolean;
  incluirDataVenda?: boolean;
  incluirDataPagamento?: boolean;
  incluirStatus?: boolean;
  periodo?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface PdfExportOptions extends CsvExportOptions {
  tema?: 'roxo' | 'azul' | 'verde';
  incluirParcelasPendentes?: boolean;
  incluirResumoFinanceiro?: boolean;
  incluirGrafico?: boolean;
}
