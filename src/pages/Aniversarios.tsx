import { useState } from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import AniversariantesTable from "@/components/AniversariantesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Info } from "lucide-react";
import { format, addMonths, subMonths, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useClientes } from "@/hooks/useClientes";
import { filtrarAniversariantesPorPeriodo, filtrarAniversariantesHoje } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useVendas } from "@/hooks/useVendas";

const Aniversarios = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState("hoje");
  const [mesAtual, setMesAtual] = useState(new Date());
  const { clientes } = useClientes();
  const { vendas } = useVendas ? useVendas() : { vendas: [] };
  
  const agruparPorMes = () => {
    const grupos: Record<number, any[]> = {};
    const anoReferencia = mesAtual.getUTCFullYear();
    const mesReferencia = mesAtual.getUTCMonth();
    const hojeUTC = new Date(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    ));
    clientes.forEach(cliente => {
      if (!cliente.dataNascimento) return;
      let dataNascimentoObj;
      if (cliente.dataNascimento.includes('/')) {
        const partes = cliente.dataNascimento.split('/');
        if (partes.length === 3) {
          dataNascimentoObj = new Date(Date.UTC(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0])));
        }
      } else {
        const partes = cliente.dataNascimento.split('-');
        if (partes.length === 3) {
          dataNascimentoObj = new Date(Date.UTC(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2])));
        } else {
          dataNascimentoObj = new Date(cliente.dataNascimento); // Fallback
        }
      }
      if (!dataNascimentoObj || !isValid(dataNascimentoObj)) return;
      const mes = dataNascimentoObj.getUTCMonth(); // Mês em UTC
      if (!grupos[mes]) {
        grupos[mes] = [];
      }
      // Calcular diasAte em relação ao mês/ano exibido
      const dataReferencia = new Date(Date.UTC(
        anoReferencia,
        mes,
        dataNascimentoObj.getUTCDate()
      ));
      const diasAte = Math.round((dataReferencia.getTime() - hojeUTC.getTime()) / (1000 * 60 * 60 * 24));
      grupos[mes].push({
        id: cliente.id,
        nome: cliente.nome,
        dataNascimento: cliente.dataNascimento,
        telefone: cliente.telefone,
        email: cliente.email,
        diasAte,
        clienteDesde: cliente.createdAt || "-",
        ultimaCompra: getUltimaCompra(cliente.id, vendas)
      });
    });
    return grupos;
  };

  const aniversariantesPorMes = agruparPorMes();
  const mesNumero = mesAtual.getMonth();
  const aniversariantesMesAtual = aniversariantesPorMes[mesNumero] || [];
  
  // Estado para o dia selecionado no calendário
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  
  // Dias com aniversariantes do mês atual
  const diasComAniversariantes = aniversariantesMesAtual.map(a => {
    let partes;
    if (a.dataNascimento.includes("/")) {
      partes = a.dataNascimento.split("/");
      return Number(partes[0]);
    } else {
      partes = a.dataNascimento.split("-");
      return Number(partes[2]);
    }
  });

  // Função para pegar aniversariantes do dia selecionado
  const aniversariantesDoDia = diaSelecionado
    ? aniversariantesMesAtual.filter(a => {
        let partes;
        let dia;
        if (a.dataNascimento.includes("/")) {
          partes = a.dataNascimento.split("/");
          dia = Number(partes[0]);
        } else {
          partes = a.dataNascimento.split("-");
          dia = Number(partes[2]);
        }
        return dia === diaSelecionado.getDate();
      })
    : [];

  // Filtros padronizados com a dashboard
  const aniversariantesSemana = filtrarAniversariantesPorPeriodo(clientes, 7)
    .filter(a => a.diasAte > 0)
    .map(a => ({
      ...a,
      clienteDesde: clientes.find(c => c.id === a.id)?.createdAt || "-",
      ultimaCompra: getUltimaCompra(a.id, vendas)
    }));
  const aniversariantesMes = filtrarAniversariantesPorPeriodo(clientes, 30)
    .filter(a => a.diasAte > 0)
    .map(a => ({
      ...a,
      clienteDesde: clientes.find(c => c.id === a.id)?.createdAt || "-",
      ultimaCompra: getUltimaCompra(a.id, vendas)
    }));
  const aniversariantesHoje = filtrarAniversariantesHoje(clientes)
    .map(a => ({
      ...a,
      clienteDesde: clientes.find(c => c.id === a.id)?.createdAt || "-",
      ultimaCompra: getUltimaCompra(a.id, vendas)
    }));

  const handleMesAnterior = () => {
    setMesAtual(mes => subMonths(mes, 1));
  };

  const handleProximoMes = () => {
    setMesAtual(mes => addMonths(mes, 1));
  };

  // Função utilitária para buscar a última compra do cliente
  function getUltimaCompra(clienteId: string, vendas: any[]): string {
    const vendasCliente = vendas
      ? vendas.filter((v: any) => v.clienteId === clienteId)
      : [];
    if (vendasCliente.length === 0) return "-";
    // Pega a venda mais recente
    const ultima = vendasCliente.reduce((a: any, b: any) =>
      new Date(a.dataVenda) > new Date(b.dataVenda) ? a : b
    );
    return ultima.dataVenda;
  }

  const mesesNomes = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const totalAniversariantes = clientes.filter(c => c.dataNascimento).length;
  const totalHoje = aniversariantesHoje.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center w-full">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Aniversários</h2>
          <p className="text-slate-500">Gerencie os aniversários dos seus clientes e envie mensagens personalizadas.</p>
        </div>
        {/* Filtros customizados */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 mb-2 w-full">
          <button
            className={`px-6 py-3 rounded-2xl text-lg font-semibold shadow transition-all border-2 ${tab === 'hoje' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
            onClick={() => setTab('hoje')}
          >
            Em aniversário
          </button>
          <button
            className={`px-6 py-3 rounded-2xl text-lg font-semibold shadow transition-all border-2 ${tab === 'semana' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
            onClick={() => setTab('semana')}
          >
            Próximos 7 dias
          </button>
          <button
            className={`px-6 py-3 rounded-2xl text-lg font-semibold shadow transition-all border-2 ${tab === 'mes' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
            onClick={() => setTab('mes')}
          >
            Próximos 30 dias
          </button>
          <button
            className={`px-6 py-3 rounded-2xl text-lg font-semibold shadow transition-all border-2 ${tab === 'porMes' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
            onClick={() => setTab('porMes')}
          >
            Separados por Mês
          </button>
          <button
            className={`px-6 py-3 rounded-2xl text-lg font-semibold shadow transition-all border-2 ${tab === 'todos' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
            onClick={() => setTab('todos')}
          >
            Todos
          </button>
        </div>
      </div>

      <Tabs defaultValue="semana" value={tab} onValueChange={setTab}>
        <TabsContent value="hoje" className="space-y-4">
          <div className="my-4">
            <div className="flex items-center gap-3 bg-blue-50 text-blue-800 rounded-xl px-6 py-4 font-medium shadow-sm">
              <Info className="w-7 h-7 text-blue-500" />
              <span>
                Total de {totalAniversariantes} aniversariantes cadastrados. Hoje temos {totalHoje} cliente{totalHoje !== 1 && "s"} aniversariando!
              </span>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="w-full max-w-7xl mx-auto">
              <AniversariantesTable
                aniversariantes={aniversariantesHoje}
                loading={false}
                page={1}
                pageSize={10}
                total={aniversariantesHoje.length}
                onPageChange={() => {}}
                defaultViewMode="cards"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="semana" className="space-y-4">
          <div className="my-4">
            <div className="flex items-center gap-3 bg-blue-50 text-blue-800 rounded-xl px-6 py-4 font-medium shadow-sm">
              <Info className="w-7 h-7 text-blue-500" />
              <span>
                Total de {totalAniversariantes} aniversariantes cadastrados. Hoje temos {totalHoje} cliente{totalHoje !== 1 && "s"} aniversariando!
              </span>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="w-full max-w-7xl mx-auto">
              <AniversariantesTable
                aniversariantes={aniversariantesSemana}
                loading={false}
                page={1}
                pageSize={10}
                total={aniversariantesSemana.length}
                onPageChange={() => {}}
                defaultViewMode="cards"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mes" className="space-y-4">
          <div className="my-4">
            <div className="flex items-center gap-3 bg-blue-50 text-blue-800 rounded-xl px-6 py-4 font-medium shadow-sm">
              <Info className="w-7 h-7 text-blue-500" />
              <span>
                Total de {totalAniversariantes} aniversariantes cadastrados. Hoje temos {totalHoje} cliente{totalHoje !== 1 && "s"} aniversariando!
              </span>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="w-full max-w-7xl mx-auto">
              <AniversariantesTable
                aniversariantes={aniversariantesMes}
                loading={false}
                page={1}
                pageSize={10}
                total={aniversariantesMes.length}
                onPageChange={() => {}}
                defaultViewMode="cards"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="porMes" className="space-y-4">
          <div className="my-4">
            <div className="flex items-center gap-3 bg-blue-50 text-blue-800 rounded-xl px-6 py-4 font-medium shadow-sm">
              <Info className="w-7 h-7 text-blue-500" />
              <span>
                Total de {totalAniversariantes} aniversariantes cadastrados. Hoje temos {totalHoje} cliente{totalHoje !== 1 && "s"} aniversariando!
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* Navegação horizontal de meses */}
            <div className="flex gap-4 flex-wrap justify-center md:justify-start my-4">
              {mesesNomes.map((nome, idx) => (
                <button
                  key={nome}
                  className={`px-6 py-2 min-w-[110px] rounded-full border text-base font-semibold transition-all duration-200 shadow-sm flex-shrink-0
                    ${mesAtual.getMonth() === idx
                      ? "bg-primary text-white shadow-md border-primary"
                      : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"}
                  `}
                  onClick={() => {
                    const novaData = new Date(mesAtual);
                    novaData.setMonth(idx);
                    setMesAtual(novaData);
                  }}
                >
                  {nome}
                </button>
              ))}
            </div>
            {/* Lista do mês aberta diretamente */}
            <div className="flex justify-start">
              <div className="w-full max-w-7xl mx-auto">
                <AniversariantesTable
                  aniversariantes={aniversariantesMesAtual}
                  loading={false}
                  page={1}
                  pageSize={10}
                  total={aniversariantesMesAtual.length}
                  onPageChange={() => {}}
                  defaultViewMode="list"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="todos" className="space-y-4">
          <div className="my-4">
            <div className="flex items-center gap-3 bg-blue-50 text-blue-800 rounded-xl px-6 py-4 font-medium shadow-sm">
              <Info className="w-7 h-7 text-blue-500" />
              <span>
                Total de {totalAniversariantes} aniversariantes cadastrados. Hoje temos {totalHoje} cliente{totalHoje !== 1 && "s"} aniversariando!
              </span>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="w-full max-w-7xl mx-auto">
              <AniversariantesTable
                aniversariantes={clientes
                  .filter(c => c.dataNascimento)
                  .map(c => ({
                    id: c.id,
                    nome: c.nome,
                    dataNascimento: c.dataNascimento,
                    telefone: c.telefone,
                    email: c.email,
                    diasAte: 999, // Não importa para a aba Todos
                    clienteDesde: c.createdAt || "-",
                    ultimaCompra: vendas ? vendas.filter(v => v.clienteId === c.id).sort((a, b) => new Date(b.dataVenda).getTime() - new Date(a.dataVenda).getTime())[0]?.dataVenda || "-" : "-"
                  }))
                  .sort((a, b) => {
                    // Ordenar por mês e dia
                    const [aAno, aMes, aDia] = a.dataNascimento.split("-").map(Number);
                    const [bAno, bMes, bDia] = b.dataNascimento.split("-").map(Number);
                    if (aMes !== bMes) return aMes - bMes;
                    return aDia - bDia;
                  })
                }
                loading={false}
                page={1}
                pageSize={50}
                total={clientes.filter(c => c.dataNascimento).length}
                onPageChange={() => {}}
                defaultViewMode="list"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Aniversarios;
