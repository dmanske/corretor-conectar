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
  const { comissoes, metaComissao, isLoading } = useComissoes();
  const { metaAnual, updateMetaAnual } = useMetaAnual(anoSelecionado);

  // Efeitos
  useEffect(() => {
    if (metaAnual) {
      setAnual_metaValor(metaAnual.valor);
    }
  }, [metaAnual]);

  // Funções auxiliares
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calcularTotaisAnuais = () => {
    const comissoesAno = comissoes.filter(c => {
      const dataVenda = new Date(c.dataVenda);
      return dataVenda.getFullYear() === anoSelecionado;
    });

    const totalComissao = comissoesAno.reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
    const totalVendido = comissoesAno.reduce((acc, c) => acc + (c.valorVenda || 0), 0);
    const progresso = anual_metaValor > 0 ? (totalComissao / anual_metaValor) * 100 : 0;

    setAnual_totalVendido(totalVendido);
    setAnual_totalComissao(totalComissao);
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

  // Dados para gráficos
  const dadosLinhaProgresso = [
    { mes: "Jan", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Fev", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Mar", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Abr", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Mai", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Jun", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Jul", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Ago", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Set", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Out", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Nov", comissao: 0, meta: anual_metaValor / 12 },
    { mes: "Dez", comissao: 0, meta: anual_metaValor / 12 },
  ];

  // Preencher dados reais
  comissoes.forEach(c => {
    const dataVenda = new Date(c.dataVenda);
    if (dataVenda.getFullYear() === anoSelecionado) {
      const mesIndex = dataVenda.getMonth();
      dadosLinhaProgresso[mesIndex].comissao += c.valorComissaoCorretor || 0;
    }
  });

  const dadosDonutStatus = [
    { name: "Recebido", value: 0, color: "#10B981" },
    { name: "Parcial", value: 0, color: "#3B82F6" },
    { name: "Pendente", value: 0, color: "#FBBF24" },
  ];

  // Preencher dados reais do status
  comissoes.forEach(c => {
    if (new Date(c.dataVenda).getFullYear() === anoSelecionado) {
      const status = c.status?.toLowerCase() || "pendente";
      const index = dadosDonutStatus.findIndex(d => d.name.toLowerCase() === status);
      if (index !== -1) {
        dadosDonutStatus[index].value += c.valorComissaoCorretor || 0;
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-700">Dashboard de Comissão Anual</h2>
          <p className="text-slate-500">Acompanhe seu desempenho anual de vendas e comissões.</p>
        </div>
      </div>

      {/* Painel Resumo Superior */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-indigo-500 via-blue-400 to-cyan-400 text-white relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Anual de Comissão</CardTitle>
            <Target className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            {editandoMeta ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={metaTemp}
                  onChange={e => setMetaTemp(Number(e.target.value))}
                  className="text-slate-800 bg-white border-blue-200 placeholder:text-blue-400"
                  min={0}
                  autoFocus
                />
                <Button size="sm" variant="secondary" onClick={async () => { await handleMetaAnualChange(metaTemp); setEditandoMeta(false); }}>
                  Salvar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditandoMeta(false); setMetaTemp(anual_metaValor); }}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatarMoeda(anual_metaValor)}</span>
                <Button size="icon" variant="ghost" className="text-white/80" onClick={() => setEditandoMeta(true)}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6v-3.586a1 1 0 01.293-.707l9-9a1 1 0 011.414 0l3.586 3.586a1 1 0 010 1.414l-9 9a1 1 0 01-.707.293H3z"></path></svg>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-400 via-emerald-500 to-lime-400 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissão Acumulada</CardTitle>
            <DollarSign className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(anual_totalComissao)}</div>
            <p className="text-sm text-white/80 mt-1">{anual_progressoMeta.toFixed(1)}% da meta</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(anual_totalVendido - anual_totalComissao)}</div>
            <p className="text-sm text-white/80 mt-1">A receber</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso da Meta</CardTitle>
            <BarChart3 className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <Progress value={anual_progressoMeta} className="h-2 bg-white/20" />
            <p className="text-sm text-white/80 mt-2">{anual_progressoMeta.toFixed(1)}% atingido</p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de KPI */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendido</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatarMoeda(anual_totalVendido)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissão Acumulada</CardTitle>
            <DollarSign className="h-4 w-4 text-green-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatarMoeda(anual_totalComissao)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Atingido</CardTitle>
            <Target className="h-4 w-4 text-purple-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {anual_progressoMeta.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desempenho do Mês Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-slate-700">Desempenho do Mês Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-slate-600">Vendas do Mês</Label>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {formatarMoeda(vendasMesAtual)}
              </div>
            </div>
            <div>
              <Label className="text-slate-600">Meta do Mês</Label>
              <div className="text-2xl font-bold text-slate-600 mt-1">
                {formatarMoeda(metaMesAtual)}
              </div>
            </div>
            <div>
              <Label className="text-slate-600">% Atingido</Label>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {atingidoMesAtual.toFixed(1)}%
              </div>
            </div>
          </div>
          <Progress value={atingidoMesAtual} className="h-2 mt-4" />
        </CardContent>
      </Card>

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
                  <Line type="monotone" dataKey="comissao" name="Comissão" stroke="#2563eb" />
                  <Line type="monotone" dataKey="meta" name="Meta Mensal" stroke="#a21caf" />
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
            <div className="h-[300px]">
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
                  <Legend />
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
              {[2023, 2024, 2025].map((ano) => (
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
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(new Date(2024, i, 1), "MMMM", { locale: ptBR })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-32">
          <Label>Status</Label>
          <Select
            value={statusFiltro}
            onValueChange={setStatusFiltro}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="recebido">Recebido</SelectItem>
              <SelectItem value="parcial">Parcial</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
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
                <TableHead>Data Venda</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Imóvel</TableHead>
                <TableHead className="text-right">Valor Venda</TableHead>
                <TableHead className="text-right">Comissão</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comissoes
                .filter(c => {
                  const dataVenda = new Date(c.dataVenda);
                  const anoMatch = dataVenda.getFullYear() === anoSelecionado;
                  const mesMatch = mesSelecionado === null || dataVenda.getMonth() === mesSelecionado;
                  const statusMatch = statusFiltro === "todos" || c.status?.toLowerCase() === statusFiltro;
                  return anoMatch && mesMatch && statusMatch;
                })
                .map((comissao) => (
                  <TableRow
                    key={comissao.id}
                    className={`${
                      comissao.statusValor === "Desatualizado" ? "border-red-500" : ""
                    } ${
                      comissao.valorComissaoImobiliaria === 0 && comissao.valorComissaoCorretor === 0
                        ? "border-yellow-500"
                        : ""
                    }`}
                  >
                    <TableCell>
                      {format(new Date(comissao.dataVenda), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{comissao.cliente}</TableCell>
                    <TableCell>{comissao.imovel}</TableCell>
                    <TableCell className="text-right text-slate-600">
                      {formatarMoeda(comissao.valorVenda)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-700">
                      {formatarMoeda(comissao.valorComissaoCorretor)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        comissao.status?.toLowerCase() === "recebido" 
                          ? "bg-green-100 text-green-800"
                          : comissao.status?.toLowerCase() === "parcial"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {comissao.status || "Pendente"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardComissaoAnual; 