
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, CartesianGrid, LineChart, Line } from 'recharts';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, DollarSign, Clock, Target, Star } from "lucide-react";
import { formatarMoeda } from "@/lib/utils";

interface MetaMensal {
  mes: number;
  nome: string;
  meta: number | null;
  vendido: number;
  percentual: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface RelatorioAnualComissoesProps {
  ano: number;
  comissoes: any[];
  metasAno: any[];
  recebimentosPorMes: {[mes: number]: number};
  aReceberPorMes: {[mes: number]: number};
  usuario?: {
    nome: string;
  };
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

const mesesNomesCompletos = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const RelatorioAnualComissoes = ({ 
  ano, 
  comissoes, 
  metasAno, 
  recebimentosPorMes, 
  aReceberPorMes,
  usuario = { nome: "Corretor" }
}: RelatorioAnualComissoesProps) => {
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
  const metaAnual = metasAno.find(m => m.mes === 0)?.valor || metasAno.reduce((acc, m) => acc + (m.valor || 0), 0);
  const percentualAnual = metaAnual > 0 ? (totalVendido / metaAnual) * 100 : 0;
  const mediaMensal = metasAno.filter(m => m.mes > 0).length > 0 ? totalVendido / metasAno.filter(m => m.mes > 0).length : 0;
  const melhorMes = metasMensais.reduce((max, m) => m.vendido > max.vendido ? m : max, { vendido: 0, nome: "" });

  // Dados para o gráfico
  const dadosGrafico = metasMensais.map(m => ({
    mes: m.nome,
    Vendido: m.vendido,
    Meta: m.meta || 0
  }));

  // Dados para o gráfico de linha de vendas
  const dadosLinhaVendas = metasMensais.map(m => ({ mes: m.nome, Vendido: m.vendido }));

  // Status geral com emoji
  let statusGeral = "";
  let corStatus = "";
  
  if (percentualAnual >= 110) {
    statusGeral = "🚀 Meta Ultrapassada";
    corStatus = "text-blue-700";
  } else if (percentualAnual >= 100) {
    statusGeral = "✅ Meta Atingida";
    corStatus = "text-green-700";
  } else if (percentualAnual >= 90) {
    statusGeral = "🟡 Próximo da Meta";
    corStatus = "text-yellow-700";
  } else {
    statusGeral = "❌ Abaixo da Meta";
    corStatus = "text-red-700";
  }

  // Formatar diferença
  const diferenca = totalVendido - metaAnual;
  const diferencaFormatada = diferenca > 0 
    ? `+${formatarMoeda(diferenca)}` 
    : formatarMoeda(diferenca);
  const corDiferenca = diferenca >= 0 ? "text-green-700" : "text-red-700";

  return (
    <div className="space-y-6 mb-6">
      {/* Cabeçalho do relatório */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Relatório de Meta Anual de Comissão
            </h2>
            <p className="text-sm text-slate-600">
              {usuario.nome} | Ano: {ano}
            </p>
          </div>
          <div className={`${corStatus} font-bold text-lg flex items-center mt-2 lg:mt-0`}>
            {statusGeral}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Meta Anual</span>
            <span className="text-xl font-bold text-blue-700 block">{formatarMoeda(metaAnual)}</span>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Comissão Recebida</span>
            <span className="text-xl font-bold text-green-700 block">{formatarMoeda(totalRecebido)}</span>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Percentual Alcançado</span>
            <span className="text-xl font-bold text-purple-700 block">{percentualAnual.toFixed(1)}%</span>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Diferença</span>
            <span className={`text-xl font-bold ${corDiferenca} block`}>{diferencaFormatada}</span>
          </div>
        </div>
      </div>

      {/* Cards coloridos e modernos de resumo geral */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        <div className="bg-gradient-to-br from-blue-200 to-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-blue-700 font-semibold uppercase text-xs mb-1">
            <TrendingUp className="w-5 h-5" /> Total vendido
          </div>
          <div className="text-3xl font-extrabold text-blue-900">{formatarMoeda(totalVendido)}</div>
        </div>
        <div className="bg-gradient-to-br from-green-200 to-green-50 border border-green-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-green-700 font-semibold uppercase text-xs mb-1">
            <CheckCircle className="w-5 h-5" /> Comissões recebidas
          </div>
          <div className="text-3xl font-extrabold text-green-900">{formatarMoeda(totalRecebido)}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-200 to-yellow-50 border border-yellow-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-yellow-700 font-semibold uppercase text-xs mb-1">
            <Clock className="w-5 h-5" /> Comissões pendentes
          </div>
          <div className="text-3xl font-extrabold text-yellow-900">{formatarMoeda(totalPendente)}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        <div className="bg-gradient-to-br from-purple-200 to-purple-50 border border-purple-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-purple-700 font-semibold uppercase text-xs mb-1">
            <Target className="w-5 h-5" /> Meta anual
          </div>
          <div className="text-3xl font-extrabold text-purple-900">{formatarMoeda(metaAnual)}</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-200 to-cyan-50 border border-cyan-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-cyan-700 font-semibold uppercase text-xs mb-1">
            <Star className="w-5 h-5" /> Média mensal
          </div>
          <div className="text-3xl font-extrabold text-cyan-900">{formatarMoeda(mediaMensal)}</div>
        </div>
        <div className="bg-gradient-to-br from-pink-200 to-pink-50 border border-pink-200 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-pink-700 font-semibold uppercase text-xs mb-1">
            <Star className="w-5 h-5" /> Melhor mês
          </div>
          <div className="text-3xl font-extrabold text-pink-900">{melhorMes.nome} ({formatarMoeda(melhorMes.vendido)})</div>
        </div>
      </div>

      {/* Barra de progresso da meta anual */}
      <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 mb-2">
        <div className="text-sm font-medium text-slate-700 mb-1">Percentual da meta anual atingido</div>
        <div className="flex items-center gap-2">
          <div className="flex-grow h-6 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full text-xs flex items-center justify-center text-white font-semibold ${
                percentualAnual >= 110 ? "bg-blue-600" : 
                percentualAnual >= 100 ? "bg-green-600" : 
                percentualAnual >= 90 ? "bg-yellow-500" : 
                "bg-red-500"
              }`} 
              style={{ width: `${Math.min(percentualAnual, 100)}%` }}
            >
              {percentualAnual >= 25 ? `${percentualAnual.toFixed(1)}%` : ""}
            </div>
          </div>
          {percentualAnual < 25 && <span className="font-bold">{percentualAnual.toFixed(1)}%</span>}
        </div>
      </div>

      {/* Gráfico de linha de vendas sobe e desce */}
      <div className="bg-white border rounded-lg p-5 shadow-sm mb-4">
        <div className="text-base font-semibold mb-4">Evolução das Vendas no Ano</div>
        <div className="w-full" style={{ height: "220px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosLinhaVendas} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVendido" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="mes" stroke="#888" fontSize={13} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={13} tickFormatter={v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 })} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
              <Line 
                type="monotone" 
                dataKey="Vendido" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ r: 5, strokeWidth: 1, fill: '#2563eb' }} 
                activeDot={{ r: 7 }} 
                fillOpacity={1} 
                fill="url(#colorVendido)" 
              />
              {metaAnual > 0 && (
                <ReferenceLine 
                  y={metaAnual / 12} 
                  stroke="#a21caf" 
                  strokeDasharray="3 3" 
                  label={{ value: 'Meta Mensal Média', position: 'left', fill: '#a21caf', fontSize: 12 }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de barras Vendas x Meta por mês */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <div className="text-base font-semibold mb-4">Vendas x Meta por mês</div>
        <div className="w-full" style={{ height: "300px" }}>
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
              <YAxis stroke="#888" fontSize={13} tickFormatter={v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 })} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="Vendido" name="Vendido" fill="url(#barVendido)" radius={[8, 8, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Meta" name="Meta" fill="url(#barMeta)" radius={[8, 8, 0, 0]} maxBarSize={32} />
              {metaAnual > 0 && (
                <ReferenceLine 
                  y={metaAnual / 12} 
                  stroke="#a21caf" 
                  strokeDasharray="3 3" 
                  label={{ value: 'Média Meta', position: 'top', fill: '#a21caf', fontSize: 11 }}
                  ifOverflow="extendDomain" 
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Metas Mensais estilizada */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="text-base font-bold mb-4 text-slate-700">Resumo do Ano</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-slate-600 text-xs uppercase tracking-wider border-b">
                <th className="px-3 py-3 text-left font-bold">Mês</th>
                <th className="px-3 py-3 text-right font-bold">Meta</th>
                <th className="px-3 py-3 text-right font-bold">Vendido</th>
                <th className="px-3 py-3 text-right font-bold">Recebido</th>
                <th className="px-3 py-3 text-right font-bold">Pendente</th>
                <th className="px-3 py-3 text-right font-bold">% Atingido</th>
                <th className="px-3 py-3 text-center font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {metasMensais.map((m, idx) => (
                <tr key={m.mes} className={idx % 2 === 0 ? 'bg-slate-50' : ''}>
                  <td className="px-3 py-3 font-medium text-slate-700">{m.nome}</td>
                  <td className="px-3 py-3 text-blue-900 font-bold text-right">
                    {m.meta !== null ? formatarMoeda(m.meta) : <span className="text-slate-400 font-normal">-</span>}
                  </td>
                  <td className="px-3 py-3 text-blue-700 font-bold text-right">{formatarMoeda(m.vendido)}</td>
                  <td className="px-3 py-3 text-green-700 font-bold text-right">
                    {recebimentosPorMes[m.mes] ? formatarMoeda(recebimentosPorMes[m.mes]) : '-'}
                  </td>
                  <td className="px-3 py-3 text-yellow-700 font-bold text-right">
                    {aReceberPorMes[m.mes] ? formatarMoeda(aReceberPorMes[m.mes]) : '-'}
                  </td>
                  <td className="px-3 py-3 text-purple-700 font-bold text-right">
                    {m.meta !== null && m.meta > 0 ? `${m.percentual.toFixed(1)}%` : '-'}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {m.meta === null ? (
                      <span className="text-xs bg-slate-100 text-slate-500 py-1 px-2 rounded-full">Sem meta</span>
                    ) : m.percentual >= 110 ? (
                      <span className="text-xs bg-blue-100 text-blue-700 py-1 px-2 rounded-full">Ultrapassada</span>
                    ) : m.percentual >= 100 ? (
                      <span className="text-xs bg-green-100 text-green-700 py-1 px-2 rounded-full">Atingida</span>
                    ) : m.percentual >= 90 ? (
                      <span className="text-xs bg-yellow-100 text-yellow-700 py-1 px-2 rounded-full">Próximo</span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-700 py-1 px-2 rounded-full">Abaixo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 bg-slate-50">
              <tr>
                <td className="px-3 py-3 font-bold text-slate-800">Total Anual</td>
                <td className="px-3 py-3 font-bold text-blue-900 text-right">{formatarMoeda(metaAnual)}</td>
                <td className="px-3 py-3 font-bold text-blue-700 text-right">{formatarMoeda(totalVendido)}</td>
                <td className="px-3 py-3 font-bold text-green-700 text-right">{formatarMoeda(totalRecebido)}</td>
                <td className="px-3 py-3 font-bold text-yellow-700 text-right">{formatarMoeda(totalPendente)}</td>
                <td className="px-3 py-3 font-bold text-purple-700 text-right">{percentualAnual.toFixed(1)}%</td>
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm font-bold ${corStatus}`}>
                    {statusGeral.split(' ')[0]}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RelatorioAnualComissoes;
