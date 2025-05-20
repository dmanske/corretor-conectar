import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Carrega os estilos da landing page
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
