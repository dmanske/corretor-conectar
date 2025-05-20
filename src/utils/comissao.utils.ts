
export const obterNomeMes = (mes: number) => {
  const meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro'
  ];
  
  // Ajusta o índice para 0-11
  const indiceMes = mes - 1;
  
  if (indiceMes >= 0 && indiceMes < meses.length) {
    return meses[indiceMes];
  }
  
  // Para meta anual, onde mes=0
  if (mes === 0) {
    return 'anual';
  }
  
  return '';
};

/**
 * Formata uma data para exibição em PDF no formato dd/mm/yyyy
 * @param data - String de data ou objeto Date
 */
export const formatarDataParaPDF = (data: string | Date | undefined): string => {
  if (!data) return '-';
  
  try {
    const dataObj = typeof data === 'string' ? new Date(data) : data;
    
    // Verificar se a data é válida
    if (isNaN(dataObj.getTime())) return '-';
    
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '-';
  }
};

/**
 * Formata um valor monetário para exibição em PDF no formato R$ X.XXX,XX
 * @param valor - Valor numérico
 */
export const formatarMoedaParaPDF = (valor: number | undefined): string => {
  if (valor === undefined || valor === null) return 'R$ 0,00';
  
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  } catch (error) {
    console.error('Erro ao formatar moeda:', error);
    return 'R$ 0,00';
  }
};

/**
 * Escapa caracteres especiais em strings para CSV
 * @param value - Valor para escapar
 */
export const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // Se contém vírgula, aspas duplas ou quebra de linha, envolve em aspas
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Substitui aspas duplas por duas aspas duplas
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};
