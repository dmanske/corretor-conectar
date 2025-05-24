import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Target, BarChart3, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useComissoes } from "@/hooks/useComissoes";
import { Comissao } from "@/types/comissao.types";
import { useMetaAnual } from "@/hooks/useMetaAnual";

const DashboardComissaoAnual = () => {
  // Estados
  const [anual_metaValor, setAnual_metaValor] = useState<number>(0);
  const [anual_totalVendido, setAnual_totalVendido] = useState<number>(0);
  const [anual_totalComissao, setAnual_totalComissao] = useState<number>(0);
  const [anual_progressoMeta, setAnual_progressoMeta] = useState<number>(0);
  const [vendasMesAtual, setVendasMesAtual] = useState<number>(0);
  const [metaMesAtual, setMetaMesAtual] = useState<number>(0);
  const [atingidoMesAtual, setAtingidoMesAtual] = useState<number>(0);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth());
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [editandoMeta, setEditandoMeta] = useState(false);
  const [metaTemp, setMetaTemp] = useState(anual_metaValor);

  // Hooks
  const { comissoes, metaComissao, isLoading, getRecebimentosByComissaoId } = useComissoes();
  const { metaAnual, updateMetaAnual } = useMetaAnual(anoSelecionado);

  // Cálculo correto dos valores recebidos e pendentes (assíncrono)
  const [totalComissaoRecebida, setTotalComissaoRecebida] = useState(0);
  const [totalComissaoPendente, setTotalComissaoPendente] = useState(0);

  // Gráfico de progresso anual de comissões (comissão recebida por mês)
  const [dadosLinhaProgresso, setDadosLinhaProgresso] = useState<any[]>([]);
  // Gráfico de status das comissões
  const [dadosDonutStatus, setDadosDonutStatus] = useState<any[]>([]);

  // Adicione este estado para armazenar os valores recebidos/pendentes por comissão
  const [valoresComissoes, setValoresComissoes] = useState<{[id: string]: {recebido: number, pendente: number}}>({});

  // Efeitos
  useEffect(() => {
    if (metaAnual) {
      setAnual_metaValor(metaAnual.valor);
    }
  }, [metaAnual]);

  useEffect(() => {
    const calcularTotais = async () => {
      let recebido = 0;
      let pendente = 0;
      const comissoesAno = comissoes.filter(c => {
        const dataVenda = new Date(c.dataVenda);
        return dataVenda.getFullYear() === anoSelecionado;
      });
      for (const c of comissoesAno) {
        const recebimentos = await getRecebimentosByComissaoId(c.id);
        const valorRecebido = recebimentos.reduce((acc, r) => acc + (r.valor || 0), 0);
        recebido += valorRecebido;
        const valorPendente = (c.valorComissaoCorretor || 0) - valorRecebido;
        if (valorPendente > 0) pendente += valorPendente;
      }
      setTotalComissaoRecebida(recebido);
      setTotalComissaoPendente(pendente);
    };
    calcularTotais();
  }, [comissoes, anoSelecionado, getRecebimentosByComissaoId]);

  useEffect(() => {
    const calcularGraficos = async () => {
      // Progresso anual
      const meses = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ];
      const dadosMes: any[] = meses.map((mes, i) => ({ mes, comissao: 0, meta: anual_metaValor / 12 }));
      const comissoesAno = comissoes.filter(c => new Date(c.dataVenda).getFullYear() === anoSelecionado);
      for (const c of comissoesAno) {
        const dataVenda = new Date(c.dataVenda);
        const mesIndex = dataVenda.getMonth();
        const recebimentos = await getRecebimentosByComissaoId(c.id);
        const valorRecebido = recebimentos.reduce((acc, r) => acc + (r.valor || 0), 0);
        dadosMes[mesIndex].comissao += valorRecebido;
      }
      setDadosLinhaProgresso(dadosMes);

      // Status das comissões
      let totalRecebido = 0;
      let totalParcial = 0;
      let totalPendente = 0;
      for (const c of comissoesAno) {
        const recebimentos = await getRecebimentosByComissaoId(c.id);
        const valorRecebido = recebimentos.reduce((acc, r) => acc + (r.valor || 0), 0);
        const valorTotal = c.valorComissaoCorretor || 0;
        const valorRestante = valorTotal - valorRecebido;
        if (c.status?.toLowerCase() === "recebido") {
          totalRecebido += valorRecebido;
        } else if (c.status?.toLowerCase() === "parcial") {
          totalParcial += valorRecebido;
          totalPendente += valorRestante > 0 ? valorRestante : 0;
        } else if (c.status?.toLowerCase() === "pendente") {
          totalPendente += valorTotal;
        }
      }
      setDadosDonutStatus([
        { name: "Recebido", value: totalRecebido, color: "#10B981" },
        { name: "Parcial", value: totalParcial, color: "#3B82F6" },
        { name: "Pendente", value: totalPendente, color: "#FBBF24" },
      ]);
    };
    calcularGraficos();
  }, [comissoes, anoSelecionado, anual_metaValor, getRecebimentosByComissaoId]);

  // Calcule os valores recebidos/pendentes para cada comissão filtrada
  useEffect(() => {
    async function calcularValores() {
      const novoMapa: {[id: string]: {recebido: number, pendente: number}} = {};
      const comissoesFiltradas = comissoes
        .filter(c => {
          const dataVenda = new Date(c.dataVenda);
          const anoMatch = dataVenda.getFullYear() === anoSelecionado;
          const mesMatch = mesSelecionado === 'todos' || dataVenda.getMonth() === Number(mesSelecionado);
          const statusMatch = statusFiltro === "todos" || c.status?.toLowerCase() === statusFiltro;
          return anoMatch && mesMatch && statusMatch;
        });
      for (const c of comissoesFiltradas) {
        const recebimentos = await getRecebimentosByComissaoId(c.id);
        const recebido = recebimentos.reduce((acc, r) => acc + (r.valor || 0), 0);
        const pendente = Math.max((c.valorComissaoCorretor || 0) - recebido, 0);
        novoMapa[c.id] = { recebido, pendente };
      }
      setValoresComissoes(novoMapa);
    }
    calcularValores();
  }, [comissoes, anoSelecionado, mesSelecionado, statusFiltro, getRecebimentosByComissaoId]);

  // Funções auxiliares
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calcularTotaisAnuais = () => {
    const comissoesAno = comissoes.filter(c => {
      const dataVenda = new Date(c.dataVenda);
      return dataVenda.getFullYear() === anoSelecionado;
    });

    const totalComissaoRecebida = comissoesAno
      .filter(c => c.status?.toLowerCase() === "recebido")
      .reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);

    const totalComissaoPendente = comissoesAno
      .filter(c => c.status?.toLowerCase() === "parcial" || c.status?.toLowerCase() === "pendente")
      .reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);

    const totalVendido = comissoesAno.reduce((acc, c) => acc + (c.valorVenda || 0), 0);
    const progresso = anual_metaValor > 0 ? (totalComissaoRecebida / anual_metaValor) * 100 : 0;

    setAnual_totalVendido(totalVendido);
    setAnual_totalComissao(totalComissaoRecebida);
    setAnual_progressoMeta(progresso);
  };

  const calcularDesempenhoMesAtual = () => {
    const comissoesMes = comissoes.filter(c => {
      const dataVenda = new Date(c.dataVenda);
      return dataVenda.getFullYear() === anoSelecionado && dataVenda.getMonth() === mesSelecionado;
    });

    const comissao = comissoesMes.reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
    const meta = metaComissao || 0;
    const atingido = meta > 0 ? (comissao / meta) * 100 : 0;

    setVendasMesAtual(comissao);
    setMetaMesAtual(meta);
    setAtingidoMesAtual(atingido);
  };

  const handleMetaAnualChange = async (valor: number) => {
    setAnual_metaValor(valor);
    await updateMetaAnual(valor);
  };

  // Efeitos
  useEffect(() => {
    calcularTotaisAnuais();
    calcularDesempenhoMesAtual();
  }, [comissoes, anoSelecionado, mesSelecionado, anual_metaValor, metaComissao]);

  // Anos disponíveis com vendas/comissões
  const anosDisponiveis = Array.from(new Set(comissoes.map(c => new Date(c.dataVenda).getFullYear())));

  // Meses disponíveis com vendas/comissões
  const mesesDisponiveis = Array.from(new Set(comissoes.filter(c => new Date(c.dataVenda).getFullYear() === anoSelecionado).map(c => new Date(c.dataVenda).getMonth())));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-700">Dashboard de Comissão Anual</h2>
          <p className="text-slate-500">Acompanhe seu desempenho anual de vendas e comissões.</p>
        </div>
      </div>

      {/* Painel Resumo Superior */}
      <div className="flex flex-col gap-2 items-start">
        <Button onClick={() => setEditandoMeta(true)} variant="outline" className="mb-2 whitespace-nowrap">Definir Meta Anual</Button>
        <div className="grid gap-4 md:grid-cols-4 w-full">
        <Card className="bg-gradient-to-br from-indigo-500 via-blue-400 to-cyan-400 text-white relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Anual de Comissão</CardTitle>
            <Target className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatarMoeda(anual_metaValor)}</span>
              </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-400 via-emerald-500 to-lime-400 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comissão Recebida</CardTitle>
            <DollarSign className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{formatarMoeda(totalComissaoRecebida)}</div>
              <p className="text-sm text-white/80 mt-1">{anual_metaValor > 0 ? ((totalComissaoRecebida / anual_metaValor) * 100).toFixed(1) : 0}% da meta</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">
                {formatarMoeda(totalComissaoPendente)}
              </div>
            <p className="text-sm text-white/80 mt-1">A receber</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso da Meta</CardTitle>
            <BarChart3 className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
              <Progress value={anual_metaValor > 0 ? (totalComissaoRecebida / anual_metaValor) * 100 : 0} className="h-2 bg-white/20" />
              <p className="text-sm text-white/80 mt-2">{anual_metaValor > 0 ? ((totalComissaoRecebida / anual_metaValor) * 100).toFixed(1) : 0}% atingido</p>
          </CardContent>
        </Card>
      </div>
      </div>

      {/* Modal para definir meta anual */}
      {editandoMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Definir Meta Anual de Comissão</h3>
            <Input
              type="number"
              value={metaTemp}
              onChange={e => setMetaTemp(Number(e.target.value))}
              className="mb-4"
              min={0}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={async () => { await handleMetaAnualChange(metaTemp); setEditandoMeta(false); }}>Salvar</Button>
              <Button variant="outline" onClick={() => { setEditandoMeta(false); setMetaTemp(anual_metaValor); }}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-slate-700">Progresso Anual de Comissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosLinhaProgresso}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => formatarMoeda(value)} />
                  <Tooltip formatter={(value) => formatarMoeda(value as number)} />
                  <Legend />
                  <Line type="monotone" dataKey="comissao" name="Comissão Recebida" stroke="#2563eb" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-slate-700">Status das Comissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosDonutStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatarMoeda(value)}`}
                  >
                    {dadosDonutStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatarMoeda(value as number)} />
                  <Legend verticalAlign="bottom" iconType="circle"/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="w-32">
          <Label>Ano</Label>
          <Select
            value={anoSelecionado.toString()}
            onValueChange={(value) => setAnoSelecionado(Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {anosDisponiveis.map((ano) => (
                <SelectItem key={ano} value={ano.toString()}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-32">
          <Label>Mês</Label>
          <Select
            value={mesSelecionado.toString()}
            onValueChange={(value) => setMesSelecionado(Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {mesesDisponiveis.map((i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(new Date(2024, i, 1), "MMMM", { locale: ptBR })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-slate-700">Detalhamento de Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Data</TableHead>
                <TableHead className="text-center">Cliente</TableHead>
                <TableHead className="text-center">Imóvel</TableHead>
                <TableHead className="text-center">Venda</TableHead>
                <TableHead className="text-center">Comissão</TableHead>
                <TableHead className="text-center">Nota Fiscal</TableHead>
                <TableHead className="text-center">Recebido</TableHead>
                <TableHead className="text-center">Pendente</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comissoes
                .filter(c => {
                  const dataVenda = new Date(c.dataVenda);
                  const anoMatch = dataVenda.getFullYear() === anoSelecionado;
                  const mesMatch = mesSelecionado === 'todos' || dataVenda.getMonth() === Number(mesSelecionado);
                  const statusMatch = statusFiltro === "todos" || c.status?.toLowerCase() === statusFiltro;
                  return anoMatch && mesMatch && statusMatch;
                })
                .map((comissao, idx) => {
                  return (
                    <TableRow key={comissao.id} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <TableCell className="text-center py-3 font-medium text-slate-700">{format(new Date(comissao.dataVenda), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="text-left font-medium text-slate-700">{comissao.cliente}</TableCell>
                      <TableCell className="text-left text-slate-600">{comissao.imovel}</TableCell>
                      <TableCell className="text-center text-blue-900 font-bold">{formatarMoeda(comissao.valorVenda)}</TableCell>
                      <TableCell className="text-center text-green-700 font-bold">{formatarMoeda(comissao.valorComissaoCorretor)}</TableCell>
                      <TableCell className="text-center text-slate-600">{comissao.nota_fiscal || '-'}</TableCell>
                      <TableCell className="text-center font-bold text-green-700">{formatarMoeda(valoresComissoes[comissao.id]?.recebido || 0)}</TableCell>
                      <TableCell className={`text-center font-bold ${valoresComissoes[comissao.id]?.pendente > 0 ? 'text-red-700' : 'text-slate-400'}`}>{formatarMoeda(valoresComissoes[comissao.id]?.pendente || 0)}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        comissao.status?.toLowerCase() === "recebido" 
                            ? "bg-green-100 text-green-800 border border-green-300"
                          : comissao.status?.toLowerCase() === "parcial"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      }`}>
                        {comissao.status || "Pendente"}
                      </span>
                    </TableCell>
                  </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardComissaoAnual; 