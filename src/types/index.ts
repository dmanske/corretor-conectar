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
  dataVenda: string;
  valor: number;
  tipoImovel: string;
  enderecoImovel: string;
  observacoes?: string;
  comissao: number;
  corretor: string;
  createdAt?: string;
  updatedAt?: string;
}
