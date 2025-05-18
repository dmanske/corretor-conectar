import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, PlusCircle, Cog, Loader2, BarChart3, CheckCircle, AlertTriangle, XCircle, TrendingUp, DollarSign, Clock, Target, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, CartesianGrid, Cell, LineChart, Line } from 'recharts';

// Custom hooks and components
import { useComissoes } from "@/hooks/useComissoes";
import ComissoesFilter from "@/components/comissoes/ComissoesFilter";
import ComissoesSummary from "@/components/comissoes/ComissoesSummary";
import ComissaoTable from "@/components/comissoes/ComissaoTable";
import ComissaoForm from "@/components/comissoes/ComissaoForm";
import ExportDialog from "@/components/comissoes/ExportDialog";
import { useAuth } from "@/hooks/useAuth";
import { Comissao } from "@/hooks/useComissoes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

// Novo tipo para comissão com detalhes de recebimento
interface ComissaoComDetalhes extends Comissao {
  valorJaRecebido: number;
}

// Substituir nomes dos meses abreviados por completos
const mesesNomesCompletos = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Novo componente de resumo anual
const ResumoAnualComissoes = ({ ano, comissoes, metasAno, recebimentosPorMes, aReceberPorMes }) => {
  // Array de meses
  const mesesNomes = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  // Monta array de metas mensais
  const metasMensais = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const meta = metasAno.find(m => m.mes === i + 1);
      // Soma vendas do mês
      const vendasMes = comissoes.filter(c => {
        if (!c.dataVenda) return false;
        const data = new Date(c.dataVenda);
        return data.getFullYear() === ano && data.getMonth() === i;
      });
      const vendido = vendasMes.reduce((acc, c) => acc + (c.valorVenda || 0), 0);
      const percentual = meta && meta.valor > 0 ? (vendido / meta.valor) * 100 : 0;
      arr.push({
        mes: i,
        nome: mesesNomesCompletos[i],
        meta: meta ? meta.valor : null,
        vendido,
        percentual
      });
    }
    return arr;
  }, [ano, comissoes, metasAno]);

  // Resumo geral
  const totalVendido = comissoes.filter(c => c.dataVenda && new Date(c.dataVenda).getFullYear() === ano).reduce((acc, c) => acc + (c.valorVenda || 0), 0);
  const totalComissao = comissoes.filter(c => c.dataVenda && new Date(c.dataVenda).getFullYear() === ano).reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
  const totalRecebido = comissoes.filter(c => c.dataVenda && new Date(c.dataVenda).getFullYear() === ano && c.status?.toLowerCase() === "recebido").reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
  const totalPendente = comissoes.filter(c => c.dataVenda && new Date(c.dataVenda).getFullYear() === ano && (c.status?.toLowerCase() === "pendente" || c.status?.toLowerCase() === "parcial")).reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0);
  const metaAnual = metasAno.reduce((acc, m) => acc + (m.valor || 0), 0);
  const percentualAnual = metaAnual > 0 ? (totalVendido / metaAnual) * 100 : 0;
  const mediaMensal = metasAno.length > 0 ? totalVendido / metasAno.length : 0;
  const melhorMes = metasMensais.reduce((max, m) => m.vendido > max.vendido ? m : max, { vendido: 0 });

  // Dados para o gráfico
  const dadosGrafico = metasMensais.map(m => ({
    mes: m.nome,
    Vendido: m.vendido,
    Meta: m.meta || 0
  }));

  // Dados para o gráfico de linha de vendas
  const dadosLinhaVendas = metasMensais.map(m => ({ mes: m.nome, Vendido: m.vendido }));

  return (
    <div className="space-y-6 mb-6">
      {/* Cards coloridos e modernos de resumo geral */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        <div className="bg-gradient-to-br from-blue-200 to-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-blue-700 font-semibold uppercase text-xs mb-1">
            <TrendingUp className="w-5 h-5" /> Total vendido
          </div>
          <div className="text-3xl font-extrabold text-blue-900">{totalVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        </div>
        <div className="bg-gradient-to-br from-green-200 to-green-50 border border-green-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-green-700 font-semibold uppercase text-xs mb-1">
            <CheckCircle className="w-5 h-5" /> Comissões recebidas
          </div>
          <div className="text-3xl font-extrabold text-green-900">{totalRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-200 to-yellow-50 border border-yellow-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-yellow-700 font-semibold uppercase text-xs mb-1">
            <Clock className="w-5 h-5" /> Comissões pendentes
          </div>
          <div className="text-3xl font-extrabold text-yellow-900">{totalPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        <div className="bg-gradient-to-br from-purple-200 to-purple-50 border border-purple-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-purple-700 font-semibold uppercase text-xs mb-1">
            <Target className="w-5 h-5" /> Meta anual
          </div>
          <div className="text-3xl font-extrabold text-purple-900">{metaAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-200 to-cyan-50 border border-cyan-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-cyan-700 font-semibold uppercase text-xs mb-1">
            <BarChart3 className="w-5 h-5" /> Média mensal
          </div>
          <div className="text-3xl font-extrabold text-cyan-900">{mediaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        </div>
        <div className="bg-gradient-to-br from-pink-200 to-pink-50 border border-pink-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-pink-700 font-semibold uppercase text-xs mb-1">
            <Star className="w-5 h-5" /> Melhor mês
          </div>
          <div className="text-3xl font-extrabold text-pink-900">{melhorMes.nome} ({melhorMes.vendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
        </div>
      </div>
      {/* Barra de progresso da meta anual */}
      <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 mb-2">
        <div className="text-xs text-slate-500 mb-1">Percentual da meta anual atingido</div>
        <div className="flex items-center gap-2">
          <div className="w-40 h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${Math.min(percentualAnual, 100)}%` }}></div>
          </div>
          <span className="font-bold text-blue-700">{percentualAnual.toFixed(1)}%</span>
        </div>
      </div>
      {/* Gráfico de linha de vendas sobe e desce */}
      <div className="bg-white border rounded-lg p-4 shadow-sm mb-4">
        <div className="text-base font-semibold mb-2">Evolução das Vendas no Ano</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={dadosLinhaVendas} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="mes" stroke="#888" fontSize={13} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={13} tickFormatter={v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} axisLine={false} tickLine={false} />
            <Tooltip formatter={v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
            <Line type="monotone" dataKey="Vendido" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Gráfico de barras Vendas x Meta por mês */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="text-base font-semibold mb-2">Vendas x Meta por mês</div>
        <div className="w-full" style={{ minHeight: 220, height: '30vw', maxHeight: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap={20}>
              <defs>
                <linearGradient id="barVendido" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="barMeta" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a21caf" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="mes" stroke="#888" fontSize={13} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={13} tickFormatter={v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="Vendido" name="Vendido" fill="url(#barVendido)" radius={[8, 8, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Meta" name="Meta" fill="url(#barMeta)" radius={[8, 8, 0, 0]} maxBarSize={32} />
              <ReferenceLine y={metaAnual / 12} stroke="#a21caf" strokeDasharray="3 3" label={{ value: 'Média Meta', position: 'top', fill: '#a21caf', fontSize: 11 }} ifOverflow="extendDomain" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Tabela de Metas Mensais estilizada */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="text-base font-bold mb-2 font-display text-slate-700">Resumo do Ano</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm font-sans">
            <thead>
              <tr className="text-slate-600 text-base border-b">
                <th className="px-3 py-2 text-left font-bold">Mês</th>
                <th className="px-3 py-2 text-left font-bold">Meta</th>
                <th className="px-3 py-2 text-left font-bold">Vendido</th>
                <th className="px-3 py-2 text-left font-bold">Recebido</th>
                <th className="px-3 py-2 text-left font-bold">Pendente</th>
                <th className="px-3 py-2 text-left font-bold">% Atingido</th>
                <th className="px-3 py-2 text-left font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {metasMensais.map((m, idx) => (
                <tr key={m.mes} className={idx % 2 === 0 ? 'bg-slate-50' : ''}>
                  <td className="px-3 py-2 font-semibold text-slate-700 text-base">{m.nome}</td>
                  <td className="px-3 py-2 text-blue-900 font-bold text-base">{m.meta !== null ? m.meta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : <span className="text-slate-400 font-normal">-</span>}</td>
                  <td className="px-3 py-2 text-blue-700 font-bold text-base">{m.vendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-3 py-2 text-green-700 font-bold text-base">{recebimentosPorMes[m.mes]?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</td>
                  <td className="px-3 py-2 text-yellow-700 font-bold text-base">{aReceberPorMes[m.mes]?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</td>
                  <td className="px-3 py-2 text-purple-700 font-bold text-base">{m.meta !== null && m.meta > 0 ? `${m.percentual.toFixed(1)}%` : '-'}</td>
                  <td className="px-3 py-2">
                    {m.meta === null ? (
                      <span className="text-slate-400 text-lg font-semibold">Sem meta</span>
                    ) : m.percentual >= 100 ? (
                      <span className="text-green-600 text-2xl font-bold">🟢</span>
                    ) : m.percentual >= 70 ? (
                      <span className="text-yellow-600 text-2xl font-bold">🟡</span>
                    ) : (
                      <span className="text-red-600 text-2xl font-bold">🔴</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Adicionar tipagem para o CustomTooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-md p-2 text-xs">
        <div className="font-semibold mb-1">{label}</div>
        <div><span className="text-blue-700 font-bold">Vendido:</span> {payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        <div><span className="text-purple-700 font-bold">Meta:</span> {payload[1].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      </div>
    );
  }
  return null;
};

const barGradient = (
  <defs>
    <linearGradient id="barVendido" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7} />
    </linearGradient>
    <linearGradient id="barMeta" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#a21caf" stopOpacity={0.9} />
      <stop offset="100%" stopColor="#f472b6" stopOpacity={0.7} />
    </linearGradient>
  </defs>
);

const Comissoes = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [tab, setTab] = useState("todas");
  const [filtro, setFiltro] = useState("");
  const [periodo, setPeriodo] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [metaDialogOpen, setMetaDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [comissaoParaEditar, setComissaoParaEditar] = useState<Comissao | null>(null);
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(hoje.getMonth());
  
  // Estados para as métricas 
  const [totaisRecebimentos, setTotaisRecebimentos] = useState({
    totalRecebido: 0,
    totalPendente: 0,
    atingidoPercentual: 0
  });
  
  const { 
    comissoes, 
    metaComissao,
    isLoading,
    adicionarComissao, 
    atualizarComissao,
    marcarComoPago,
    excluirComissao,
    atualizarMeta,
    filtrarComissoes,
    totais,
    mesAtual,
    anoAtual,
    alterarPeriodoAtual,
    obterNomeMes,
    getRecebimentosByComissaoId,
    adicionarRecebimento,
    calcularTotais,
    getTotalRecebidoPorMesAno,
  } = useComissoes();

  const [metaAnual, setMetaAnual] = useState(0);
  const [mediaMensalAtingida, setMediaMensalAtingida] = useState(0);
  const [percentualAtingidoAnual, setPercentualAtingidoAnual] = useState(0);
  const [iconeAtingido, setIconeAtingido] = useState(<CheckCircle className="w-5 h-5 text-green-500" />);
  const [corAtingido, setCorAtingido] = useState("text-green-600");

  const [mesesComMeta, setMesesComMeta] = useState<Set<number>>(new Set());

  // Adicionar cálculo de recebidos e a receber por mês
  const [recebimentosPorMes, setRecebimentosPorMes] = useState<{ [mes: number]: number }>({});
  const [aReceberPorMes, setAReceberPorMes] = useState<{ [mes: number]: number }>({});

  const [order, setOrder] = useState('az');

  const [groupByDay, setGroupByDay] = useState(false);
  const [hojeAtivo, setHojeAtivo] = useState(false);

  // Adicionar estados para filtro por data inicial e final
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  // Limites de datas para os inputs
  let minData = '';
  let maxData = '';
  if (mesSelecionado !== null) {
    // Modo mês: limitar ao mês selecionado
    const ano = anoAtual;
    const mes = mesSelecionado + 1;
    minData = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const ultimoDia = new Date(ano, mes, 0).getDate();
    maxData = `${ano}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;
  } else {
    // Modo anual: qualquer dia do ano
    minData = `${anoAtual}-01-01`;
    maxData = `${anoAtual}-12-31`;
  }

  // Botão Hoje: filtra por dataVenda igual ao dia atual
  const hojeISO = new Date().toISOString().slice(0, 10);

  // Comissões exibidas considerando busca, filtro, ordenação, hoje e agrupamento
  const comissoesExibidas = useMemo(() => {
    let lista = [...comissoes];
    // Primeiro filtro: modo mensal ou anual
    if (mesSelecionado !== null) {
      // Modo mensal: só comissões do mês/ano selecionado
      lista = lista.filter(c => {
        if (!c.dataVenda) return false;
        const data = new Date(c.dataVenda);
        return data.getFullYear() === anoAtual && data.getMonth() === mesSelecionado;
      });
    } else {
      // Modo anual: só do ano atual
      lista = lista.filter(c => {
        if (!c.dataVenda) return false;
        const data = new Date(c.dataVenda);
        return data.getFullYear() === anoAtual;
      });
    }
    // Depois aplica os outros filtros normalmente
    if (tab === "todas") {
      // nada
    } else if (tab === "pendentes") {
      lista = lista.filter(c => {
        const status = c.status?.toLowerCase();
        return status === "pendente" || status === "parcial";
      });
    } else if (tab === "recebidas") {
      lista = lista.filter(c => c.status?.toLowerCase() === "recebido");
    }
    // Filtro HOJE
    if (hojeAtivo) {
      lista = lista.filter(c => c.dataVenda && c.dataVenda === hojeISO);
    }
    // Busca inteligente + filtro por dataVenda
    lista = lista.filter(c => {
      if (!filtro && !dataInicial && !dataFinal) return true;
      const texto = filtro.toLowerCase();
      // Busca por nome
      if (c.cliente?.toLowerCase().includes(texto)) return true;
      // Busca por imóvel
      if (c.imovel?.toLowerCase().includes(texto)) return true;
      // Busca por valor
      if (String(c.valorVenda).includes(texto) || String(c.valorComissaoCorretor).includes(texto)) return true;
      // Busca por data (dd/mm/yyyy)
      if (c.dataVenda && c.dataVenda.split('-').reverse().join('/').includes(texto)) return true;
      // Busca por status
      if (c.status?.toLowerCase().includes(texto)) return true;
      // Filtro por data inicial/final
      if (dataInicial && c.dataVenda < dataInicial) return false;
      if (dataFinal && c.dataVenda > dataFinal) return false;
      return !filtro;
    });
    // Ordenação A-Z/Z-A por nome do cliente
    lista.sort((a, b) => {
      if (!a.cliente || !b.cliente) return 0;
      if (order === 'az') return a.cliente.localeCompare(b.cliente);
      return b.cliente.localeCompare(a.cliente);
    });
    return lista;
  }, [comissoes, tab, order, filtro, hojeAtivo, dataInicial, dataFinal, mesSelecionado, anoAtual]);

  // Calcular recebimentos para os cards e classificar comissões
  useEffect(() => {
    async function calcularTotaisRecebimentos() {
      let totalRecebido = 0;
      if (mesSelecionado !== null) {
        totalRecebido = await getTotalRecebidoPorMesAno(mesSelecionado + 1, anoAtual);
      } else {
        let soma = 0;
        for (let mes = 1; mes <= 12; mes++) {
          soma += await getTotalRecebidoPorMesAno(mes, anoAtual);
        }
        totalRecebido = soma;
      }

      // Novo cálculo do total pendente considerando apenas recebimentos do mês selecionado
      let totalPendente = 0;
      const pendentesOuParciais = comissoesExibidas.filter(c => {
        const status = c.status?.toLowerCase();
        return status === "pendente" || status === "parcial";
      });

      for (const comissao of pendentesOuParciais) {
        const recebimentos = await getRecebimentosByComissaoId(comissao.id);
        let totalRecebidoNoMes = 0;
        if (mesSelecionado !== null) {
          // Filtra recebimentos do mês/ano selecionado
          const recebimentosDoMes = recebimentos.filter(r => {
            if (!r.data) return false;
            const [yyyy, mm] = r.data.split('-');
            return parseInt(yyyy) === anoAtual && parseInt(mm) === (mesSelecionado + 1);
          });
          totalRecebidoNoMes = recebimentosDoMes.reduce((acc, r) => acc + Number(r.valor || 0), 0);
        } else {
          // Todos os meses: soma todos os recebimentos
          totalRecebidoNoMes = recebimentos.reduce((acc, r) => acc + Number(r.valor || 0), 0);
        }
        totalPendente += Math.max((comissao.valorComissaoCorretor || 0) - totalRecebidoNoMes, 0);
      }

      // Cálculo do total de vendas para o percentual atingido
      const totalVendas = comissoesExibidas.reduce((acc, c) => acc + (c.valorVenda || 0), 0);
      const atingidoPercentual = metaComissao > 0 ? (totalVendas / metaComissao) * 100 : 0;
      setTotaisRecebimentos({
        totalRecebido,
        totalPendente,
        atingidoPercentual
      });
    }
    calcularTotaisRecebimentos();
    // eslint-disable-next-line
  }, [comissoesExibidas, metaComissao, mesSelecionado, anoAtual]);

  // Identifica os meses que têm comissão ou meta no ano atual
  const mesesComComissao = useMemo(() => {
    const set = new Set<number>();
    comissoes.forEach(c => {
      const data = new Date(c.dataVenda);
      if (data.getFullYear() === anoAtual) {
        set.add(data.getMonth());
      }
    });
    // Adiciona os meses que têm meta
    mesesComMeta.forEach(mes => set.add(mes));
    return set;
  }, [comissoes, anoAtual, mesesComMeta]);

  // Atualiza o período atual quando o mês selecionado muda
  useEffect(() => {
    if (mesSelecionado !== null) {
      alterarPeriodoAtual(mesSelecionado + 1, anoAtual);
    }
  }, [mesSelecionado, anoAtual, alterarPeriodoAtual]);

  useEffect(() => {
    async function calcularMetasAnuais() {
      // Só calcula se filtro for Anual (mesSelecionado === null)
      if (mesSelecionado !== null) return;
      // Buscar todas as metas do ano para o usuário logado
      const { data: metas, error } = await supabase
        .from('metas')
        .select('valor')
        .eq('ano', anoAtual)
        .eq('user_id', user.id);
      const metaAnual = (metas || []).reduce((acc, m) => acc + Number(m.valor || 0), 0);
      setMetaAnual(metaAnual);
      // Total vendido no ano
      const totalVendasAno = comissoes
        .filter(c => c.dataVenda && new Date(c.dataVenda).getFullYear() === anoAtual)
        .reduce((acc, c) => acc + (c.valorVenda || 0), 0);
      // Média mensal (só meses com meta cadastrada)
      const mesesComMeta = metas ? metas.length : 0;
      const mediaMensal = mesesComMeta > 0 ? totalVendasAno / mesesComMeta : 0;
      setMediaMensalAtingida(mediaMensal);
      // Percentual atingido
      const percentualAtingido = metaAnual > 0 ? (totalVendasAno / metaAnual) * 100 : 0;
      setPercentualAtingidoAnual(percentualAtingido);
      // Ícone/cor conforme desempenho
      if (percentualAtingido >= 100) {
        setIconeAtingido(<CheckCircle className="w-5 h-5 text-green-500" />);
        setCorAtingido("text-green-600");
      } else if (percentualAtingido >= 70) {
        setIconeAtingido(<AlertTriangle className="w-5 h-5 text-yellow-500" />);
        setCorAtingido("text-yellow-600");
      } else {
        setIconeAtingido(<XCircle className="w-5 h-5 text-red-500" />);
        setCorAtingido("text-red-600");
      }
    }
    calcularMetasAnuais();
    // eslint-disable-next-line
  }, [mesSelecionado, anoAtual, user, comissoes]);

  // Buscar metas do ano atual (já existe, mas agora vamos guardar o array de metas)
  const [metasAno, setMetasAno] = useState<any[]>([]);
  useEffect(() => {
    async function buscarMetasAno() {
      if (!user) return;
      const { data: metas, error } = await supabase
        .from('metas')
        .select('mes, valor')
        .eq('ano', anoAtual)
        .eq('user_id', user.id);
      if (error) {
        console.error("Erro ao buscar metas:", error);
        return;
      }
      setMetasAno(metas || []);
      const mesesComMetaSet = new Set<number>();
      metas?.forEach(meta => {
        mesesComMetaSet.add(meta.mes - 1);
      });
      setMesesComMeta(mesesComMetaSet);
    }
    buscarMetasAno();
  }, [anoAtual, user]);

  // Função para gerar anos disponíveis a partir dos dados
  const anosDisponiveis = useMemo(() => {
    const anosSet = new Set<number>();
    comissoes.forEach(c => {
      if (c.dataVenda) {
        anosSet.add(new Date(c.dataVenda).getFullYear());
      }
    });
    metasAno.forEach(m => {
      if (m.ano) anosSet.add(m.ano);
    });
    return Array.from(anosSet).sort((a, b) => a - b);
  }, [comissoes, metasAno]);

  useEffect(() => {
    async function calcularRecebimentosMesAno() {
      const recMes: { [mes: number]: number } = {};
      const pendMes: { [mes: number]: number } = {};
      for (let i = 0; i < 12; i++) {
        // Recebido: soma de todos os recebimentos do mês/ano
        let recebido = 0;
        let aReceber = 0;
        // Filtra comissões do mês/ano
        const comissoesMes = comissoes.filter(c => {
          if (!c.dataVenda) return false;
          const data = new Date(c.dataVenda);
          return data.getFullYear() === anoAtual && data.getMonth() === i;
        });
        for (const c of comissoesMes) {
          const recebimentos = await getRecebimentosByComissaoId(c.id);
          // Recebido no mês: recebimentos cuja data é do mês/ano
          const recebidosNoMes = recebimentos.filter(r => {
            if (!r.data) return false;
            const [yyyy, mm] = r.data.split('-');
            return parseInt(yyyy) === anoAtual && parseInt(mm) === i + 1;
          });
          recebido += recebidosNoMes.reduce((acc, r) => acc + Number(r.valor || 0), 0);
          // A receber: se pendente/parcial, soma o que falta
          if (c.status?.toLowerCase() === 'pendente' || c.status?.toLowerCase() === 'parcial') {
            const totalRecebido = recebimentos.reduce((acc, r) => acc + Number(r.valor || 0), 0);
            aReceber += Math.max((c.valorComissaoCorretor || 0) - totalRecebido, 0);
          }
        }
        recMes[i] = recebido;
        pendMes[i] = aReceber;
      }
      setRecebimentosPorMes(recMes);
      setAReceberPorMes(pendMes);
    }
    calcularRecebimentosMesAno();
    // eslint-disable-next-line
  }, [comissoes, anoAtual, getRecebimentosByComissaoId]);

  const handleExportarRelatorio = () => {
    setExportDialogOpen(true);
  };
  
  const handleAdicionarOuAtualizarComissao = (comissao: Partial<Comissao>) => {
    if (comissaoParaEditar) {
      // Editar comissão existente
      atualizarComissao(comissaoParaEditar.id, comissao);
      setComissaoParaEditar(null);
    } else if (comissao.dataContrato && typeof comissao.dataContrato === 'string' && comissao.dataContrato.includes('-')) {
      // Se enviou no formato mes-ano (para meta mensal)
      const [mes, ano] = comissao.dataContrato.split('-').map(Number);
      atualizarMeta(comissao.valorComissaoCorretor || 0, mes, ano);
    } else {
      // Adicionar nova comissão
      const novaComissao: Omit<Comissao, "id" | "createdAt" | "updatedAt"> = {
        vendaId: comissao.vendaId || "",
        cliente: comissao.cliente || "",
        imovel: comissao.imovel || "",
        valorVenda: comissao.valorVenda || 0,
        valorComissaoImobiliaria: comissao.valorComissaoImobiliaria || 0,
        valorComissaoCorretor: comissao.valorComissaoCorretor || 0,
        dataContrato: comissao.dataContrato || new Date().toISOString(),
        dataVenda: comissao.dataVenda || new Date().toISOString(),
        dataPagamento: comissao.dataPagamento || null,
        status: comissao.status || "Pendente",
        valorOriginalVenda: comissao.valorOriginalVenda,
        valorAtualVenda: comissao.valorAtualVenda,
        diferencaValor: comissao.diferencaValor,
        statusValor: comissao.statusValor || "Atualizado",
        justificativa: comissao.justificativa
      };
      adicionarComissao(novaComissao);
    }
  };
  
  const handleEditarComissao = (comissao: Comissao) => {
    setComissaoParaEditar(comissao);
    setDialogOpen(true);
  };
  
  const handleExcluirComissao = (id: string) => {
    excluirComissao(id);
  };
  
  const gerarAnos = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = anoAtual - 2; i <= anoAtual + 2; i++) {
      anos.push(i);
    }
    return anos;
  };

  // Função para limpar todos os filtros
  function limparFiltros() {
    setFiltro('');
    setDataInicial('');
    setDataFinal('');
    setHojeAtivo(false);
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Comissões</h2>
          <p className="text-slate-500">Gerencie suas comissões de vendas imobiliárias.</p>
        </div>
        <div className="flex gap-2">
          {mesSelecionado !== null && (
            <Button variant="outline" onClick={() => setMetaDialogOpen(true)}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Definir Meta
            </Button>
          )}
          <Button variant="outline" onClick={handleExportarRelatorio}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          {mesSelecionado !== null && (
            <Button onClick={() => {
              setComissaoParaEditar(null);
              setDialogOpen(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Comissão
            </Button>
          )}
        </div>
      </div>
      
      {/* Seletor de ano */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-1/4">
          <Label htmlFor="anoSelect" className="text-sm font-medium mb-2 block">Ano</Label>
          <Select
            value={String(anoAtual)}
            onValueChange={value => alterarPeriodoAtual(mesAtual, parseInt(value))}
          >
            <SelectTrigger id="anoSelect" className="w-full">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {anosDisponiveis.map(ano => (
                <SelectItem key={ano} value={String(ano)}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full">
          <div className="flex gap-1 mb-2 flex-wrap">
            {meses.map((nome, idx) => (
              <button
                key={idx}
                disabled={!mesesComComissao.has(idx)}
                className={`px-3 py-1 rounded text-sm border ${
                  idx === mesSelecionado 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-100 text-slate-700'
                } ${
                  !mesesComComissao.has(idx) 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:bg-blue-100'
                } ${
                  mesesComMeta.has(idx) 
                    ? 'border-green-500 font-medium' 
                    : ''
                }`}
                onClick={() => setMesSelecionado(idx !== mesSelecionado ? idx : null)}
              >
                {nome}
                {mesesComMeta.has(idx) && (
                  <span className="ml-1 text-green-500">•</span>
                )}
              </button>
            ))}
            {/* Botão para limpar filtro de mês */}
            <button
              className={`px-3 py-1 rounded text-sm border bg-slate-50 text-slate-500 ml-2 ${mesSelecionado === null ? 'font-bold underline' : ''}`}
              onClick={() => setMesSelecionado(null)}
            >
              Anual
            </button>
          </div>
        </div>
      </div>

      {/* Meta atual */}
      {mesSelecionado !== null && (
        <Card className="border-2 border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium">Meta de venda de {obterNomeMes(mesAtual)} de {anoAtual}</h3>
                <p className="text-slate-600">
                  {metaComissao ? 
                    `Meta definida: ${metaComissao.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}` : 
                    'Nenhuma meta de venda definida para este mês'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm text-slate-500">Progresso</div>
                  <div className="font-bold text-lg">{totaisRecebimentos.atingidoPercentual.toFixed(1)}%</div>
                </div>
                <div className="w-32 h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${totaisRecebimentos.atingidoPercentual >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(totaisRecebimentos.atingidoPercentual, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exibe o resumo anual apenas se estiver na visão anual */}
      {mesSelecionado === null && (
        <ResumoAnualComissoes ano={anoAtual} comissoes={comissoes} metasAno={metasAno} recebimentosPorMes={recebimentosPorMes} aReceberPorMes={aReceberPorMes} />
      )}

      {/* Cards de resumo */}
      {mesSelecionado !== null && (
        <ComissoesSummary
          totalComissoes={comissoesExibidas.reduce((acc, c) => acc + (c.valorComissaoCorretor || 0), 0)}
          totalCount={comissoesExibidas.length}
          totalRecebido={totaisRecebimentos.totalRecebido}
          recebidoCount={comissoesExibidas.filter(c => c.status?.toLowerCase() === "recebido").length}
          totalPendente={totaisRecebimentos.totalPendente}
          pendenteCount={comissoesExibidas.filter(c => {
            const status = c.status?.toLowerCase();
            return status === "pendente" || status === "parcial";
          }).length}
          metaComissao={metaComissao}
          atingidoPercentual={totaisRecebimentos.atingidoPercentual}
          labelMeta="Meta de venda"
          totalVendas={comissoesExibidas.reduce((acc, c) => acc + (c.valorVenda || 0), 0)}
          totalVendasCount={comissoesExibidas.length}
        />
      )}

      {/* Filtros e tabela */}
      <Tabs defaultValue="todas" value={tab}>
        <ComissoesFilter 
          tab={tab}
          onTabChange={setTab}
          filtro={filtro}
          onFiltroChange={setFiltro}
          periodo={periodo}
          onPeriodoChange={setPeriodo}
          order={order}
          onOrderChange={setOrder}
          showPeriodo={mesSelecionado === null}
          groupByDay={mesSelecionado === null ? groupByDay : undefined}
          onGroupByDayChange={mesSelecionado === null ? setGroupByDay : undefined}
          onHojeClick={() => setHojeAtivo(h => !h)}
          dataInicial={dataInicial}
          dataFinal={dataFinal}
          onDataInicialChange={setDataInicial}
          onDataFinalChange={setDataFinal}
          minData={minData}
          maxData={maxData}
          onLimparFiltros={limparFiltros}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : comissoes.length === 0 ? (
          <div className="text-center p-8 border rounded-md bg-slate-50">
            <p className="text-slate-500 mb-2">Nenhuma comissão encontrada</p>
            <Button onClick={() => {
              setComissaoParaEditar(null);
              setDialogOpen(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Comissão
            </Button>
          </div>
        ) :
          <>
            <TabsContent value="todas" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  {/* Agrupamento por dia se mês selecionado */}
                  {mesSelecionado !== null ? (
                    comissoesExibidas.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">Nenhuma comissão neste mês</div>
                    ) : (
                      <ComissaoTable 
                        comissoes={comissoesExibidas}
                        onMarcarPago={marcarComoPago}
                        onEditar={handleEditarComissao}
                        onExcluir={handleExcluirComissao}
                        showHeader={true}
                      />
                    )
                  ) : (
                    <ComissaoTable 
                      comissoes={comissoesExibidas}
                      onMarcarPago={marcarComoPago}
                      onEditar={handleEditarComissao}
                      onExcluir={handleExcluirComissao}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pendentes" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <ComissaoTable 
                    comissoes={comissoesExibidas}
                    onMarcarPago={marcarComoPago}
                    onEditar={handleEditarComissao}
                    onExcluir={handleExcluirComissao}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recebidas" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <ComissaoTable 
                    comissoes={comissoesExibidas}
                    showActions={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        }
      </Tabs>

      {/* Forms modais */}
      <ComissaoForm 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onAddComissao={handleAdicionarOuAtualizarComissao}
        comissaoParaEditar={comissaoParaEditar} 
      />

      <ComissaoForm 
        open={metaDialogOpen} 
        onOpenChange={setMetaDialogOpen}
        onAddComissao={handleAdicionarOuAtualizarComissao}
        isMetaForm={true}
        currentMeta={metaComissao}
      />

      <ExportDialog 
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        comissoesParaExportar={comissoesExibidas}
      />
    </div>
  );
};

export default Comissoes;
