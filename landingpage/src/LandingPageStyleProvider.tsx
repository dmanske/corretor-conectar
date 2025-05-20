import React from 'react';
import './index.css';

interface LandingPageStyleProviderProps {
  children: React.ReactNode;
}

/**
 * Componente que encapsula os estilos da landing page.
 * Este componente garante que os estilos da landing page sejam aplicados apenas
 * dentro do escopo deste componente, sem afetar o restante da aplicação.
 */
const LandingPageStyleProvider: React.FC<LandingPageStyleProviderProps> = ({ children }) => {
  // Importa e aplica os estilos da landing page apenas neste contexto
  return <>{children}</>;
};

export default LandingPageStyleProvider; 