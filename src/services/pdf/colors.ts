
// Define color schemes for PDF exports
export const getPdfColors = (tema: string = 'roxo') => {
  const temas = {
    roxo: {
      primary: '#8B5CF6',      // Roxo vibrante
      secondary: '#C4B5FD',    // Roxo suave
      success: '#10B981',      // Verde sucesso
      warning: '#FBBF24',      // Amarelo alerta
      danger: '#EF4444',       // Vermelho perigo
      text: '#1F2937',         // Texto escuro
      textLight: '#6B7280',    // Texto cinza
      background: '#FFFFFF',   // Fundo branco
      headerBg: '#F9FAFB',     // Fundo do cabeçalho
      border: '#E5E7EB'        // Bordas
    },
    azul: {
      primary: '#3B82F6',      // Azul vibrante
      secondary: '#93C5FD',    // Azul suave
      success: '#10B981',      // Verde sucesso
      warning: '#FBBF24',      // Amarelo alerta
      danger: '#EF4444',       // Vermelho perigo
      text: '#1F2937',         // Texto escuro
      textLight: '#6B7280',    // Texto cinza
      background: '#FFFFFF',   // Fundo branco
      headerBg: '#F0F9FF',     // Fundo do cabeçalho azul claro
      border: '#E5E7EB'        // Bordas
    },
    verde: {
      primary: '#10B981',      // Verde vibrante
      secondary: '#A7F3D0',    // Verde suave
      success: '#059669',      // Verde escuro
      warning: '#FBBF24',      // Amarelo alerta
      danger: '#EF4444',       // Vermelho perigo
      text: '#1F2937',         // Texto escuro
      textLight: '#6B7280',    // Texto cinza
      background: '#FFFFFF',   // Fundo branco
      headerBg: '#ECFDF5',     // Fundo do cabeçalho verde claro
      border: '#E5E7EB'        // Bordas
    }
  };
  
  return temas[tema as keyof typeof temas] || temas.roxo;
};
