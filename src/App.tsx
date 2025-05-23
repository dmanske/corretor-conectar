import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { VendasProvider } from "./hooks/VendasProvider";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Vendas from "./pages/Vendas";
import ClienteDetalhe from "./pages/ClienteDetalhe";
import VendaDetalhe from "./pages/VendaDetalhe";
import NovoCliente from "./pages/NovoCliente";
import NovaVenda from "./pages/NovaVenda";
import Aniversarios from "./pages/Aniversarios";
import Comissoes from "./pages/Comissoes";
import DashboardComissaoAnual from "./pages/DashboardComissaoAnual";
import HistoricoFinanceiro from "./pages/HistoricoFinanceiro";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import VendaEditar from "./pages/VendaEditar";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AuthProvider>
          <VendasProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<Auth />} />
              <Route 
                path="/app" 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="clientes/novo" element={<NovoCliente />} />
                <Route path="clientes/:id" element={<ClienteDetalhe />} />
                <Route path="vendas" element={<Vendas />} />
                <Route path="vendas/nova" element={<NovaVenda />} />
                <Route path="vendas/:id" element={<VendaDetalhe />} />
                <Route path="vendas/:id/editar" element={<ProtectedRoute><VendaEditar /></ProtectedRoute>} />
                <Route path="aniversarios" element={<Aniversarios />} />
                <Route path="comissoes" element={<Comissoes />} />
                <Route path="dashboard-comissao-anual" element={<DashboardComissaoAnual />} />
                <Route path="financeiro" element={<HistoricoFinanceiro />} />
                <Route path="relatorios" element={<Relatorios />} />
                <Route path="configuracoes" element={<Configuracoes />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </VendasProvider>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
