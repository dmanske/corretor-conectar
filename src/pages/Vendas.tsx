import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Building, Calendar, User, ChevronDown, ChevronUp } from "lucide-react";
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

      {/* Lista de vendas agrupada */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : Object.keys(vendasFiltradasPorPeriodo).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(vendasFiltradasPorPeriodo).map(([mesAno, dias]) => (
            <Card key={mesAno}>
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-lg capitalize">{mesAno}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {Object.entries(dias).map(([dia, vendasDoDia]) => (
                  <div key={dia} className="border-b last:border-b-0">
                    <div className="px-4 py-3 bg-slate-50/50">
                      <h3 className="font-medium text-slate-700">{dia}</h3>
                    </div>
                    <div className="divide-y">
                      {vendasDoDia.map(venda => (
                        <div key={venda.id} className="p-4 hover:bg-slate-50">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-slate-400" />
                                <span className="font-medium">{venda.tipoImovel}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <User className="h-4 w-4" />
                                <Link to={`/clientes/${venda.clienteId}`} state={{ fromVendas: true }} className="hover:text-blue-600 hover:underline">
                                  {venda.clienteNome}
                                </Link>
                              </div>
                              <p className="text-sm text-slate-600">{venda.endereco}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-blue-600">
                                {formatarMoeda(venda.valor)}
                              </div>
                              <Button variant="outline" size="sm" className="mt-2" onClick={() => setVendaDetalhe(venda)}>
                                Ver detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-dashed border-slate-300 bg-slate-50">
          <CardContent className="py-10 text-center">
            <p className="text-slate-500 mb-4">Nenhuma venda encontrada.</p>
            <Button asChild>
              <Link to="/vendas/nova">
                <Plus className="mr-2 h-4 w-4" />
                Registrar Nova Venda
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalhes da venda */}
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
