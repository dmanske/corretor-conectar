export interface MetaAnual {
  id: string;
  ano: number;
  valor: number;
  createdAt: string;
  updatedAt: string;
}

export interface MetaAnualCreate {
  ano: number;
  valor: number;
}

export interface MetaAnualUpdate {
  valor: number;
} 