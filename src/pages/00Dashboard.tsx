import { useState, useEffect } from "react";
import { 
  Users, 
  Calendar, 
  CalendarCheck, 
  CalendarClock,
  ChartBar
} from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import AniversariantesCard from "@/components/AniversariantesCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useClientes } from "@/hooks/useClientes";
import { useVendas } from "@/hooks/useVendas"; 
import { useDashboardData } from "@/hooks/useDashboardData";
import { addMonths, format, isWithinInterval, parseISO, setMonth, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { filtrarAniversariantesPorPeriodo, filtrarAniversariantesDoMes, filtrarAniversariantesHoje } from "@/lib/utils";

// Cores para o gráfico de pizza
const CORES = [
  "#8B5CF6", "#EC4899", "#F97316", "#6366F1", "#10B981", 
  "#06B6D4", "#0EA5E9", "#3B82F6", "#8B5CF6", "#EC4899", 
  "#F97316", "#6366F1"
];

// Função para label customizado do PieChart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  if (!value || value === 0) return null; // Não mostra label para fatias zeradas
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#222"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={16}
      fontWeight={600}
      style={{ textShadow: "0 1px 2px #fff" }}
    >
      {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const Dashboard = () => {
  const { dashboardData, isLoading } = useDashboardData();
  const { clientes } = useClientes();
  const { vendas, formatarMoeda } = useVendas();
  const [vendasPorMes, setVendasPorMes] = useState([]);
  const [aniversariantesPorMes, setAniversariantesPorMes] = useState([]);
  
  // NOVO: aniversariantes dos próximos 7 e 30 dias usando lógica centralizada
  const aniversariantes7Dias = filtrarAniversariantesPorPeriodo(clientes, 7).filter(a => a.diasAte > 0);
  // Mês seguinte (UTC)
  const mesSeguinte = (new Date().getUTCMonth() + 1) % 12;
  const aniversariantesProximoMes = filtrarAniversariantesDoMes(clientes, mesSeguinte);
  const aniversariantesHoje = filtrarAniversariantesHoje(clientes);

  useEffect(() => {
    // Gerar dados de vendas por mês baseados nas vendas reais
    if (vendas.length >= 0) {
      const meses = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ];
      
      const hoje = new Date();
      const anoAtual = hoje.getFullYear();
      const anoAnterior = anoAtual - 1;
      
      const dadosVendas = meses.map((mes, index) => {
        // Filtrar vendas para o mês atual do ano atual
        const vendasMesAtual = vendas.filter(venda => {
          try {
            const dataVenda = parseISO(venda.dataVenda);
            return dataVenda.getMonth() === index && dataVenda.getFullYear() === anoAtual;
          } catch (e) {
            return false;
          }
        });
        
        // Filtrar vendas para o mesmo mês do ano anterior
        const vendasMesAnterior = vendas.filter(venda => {
          try {
            const dataVenda = parseISO(venda.dataVenda);
            return dataVenda.getMonth() === index && dataVenda.getFullYear() === anoAnterior;
          } catch (e) {
            return false;
          }
        });
        
        // Calcular valores
        const valorMesAtual = vendasMesAtual.reduce((total, venda) => total + venda.valor, 0);
        const valorMesAnterior = vendasMesAnterior.reduce((total, venda) => total + venda.valor, 0);
        
        return {
          name: mes,
          mesAtual: valorMesAtual,
          mesAnterior: valorMesAnterior
        };
      });
      
      setVendasPorMes(dadosVendas);
    }
    
    // Gerar distribuição de aniversariantes por mês baseada nos clientes reais
    if (clientes.length >= 0) {
      const meses = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ];
      const distribuicao = meses.map((mes, index) => {
        const quantidade = clientes.filter(cliente => {
          if (!cliente.dataNascimento) return false;
          let dataNascimentoObj;
          if (cliente.dataNascimento.includes('/')) {
            const partes = cliente.dataNascimento.split('/');
            if (partes.length === 3) {
              dataNascimentoObj = new Date(Date.UTC(
                parseInt(partes[2]),
                parseInt(partes[1]) - 1,
                parseInt(partes[0])
              ));
            }
          } else {
            const partes = cliente.dataNascimento.split('-');
            if (partes.length === 3) {
              dataNascimentoObj = new Date(Date.UTC(
                parseInt(partes[0]),
                parseInt(partes[1]) - 1,
                parseInt(partes[2])
              ));
            } else {
              dataNascimentoObj = new Date(cliente.dataNascimento);
            }
          }
          if (!dataNascimentoObj) return false;
          return dataNascimentoObj.getUTCMonth() === index;
        }).length;
        return {
          name: mes,
          value: quantidade > 0 ? quantidade : 0
        };
      });
      setAniversariantesPorMes(distribuicao);
    }
  }, [vendas, clientes]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Painel de Controle</h2>
          <p className="text-slate-500">Acompanhe aniversários de clientes e atividades recentes.</p>
        </div>
      </div>

      {/* Cards de métricas com cores diferentes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Clientes"
          value={dashboardData?.totalClientes || 0}
          description="Clientes cadastrados no sistema"
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <DashboardCard
          title="Aniversariantes Hoje"
          value={aniversariantesHoje.length}
          description="Clientes aniversariando hoje"
          icon={<CalendarCheck className="h-6 w-6" />}
          color="green"
        />
        <DashboardCard
          title="Próximos 7 dias"
          value={aniversariantes7Dias.length}
          description="Aniversários nos próximos 7 dias"
          icon={<Calendar className="h-6 w-6" />}
          color="purple"
        />
        <DashboardCard
          title="Próximo Mês"
          value={aniversariantesProximoMes.length}
          description={`Aniversários em ${mesSeguinte === 0 ? 'Janeiro' : mesSeguinte === 1 ? 'Fevereiro' : mesSeguinte === 2 ? 'Março' : mesSeguinte === 3 ? 'Abril' : mesSeguinte === 4 ? 'Maio' : mesSeguinte === 5 ? 'Junho' : mesSeguinte === 6 ? 'Julho' : mesSeguinte === 7 ? 'Agosto' : mesSeguinte === 8 ? 'Setembro' : mesSeguinte === 9 ? 'Outubro' : mesSeguinte === 10 ? 'Novembro' : 'Dezembro'}`}
          icon={<CalendarClock className="h-6 w-6" />}
          color="amber"
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="h-5 w-5" />
              Vendas Comparativas
            </CardTitle>
            <CardDescription>
              Comparação de vendas com o ano anterior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendasPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => {
                      return [
                        formatarMoeda(value), 
                        "Valor"
                      ];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="mesAnterior" name="Ano Anterior" fill="#9ca3af" />
                  <Bar dataKey="mesAtual" name="Ano Atual" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aniversariantes por Mês
            </CardTitle>
            <CardDescription>
              Distribuição de aniversários ao longo do ano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aniversariantesPorMes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {aniversariantesPorMes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => {
                      const percent = props && props.payload && props.payload.percent ? (props.payload.percent * 100).toFixed(0) : "";
                      return [`${value} aniversariantes (${percent}%)`, props.payload.name];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aniversariantes em destaque */}
      <div className="grid gap-6 md:grid-cols-2">
        <AniversariantesCard
          title="Aniversariantes da Semana"
          aniversariantes={dashboardData?.aniversariantesSemana || []}
        />

        <AniversariantesCard
          title="Aniversariantes do Mês"
          aniversariantes={dashboardData?.aniversariantesMes || []}
        />
      </div>
    </div>
  );
};

export default Dashboard;
