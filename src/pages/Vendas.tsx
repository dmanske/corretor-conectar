import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Building, Calendar, User, ChevronDown, ChevronUp, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Venda } from "../types";
import { useVendas } from "@/hooks/useVendas";
import { format, parseISO, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useClientes } from "@/hooks/useClientes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

const Vendas = () => {
  const [busca, setBusca] = useState("");
  const [periodoSelecionado, setPeriodoSelecionado] = useState<"todos" | "mes" | "semana">("todos");
  const [filtroDia, setFiltroDia] = useState<string>("");
  const [filtroMes, setFiltroMes] = useState<string>("");
  const [filtroAno, setFiltroAno] = useState<string>("");
  const [filtroCPF, setFiltroCPF] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState<string>("");
  const [filtroDataFim, setFiltroDataFim] = useState<string>("");
  const { vendas, isLoading, formatarMoeda, formatarData } = useVendas();
  const { clientes } = useClientes();
  const [vendaDetalhe, setVendaDetalhe] = useState<Venda | null>(null);
  
  // Filtrar vendas com base na busca e filtros
  const vendasFiltradas = vendas.filter(venda => {
    const buscaMatch =
      venda.clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
      venda.tipoImovel.toLowerCase().includes(busca.toLowerCase()) ||
      venda.endereco.toLowerCase().includes(busca.toLowerCase()) ||
      String(venda.valor).includes(busca);
    const dataInicioMatch = filtroDataInicio ? venda.dataVenda >= filtroDataInicio : true;
    const dataFimMatch = filtroDataFim ? venda.dataVenda <= filtroDataFim : true;
    return buscaMatch && dataInicioMatch && dataFimMatch;
  });

  // Agrupar vendas por mês e dia
  const vendasAgrupadas = useMemo(() => {
    const grupos: { [key: string]: { [key: string]: Venda[] } } = {};
    
    vendasFiltradas.forEach(venda => {
      const data = parseISO(venda.dataVenda);
      const mesAno = format(data, "MMMM yyyy", { locale: ptBR });
      const dia = format(data, "dd/MM/yyyy");
      
      if (!grupos[mesAno]) {
        grupos[mesAno] = {};
      }
      if (!grupos[mesAno][dia]) {
        grupos[mesAno][dia] = [];
      }
      grupos[mesAno][dia].push(venda);
    });

    return grupos;
  }, [vendasFiltradas]);

  // Filtrar por período
  const vendasFiltradasPorPeriodo = useMemo(() => {
    if (periodoSelecionado === "todos") return vendasAgrupadas;

    const hoje = new Date();
    const gruposFiltrados: { [key: string]: { [key: string]: Venda[] } } = {};

    Object.entries(vendasAgrupadas).forEach(([mesAno, dias]) => {
      Object.entries(dias).forEach(([dia, vendas]) => {
        const dataVenda = parseISO(vendas[0].dataVenda);
        
        if (periodoSelecionado === "mes" && isSameMonth(dataVenda, hoje)) {
          if (!gruposFiltrados[mesAno]) gruposFiltrados[mesAno] = {};
          gruposFiltrados[mesAno][dia] = vendas;
        } else if (periodoSelecionado === "semana") {
          const diffDias = Math.abs(hoje.getTime() - dataVenda.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDias <= 7) {
            if (!gruposFiltrados[mesAno]) gruposFiltrados[mesAno] = {};
            gruposFiltrados[mesAno][dia] = vendas;
          }
        }
      });
    });

    return gruposFiltrados;
  }, [vendasAgrupadas, periodoSelecionado]);
  
  const limparFiltros = useCallback(() => {
    setFiltroDataInicio("");
    setFiltroDataFim("");
    setBusca("");
    setPeriodoSelecionado("todos");
  }, []);

  const setHoje = useCallback(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    setFiltroDataInicio(hoje);
    setFiltroDataFim(hoje);
  }, []);

  // Cálculos para os cards de resumo
  const totalVendas = vendasFiltradas.length;
  const valorTotalVendas = vendasFiltradas.reduce((acc, venda) => acc + venda.valor, 0);
  const tiposImovel = useMemo(() => {
    return vendasFiltradas.reduce((acc, venda) => {
      acc[venda.tipoImovel] = (acc[venda.tipoImovel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [vendasFiltradas]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vendas</h2>
          <p className="text-slate-500">Gerencie todas as vendas realizadas.</p>
        </div>
        <Button asChild>
          <Link to="/vendas/nova">
            <Building className="mr-2 h-4 w-4" />
            Nova Venda
          </Link>
        </Button>
      </div>

      {/* Cards de resumo coloridos, modernos e responsivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg">
          <CardContent className="py-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="w-6 h-6" />
              <span className="text-lg font-semibold">Total de Vendas</span>
            </div>
            <div className="text-3xl font-bold">{totalVendas}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg">
          <CardContent className="py-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6" />
              <span className="text-lg font-semibold">Valor Total Vendido</span>
            </div>
            <div className="text-3xl font-bold">{formatarMoeda(valorTotalVendas)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg">
          <CardContent className="py-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-6 h-6" />
              <span className="text-lg font-semibold">Tipos de Imóvel</span>
            </div>
            <ul className="text-base space-y-1">
              {Object.entries(tiposImovel).map(([tipo, count]) => (
                <li key={tipo} className="flex items-center gap-2">
                  <span className="inline-block bg-white/20 text-white rounded px-2 py-0.5 text-xs font-medium border border-white/30">{tipo}</span>
                  <span className="text-white font-bold">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tabela detalhada de vendas restaurada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {totalVendas > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left py-2 px-4 border-b">Data</th>
                    <th className="text-left py-2 px-4 border-b">Cliente</th>
                    <th className="text-left py-2 px-4 border-b">Imóvel</th>
                    <th className="text-left py-2 px-4 border-b">Valor</th>
                    <th className="text-left py-2 px-4 border-b">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {vendasFiltradas.map(venda => (
                    <tr key={venda.id} className="hover:bg-slate-50">
                      <td className="py-2 px-4 border-b">{formatarData(venda.dataVenda)}</td>
                      <td className="py-2 px-4 border-b">{venda.clienteNome}</td>
                      <td className="py-2 px-4 border-b">{venda.endereco}</td>
                      <td className="py-2 px-4 border-b text-blue-600 font-semibold">{formatarMoeda(venda.valor)}</td>
                      <td className="py-2 px-4 border-b">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{venda.tipoImovel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10">
              <p>Nenhuma venda registrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Barra de busca e filtros avançados */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="text"
              placeholder="Buscar vendas por cliente, tipo de imóvel ou endereço..." 
              className="pl-10"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={periodoSelecionado === "todos" ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriodoSelecionado("todos")}
            >
              Todos
            </Button>
            <Button 
              variant={periodoSelecionado === "mes" ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriodoSelecionado("mes")}
            >
              Este Mês
            </Button>
            <Button 
              variant={periodoSelecionado === "semana" ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriodoSelecionado("semana")}
            >
              Última Semana
            </Button>
          </div>
        </div>
        {/* Filtros reduzidos: apenas Data e Data Início */}
        <div className="flex flex-wrap gap-2 items-center">
          <Button size="sm" variant="outline" onClick={setHoje}>Hoje</Button>
          <Input
            type="date"
            value={filtroDataInicio}
            onChange={e => setFiltroDataInicio(e.target.value)}
            className="w-auto"
            placeholder="Data início"
            title="Data início"
          />
          <Input
            type="date"
            value={filtroDataFim}
            onChange={e => setFiltroDataFim(e.target.value)}
            className="w-auto"
            placeholder="Data fim"
            title="Data fim"
          />
          <span className="text-xs text-slate-500 ml-2">Filtre as vendas por um intervalo de datas (início e fim).</span>
          <Button size="sm" variant="destructive" onClick={limparFiltros}>Limpar filtros</Button>
        </div>
      </div>

      {/* Modal de detalhes da venda restaurado */}
      <Dialog open={!!vendaDetalhe} onOpenChange={open => { if (!open) setVendaDetalhe(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Venda</DialogTitle>
          </DialogHeader>
          {vendaDetalhe && (
            <div className="space-y-2">
              <p><b>Tipo do imóvel:</b> {vendaDetalhe.tipoImovel}</p>
              <p><b>Valor:</b> {formatarMoeda(vendaDetalhe.valor)}</p>
              <p><b>Data da venda:</b> {formatarData(vendaDetalhe.dataVenda)}</p>
              <p><b>Endereço:</b> {vendaDetalhe.endereco}</p>
              <p><b>Cliente:</b> {vendaDetalhe.clienteNome}</p>
              {vendaDetalhe.observacoes && <p><b>Observações:</b> {vendaDetalhe.observacoes}</p>}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendas;
