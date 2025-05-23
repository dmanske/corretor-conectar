export interface Cliente {
  id: string;
  nome: string;
  endereco: string;
  complemento: string;
  numero: string;
  telefone: string;
  cidade: string;
  estado: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  observacoes: string;
  cep: string;
  createdAt: string;
  updatedAt: string;
  isPremium?: boolean;
}

export interface Venda {
  id: string;
  clienteId: string;
  clienteNome?: string; // Added as optional since it's used in many components
  dataVenda: string;
  valor: number;
  tipoImovel: string;
  endereco: string; // Used instead of enderecoImovel in multiple components
  enderecoImovel?: string; // Keep for backwards compatibility
  observacoes?: string;
  comissao?: number; // From original type
  corretor?: string; // From original type
  comissao_imobiliaria?: number; // Used in multiple components
  comissao_corretor?: number; // Used in multiple components
  createdAt?: string;
  updatedAt?: string;
  notaFiscal?: string; // Adicionado para permitir salvar o número da nota fiscal
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
