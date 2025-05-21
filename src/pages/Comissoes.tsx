import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, PlusCircle, Cog, Loader2, BarChart3, CheckCircle, AlertTriangle, XCircle, TrendingUp, DollarSign, Clock, Target } from "lucide-react";

// Custom hooks and components
import { useComissoes } from "@/hooks/useComissoes";
import ComissoesFilter from "@/components/comissoes/ComissoesFilter";
import ComissoesSummary from "@/components/comissoes/ComissoesSummary";
import ComissaoTable from "@/components/comissoes/ComissaoTable";
import ComissaoForm from "@/components/comissoes/ComissaoForm";
import ExportDialog from "@/components/comissoes/ExportDialog";
import RelatorioAnualComissoes from "@/components/comissoes/RelatorioAnualComissoes";
import MetaAnualDialog from "@/components/comissoes/MetaAnualDialog";
import { useAuth } from "@/hooks/useAuth";
import { Comissao } from "@/hooks/useComissoes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import CommissionReport from "@/components/comissoes/CommissionReport";

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

const Comissoes = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [tab, setTab] = useState("todas");
  const [filtro, setFiltro] = useState("");
  const [periodo, setPeriodo] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [metaDialogOpen, setMetaDialogOpen] = useState(false);
  const [metaAnualDialogOpen, setMetaAnualDialogOpen] = useState(false);
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
    metaAnual,
    metasDoAno,
    recebimentosPorMes,
    aReceberPorMes,
    isLoading,
    adicionarComissao, 
    atualizarComissao,
    marcarComoPago,
    excluirComissao,
    atualizarMeta,
    atualizarMetaAnual,
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
    buscarTotalRecebidoAno,
  } = useComissoes();

  const [mediaMensalAtingida, setMediaMensalAtingida] = useState(0);
  const [percentualAtingidoAnual, setPercentualAtingidoAnual] = useState(0);
  const [iconeAtingido, setIconeAtingido] = useState(<CheckCircle className="w-5 h-5 text-green-500" />);
  const [corAtingido, setCorAtingido] = useState("text-green-600");

  const [mesesComMeta, setMesesComMeta] = useState<Set<number>>(new Set());

  const [order, setOrder] = useState('az');

  const [groupByDay, setGroupByDay] = useState(false);
  const [hojeAtivo, setHojeAtivo] = useState(false);

  // Adicionar estados para filtro por data inicial e final
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  // Novo estado para a visualização
  const [modo, setModo] = useState<"mensal" | "anual">(mesSelecionado !== null ? "mensal" : "anual");

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

  // Nova lista para o diálogo de exportação: aplica filtros de status e texto da tela,
  // mas não o filtro de período da tela (mesSelecionado, anoAtual).
  const comissoesParaDialogoExportacao = useMemo(() => {
    let lista = [...comissoes]; // Começa com a lista crua
    
    // Aplica filtro de STATUS da TELA (tab)
    if (tab === "pendentes") {
      lista = lista.filter(c => {
        const status = c.status?.toLowerCase();
        return status === "pendente" || status === "parcial";
      });
    } else if (tab === "recebidas") {
      lista = lista.filter(c => c.status?.toLowerCase() === "recebido");
    }
    // Se tab === "todas", não filtra por status.

    // Aplica filtro de TEXTO e DATA INICIO/FIM da TELA (filtro, dataInicial, dataFinal)
    // Este bloco é semelhante ao de comissoesExibidas, mas sem o filtro de período da tela.
    lista = lista.filter(c => {
      // Se não há filtro de texto nem de data da tela, mantém o item
      if (!filtro && !dataInicial && !dataFinal) return true;
      
      const textoLower = filtro.toLowerCase();
      let correspondeTexto = !filtro; // Verdadeiro se não houver filtro de texto
      
      if (filtro) {
        correspondeTexto = 
          c.cliente?.toLowerCase().includes(textoLower) ||
          c.imovel?.toLowerCase().includes(textoLower) ||
          String(c.valorVenda).includes(textoLower) || 
          String(c.valorComissaoCorretor).includes(textoLower) ||
          (c.dataVenda && c.dataVenda.split('-').reverse().join('/').includes(textoLower)) ||
          c.status?.toLowerCase().includes(textoLower);
      }

      let correspondeDataTela = true;
      if (dataInicial && c.dataVenda < dataInicial) correspondeDataTela = false;
      if (dataFinal && c.dataVenda > dataFinal) correspondeDataTela = false;
      
      return correspondeTexto && correspondeDataTela;
    });

    // Ordenação (opcional para exportação, mas pode ser mantida por consistência se desejado)
    lista.sort((a, b) => {
      if (!a.cliente || !b.cliente) return 0;
      if (order === 'az') return a.cliente.localeCompare(b.cliente);
      return b.cliente.localeCompare(a.cliente);
    });
    
    return lista;
  }, [comissoes, tab, filtro, dataInicial, dataFinal, order]);

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
      const mesesComMetaSet = new Set<number>();
      metas?.forEach(meta => {
        if (meta.mes > 0) { // Ignorar meta anual (mes=0)
          mesesComMetaSet.add(meta.mes - 1);
        }
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
    if (metasDoAno) {
      metasDoAno.forEach(m => {
        if (m.ano) anosSet.add(m.ano);
      });
    }
    
    // Se não houver anos nos dados, adicione o ano atual
    if (anosSet.size === 0) {
      anosSet.add(new Date().getFullYear());
    }
    
    return Array.from(anosSet).sort((a, b) => a - b);
  }, [comissoes, metasDoAno]);

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

  // Função para limpar todos os filtros
  function limparFiltros() {
    setFiltro('');
    setDataInicial('');
    setDataFinal('');
    setHojeAtivo(false);
  }

  // Atualizar modo conforme seleção do mês
  useEffect(() => {
    if (mesSelecionado === null) {
      setModo("anual");
    } else {
      setModo("mensal");
    }
  }, [mesSelecionado]);

  // Preparar dados para o relatório anual
  const dadosRelatorioAnual = useMemo(() => {
    const monthlyCommissions = meses.map((_, index) => {
      const mes = index + 1;
      const totalRecebido = getTotalRecebidoPorMesAno(mes, anoAtual);
      return {
        month: mes,
        value: totalRecebido
      };
    });

    return {
      annualTarget: metaAnual || 0,
      monthlyCommissions
    };
  }, [metaAnual, anoAtual, getTotalRecebidoPorMesAno]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Comissões</h1>
        <div className="flex gap-2">
          <Button onClick={() => setMetaAnualDialogOpen(true)}>
            <Target className="w-4 h-4 mr-2" />
            Meta Anual
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Comissão
          </Button>
        </div>
      </div>

      <Tabs defaultValue="todas" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="recebidas">Recebidas</TabsTrigger>
          <TabsTrigger value="relatorio">Relatório Anual</TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Comissões</h2>
              <p className="text-slate-500">Gerencie suas comissões de vendas imobiliárias.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => modo === "anual" ? setMetaAnualDialogOpen(true) : setMetaDialogOpen(true)}>
                <Target className="mr-2 h-4 w-4" />
                {modo === "anual" ? "Definir Meta Anual" : "Definir Meta Mensal"}
              </Button>
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
                  className={`px-3 py-1 rounded text-sm border ${
                    mesSelecionado === null 
                      ? 'bg-blue-500 text-white font-medium' 
                      : 'bg-slate-50 text-slate-700 hover:bg-blue-100'
                  }`}
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
            <RelatorioAnualComissoes 
              ano={anoAtual} 
              comissoes={comissoes} 
              metasAno={metasDoAno} 
              recebimentosPorMes={recebimentosPorMes} 
              aReceberPorMes={aReceberPorMes}
              usuario={{ nome: user?.user_metadata?.name || user?.email || "Usuário" }}
            />
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
                      comissoesExibidas.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">Nenhuma comissão encontrada</div>
                      ) : (
                        <ComissaoTable 
                          comissoes={comissoesExibidas}
                          onMarcarPago={marcarComoPago}
                          onEditar={handleEditarComissao}
                          onExcluir={handleExcluirComissao}
                        />
                      )
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pendentes" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <ComissaoTable 
                      comissoes={comissoesExibidas.filter(c => {
                        const status = c.status?.toLowerCase();
                        return status === "pendente" || status === "parcial";
                      })}
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
                      comissoes={comissoesExibidas.filter(c => c.status?.toLowerCase() === "recebido")}
                      showActions={false}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          }
        </TabsContent>

        <TabsContent value="relatorio">
          <Card>
            <CardContent className="pt-6">
              <CommissionReport
                annualTarget={dadosRelatorioAnual.annualTarget}
                monthlyCommissions={dadosRelatorioAnual.monthlyCommissions}
              />
            </CardContent>
          </Card>
        </TabsContent>
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

      <MetaAnualDialog 
        open={metaAnualDialogOpen}
        onOpenChange={setMetaAnualDialogOpen}
        onSave={atualizarMetaAnual}
        currentValue={metaAnual}
        ano={anoAtual}
      />

      <ExportDialog 
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        comissoesParaExportar={comissoesParaDialogoExportacao}
      />
    </div>
  );
};

export default Comissoes;
