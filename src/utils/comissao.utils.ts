
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
