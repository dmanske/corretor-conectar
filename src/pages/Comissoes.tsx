import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, PlusCircle, Cog, Loader2 } from "lucide-react";

// Custom hooks and components
import { useComissoes } from "@/hooks/useComissoes";
import ComissoesFilter from "@/components/comissoes/ComissoesFilter";
import ComissoesSummary from "@/components/comissoes/ComissoesSummary";
import ComissaoTable from "@/components/comissoes/ComissaoTable";
import ComissaoForm from "@/components/comissoes/ComissaoForm";
import { useAuth } from "@/hooks/useAuth";
import { Comissao } from "@/hooks/useComissoes";

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const anoAtual = new Date().getFullYear();

const Comissoes = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState("todas");
  const [filtro, setFiltro] = useState("");
  const [periodo, setPeriodo] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [metaDialogOpen, setMetaDialogOpen] = useState(false);
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
    totais
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
  }, [comissoes]);

  // Filtra as comissões do mês selecionado
  const comissoesDoMes = useMemo(() => {
    if (mesSelecionado === null) return comissoesFiltradas;
    return comissoesFiltradas.filter(c => {
      const data = new Date(c.dataVenda);
      return data.getFullYear() === anoAtual && data.getMonth() === mesSelecionado;
    });
  }, [comissoesFiltradas, mesSelecionado]);

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

  const handleExportarRelatorio = () => {
    toast({
      title: "Relatório exportado",
      description: "O relatório foi exportado com sucesso."
    });
  };
  
  const handleAdicionarOuAtualizarComissao = (comissao: Partial<Comissao>) => {
    if (comissaoParaEditar) {
      // Editar comissão existente
      atualizarComissao(comissaoParaEditar.id, comissao);
      setComissaoParaEditar(null);
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
            <Cog className="mr-2 h-4 w-4" />
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

      {/* Seletor de meses */}
      <div className="flex gap-2 mb-2">
        {meses.map((nome, idx) => (
          <button
            key={idx}
            disabled={!mesesComComissao.has(idx)}
            className={`px-3 py-1 rounded text-sm border ${idx === mesSelecionado ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700'} ${!mesesComComissao.has(idx) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-100'}`}
            onClick={() => setMesSelecionado(idx)}
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
        onAddComissao={(data) => atualizarMeta(data.valorComissaoCorretor || 0)}
        isMetaForm={true}
        currentMeta={metaComissao}
      />
    </div>
  );
};

export default Comissoes;
