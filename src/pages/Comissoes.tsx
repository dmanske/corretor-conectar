
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, PlusCircle, Cog, Loader2, BarChart3 } from "lucide-react";

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

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const Comissoes = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState("todas");
  const [filtro, setFiltro] = useState("");
  const [periodo, setPeriodo] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [metaDialogOpen, setMetaDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [comissaoParaEditar, setComissaoParaEditar] = useState<Comissao | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);
  
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
    metasMensais,
    metaAtual,
    mesAtual,
    anoAtual,
    alterarPeriodoAtual,
    obterNomeMes
  } = useComissoes();

  // Filtrar comissões
  const comissoesFiltradas = filtrarComissoes(tab, filtro, periodo);
  
  const {
    totalComissoes,
    totalPendente,
    totalRecebido,
    totalCount,
    recebidoCount,
    pendenteCount,
    atingidoPercentual
  } = totais;

  // Identifica os meses que têm comissão no ano atual
  const mesesComComissao = useMemo(() => {
    const set = new Set<number>();
    comissoes.forEach(c => {
      const data = new Date(c.dataVenda);
      if (data.getFullYear() === anoAtual) {
        set.add(data.getMonth());
      }
    });
    return set;
  }, [comissoes, anoAtual]);

  // Filtra as comissões do mês selecionado
  const comissoesDoMes = useMemo(() => {
    if (mesSelecionado === null) return comissoesFiltradas;
    return comissoesFiltradas.filter(c => {
      const data = new Date(c.dataVenda);
      return data.getFullYear() === anoAtual && data.getMonth() === mesSelecionado;
    });
  }, [comissoesFiltradas, mesSelecionado, anoAtual]);

  // Agrupa as comissões do mês por dia
  const comissoesPorDia = useMemo(() => {
    const grupos: { [dia: string]: Comissao[] } = {};
    comissoesDoMes.forEach(c => {
      const data = new Date(c.dataVenda);
      const dia = data.toLocaleDateString("pt-BR");
      if (!grupos[dia]) grupos[dia] = [];
      grupos[dia].push(c);
    });
    // Ordena por data
    return Object.entries(grupos).sort((a, b) => {
      const d1 = a[0].split('/').reverse().join('-');
      const d2 = b[0].split('/').reverse().join('-');
      return d1.localeCompare(d2);
    });
  }, [comissoesDoMes]);

  // Atualiza o período atual quando o mês selecionado muda
  useEffect(() => {
    if (mesSelecionado !== null) {
      alterarPeriodoAtual(mesSelecionado + 1, anoAtual);
    }
  }, [mesSelecionado, anoAtual, alterarPeriodoAtual]);

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
      adicionarComissao(comissao);
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
          <Button variant="outline" onClick={() => setMetaDialogOpen(true)}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Definir Meta
          </Button>
          <Button variant="outline" onClick={handleExportarRelatorio}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => {
            setComissaoParaEditar(null);
            setDialogOpen(true);
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Comissão
          </Button>
        </div>
      </div>
      
      {/* Seletor de ano */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-1/4">
          <Label htmlFor="anoSelect" className="text-sm font-medium mb-2 block">Ano</Label>
          <Select
            value={String(anoAtual)}
            onValueChange={(value) => alterarPeriodoAtual(mesAtual, parseInt(value))}
          >
            <SelectTrigger id="anoSelect" className="w-full">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {gerarAnos().map((ano) => (
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
                className={`px-3 py-1 rounded text-sm border ${idx === mesSelecionado ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700'} ${!mesesComComissao.has(idx) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-100'}`}
                onClick={() => setMesSelecionado(idx !== mesSelecionado ? idx : null)}
              >
                {nome}
              </button>
            ))}
            {/* Botão para limpar filtro de mês */}
            <button
              className={`px-3 py-1 rounded text-sm border bg-slate-50 text-slate-500 ml-2 ${mesSelecionado === null ? 'font-bold underline' : ''}`}
              onClick={() => setMesSelecionado(null)}
            >
              Todos
            </button>
          </div>
        </div>
      </div>

      {/* Meta atual */}
      <Card className="border-2 border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium">Meta de {obterNomeMes(mesAtual)} de {anoAtual}</h3>
              <p className="text-slate-600">
                {metaAtual ? 
                  `Meta definida: ${metaAtual.valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}` : 
                  'Nenhuma meta definida para este mês'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm text-slate-500">Progresso</div>
                <div className="font-bold text-lg">{atingidoPercentual.toFixed(1)}%</div>
              </div>
              
              <div className="w-32 h-4 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${atingidoPercentual >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(atingidoPercentual, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de resumo */}
      <ComissoesSummary 
        totalComissoes={totalComissoes}
        totalCount={totalCount}
        totalRecebido={totalRecebido}
        recebidoCount={recebidoCount}
        totalPendente={totalPendente}
        pendenteCount={pendenteCount}
        metaComissao={metaComissao}
        atingidoPercentual={atingidoPercentual}
      />

      {/* Filtros e tabela */}
      <Tabs defaultValue="todas" value={tab}>
        <ComissoesFilter 
          tab={tab}
          onTabChange={setTab}
          filtro={filtro}
          onFiltroChange={setFiltro}
          periodo={periodo}
          onPeriodoChange={setPeriodo}
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
        ) : (
          <>
            <TabsContent value="todas" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  {/* Agrupamento por dia se mês selecionado */}
                  {mesSelecionado !== null ? (
                    comissoesPorDia.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">Nenhuma comissão neste mês</div>
                    ) : (
                      comissoesPorDia.map(([dia, comissoesDia]) => (
                        <div key={dia} className="border-b last:border-0">
                          <div className="bg-slate-50 px-4 py-2 text-slate-600 font-semibold text-sm">{dia}</div>
                          <ComissaoTable 
                            comissoes={comissoesDia}
                            onMarcarPago={marcarComoPago}
                            onEditar={handleEditarComissao}
                            onExcluir={handleExcluirComissao}
                          />
                        </div>
                      ))
                    )
                  ) : (
                    <ComissaoTable 
                      comissoes={comissoesFiltradas}
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
                    comissoes={comissoesFiltradas}
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
                    comissoes={comissoesFiltradas}
                    showActions={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parciais" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <ComissaoTable 
                    comissoes={comissoesFiltradas}
                    onMarcarPago={marcarComoPago}
                    onEditar={handleEditarComissao}
                    onExcluir={handleExcluirComissao}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
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
        currentMeta={metaAtual?.valor || metaComissao}
      />

      <ExportDialog 
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        comissoesParaExportar={comissoesFiltradas}
      />
    </div>
  );
};

export default Comissoes;
