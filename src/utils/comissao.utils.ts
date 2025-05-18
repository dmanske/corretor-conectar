
/**
 * Função para formatar valores monetários para exibição no PDF
 */
export const formatarMoedaParaPDF = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL', 
    minimumFractionDigits: 2 
  });
};

/**
 * Função para formatar datas para exibição no PDF
 */
export const formatarDataParaPDF = (dataString: string | null | undefined): string => {
  if (!dataString) return "N/A";
  try {
    return new Date(dataString).toLocaleDateString('pt-BR');
  } catch {
    return "Data inválida";
  }
};

/**
 * Função para obter o nome do mês a partir do número
 */
export const obterNomeMes = (mes: number): string => {
  const nomesDosMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return nomesDosMeses[mes - 1] || "";
};

/**
 * Função para escapar campos CSV
 */
export const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return '';
  let str = String(value);
  if (str.includes('"')) str = str.replace(/"/g, '""');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    str = '"' + str + '"';
  }
  return str;
};

/**
 * Calcula dias entre duas datas
 */
export const calcularDiasEntreDatas = (data1: string | null, data2: string | null): number => {
  if (!data1 || !data2) return 0;
  
  try {
    const d1 = new Date(data1);
    const d2 = new Date(data2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return 0;
  }
};

/**
 * Calcula dias em atraso
 */
export const calcularDiasEmAtraso = (dataVencimento: string | null): number => {
  if (!dataVencimento) return 0;
  
  try {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    
    if (hoje <= vencimento) return 0;
    
    const diffTime = Math.abs(hoje.getTime() - vencimento.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return 0;
  }
};

/**
 * Formata valores de porcentagem
 */
export const formatarPorcentagem = (valor: number, casasDecimais: number = 1): string => {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  }) + '%';
};

/**
 * Calcula a data estimada de pagamento baseada na data da venda
 */
export const calcularDataEstimadaPagamento = (dataVenda: string | null): string | null => {
  if (!dataVenda) return null;
  
  try {
    // Adiciona 30 dias à data da venda como estimativa
    const data = new Date(dataVenda);
    data.setDate(data.getDate() + 30);
    return data.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  } catch {
    return null;
  }
};
