
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
