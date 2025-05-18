export interface Cliente {
  id: string;
  nome: string;
  endereco: string;
  complemento?: string;
  telefone: string;
  cidade: string;
  estado: string;
  cpf: string;
  dataNascimento: string; // Formato ISO "YYYY-MM-DD"
  email: string;
  observacoes?: string;
  cep?: string;
  createdAt: string;
  updatedAt: string;
  status?: "Ativo" | "Inativo";
}

export interface Venda {
  id: string;
  clienteId: string;
  clienteNome: string;
  tipoImovel: string;
  endereco: string;
  valor: number;
  dataVenda: string; // Formato ISO "YYYY-MM-DD"
  comissao_imobiliaria?: number;
  comissao_corretor?: number;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Aniversariante {
  id: string;
  nome: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  diasAte: number;
}

export interface VendasRecentes {
  id: string;
  clienteNome: string;
  tipoImovel: string;
  valor: number;
  dataVenda: string;
}

export interface DashboardData {
  aniversariantesSemana: Aniversariante[];
  aniversariantesMes: Aniversariante[];
  vendasRecentes: VendasRecentes[];
  totalClientes: number;
  totalVendas: number;
  valorTotalVendas: number;
}

export interface Comissao {
  id: string;
  vendaId: string;
  clienteNome: string;
  valor: number;
  percentual: number;
  status: "Recebido" | "Pendente" | "Parcial";
  dataRecebimentoPrevista: string;
  dataRecebimento?: string;
  formaPagamento?: "Dinheiro" | "PIX" | "Cartão" | "Cheque";
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransacaoFinanceira {
  id: string;
  tipo: "Entrada" | "Saída";
  descricao: string;
  valor: number;
  data: string;
  formaPagamento: "Dinheiro" | "PIX" | "Cartão" | "Cheque";
  comissaoId?: string;
  vendaId?: string;
  clienteId?: string;
  comprovante?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  id: string;
  nome: string;
  valor: number;
  progresso: number;
  dataInicio: string;
  dataFim: string;
  tipo: "Mensal" | "Trimestral" | "Anual";
  createdAt: string;
  updatedAt: string;
}
