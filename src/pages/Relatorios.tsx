import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart, PieChart, LineChart, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVendas } from "@/hooks/useVendas";
import { useComissoes } from "@/hooks/useComissoes";
import { useClientes } from "@/hooks/useClientes";

const Relatorios = () => {
  const { toast } = useToast();
  const [periodo, setPeriodo] = useState("mes");
  const { vendas, formatarMoeda } = useVendas();
  const { comissoes, calcularTotais, exportarParaPDF, exportarParaExcel } = useComissoes();
  const { clientes } = useClientes();
  
  // Função para formatar data
  const formatarData = (data: string): string => {
    if (!data) return "";
    const partes = data.split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
  };
  
  // Adicionar estados para período personalizado
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  
  // Dados calculados para relatórios
  const dadosVendas = {
    total: vendas.length,
    valorTotal: vendas.reduce((acc, venda) => acc + venda.valor, 0)
  };
  
  // Updated to include all needed properties from calcularTotais
  const dadosComissoes = {
    ...calcularTotais(comissoes),
    // Additional properties that might be needed
    metaComissao: 0,
    totalComissoes: calcularTotais(comissoes).total,
    totalRecebido: calcularTotais(comissoes).recebido,
    totalPendente: calcularTotais(comissoes).pendente,
    atingidoPercentual: 0
  };
  
  const handleExportPDF = () => {
    const tipoAtual = tabSelecionada === "comissoes" ? "comissões" : 
                      tabSelecionada === "vendas" ? "vendas" : 
                      tabSelecionada === "clientes" ? "clientes" : "metas";
                      
    try {
      if (tabSelecionada === "comissoes") {
        const filtros = {
          incluirCliente: true,
          incluirImovel: true,
          incluirValorVenda: true,
          incluirValorComissao: true,
          incluirDataVenda: true,
          incluirDataPagamento: true,
          incluirStatus: true,
          periodo: periodo,
          dataInicio: periodo === "personalizado" ? dataInicio : undefined,
          dataFim: periodo === "personalizado" ? dataFim : undefined,
          incluirParcelasPendentes: true,
          incluirResumoFinanceiro: true,
          incluirGrafico: true,
          tema: "roxo" as "roxo" | "azul" | "verde"
        };
        
        exportarParaPDF(comissoes, filtros);
      } else {
        toast({
          title: "Funcionalidade em desenvolvimento",
          description: `A exportação de relatórios de ${tipoAtual} será disponibilizada em breve.`,
        });
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório em PDF."
      });
    }
  };
  
  const handleExportExcel = () => {
    if (tabSelecionada === "comissoes") {
      const filtros = {
        incluirCliente: true,
        incluirImovel: true,
        incluirValorVenda: true,
        incluirValorComissao: true,
        incluirDataVenda: true,
        incluirDataPagamento: true,
        incluirStatus: true,
        periodo: periodo,
        dataInicio: periodo === "personalizado" ? dataInicio : undefined,
        dataFim: periodo === "personalizado" ? dataFim : undefined,
        incluirParcelasPendentes: true
      };
      
      exportarParaExcel(comissoes, filtros);
    } else {
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A exportação para Excel será disponibilizada em breve.",
      });
    }
  };
  
  // Controle da tab selecionada
  const [tabSelecionada, setTabSelecionada] = useState("vendas");
  const handleTabChange = (value: string) => {
    setTabSelecionada(value);
  };

  // Função para manipular a alteração de período
  const handlePeriodoChange = (novoPeriodo: string) => {
    setPeriodo(novoPeriodo);
    
    // Se mudar para personalizado, inicializar datas com valores padrão se vazios
    if (novoPeriodo === "personalizado") {
      if (!dataInicio) {
        const hoje = new Date();
        const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        setDataInicio(primeiroDiaMes.toISOString().split('T')[0]);
      }
      if (!dataFim) {
        const hoje = new Date();
        setDataFim(hoje.toISOString().split('T')[0]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-slate-500">Visualize os relatórios detalhados de vendas e comissões.</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="vendas" className="space-y-4" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="comissoes">Comissões</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-4 justify-end items-center">
          <div className="flex gap-3">
            <Button variant={periodo === "mes" ? "default" : "outline"} size="sm" onClick={() => handlePeriodoChange("mes")}>Mês</Button>
            <Button variant={periodo === "trimestre" ? "default" : "outline"} size="sm" onClick={() => handlePeriodoChange("trimestre")}>Trimestre</Button>
            <Button variant={periodo === "ano" ? "default" : "outline"} size="sm" onClick={() => handlePeriodoChange("ano")}>Ano</Button>
            <Button variant={periodo === "personalizado" ? "default" : "outline"} size="sm" onClick={() => handlePeriodoChange("personalizado")}>Personalizado</Button>
          </div>
          
          {periodo === "personalizado" && (
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
              <span>até</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          )}
        </div>
        
        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" />
                  Vendas por Período ({periodo})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-80">
                <div className="text-center">
                  <p>Total de vendas: {dadosVendas.total}</p>
                  <p>Valor total: {formatarMoeda(dadosVendas.valorTotal)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Vendas por Tipo de Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-80">
                {vendas.length > 0 ? (
                  <div className="text-center">
                    <ul className="space-y-2">
                      {Object.entries(
                        vendas.reduce((acc, venda) => {
                          acc[venda.tipoImovel] = (acc[venda.tipoImovel] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([tipo, count]) => (
                        <li key={tipo}>
                          {tipo}: {count} vendas ({Math.round(count / vendas.length * 100)}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <p>Nenhuma venda registrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalhamento de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              {vendas.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left py-2 px-4 border-b">Data</th>
                        <th className="text-left py-2 px-4 border-b">Cliente</th>
                        <th className="text-left py-2 px-4 border-b">Imóvel</th>
                        <th className="text-left py-2 px-4 border-b">Valor</th>
                        <th className="text-left py-2 px-4 border-b">Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendas.map(venda => (
                        <tr key={venda.id} className="hover:bg-slate-50">
                          <td className="py-2 px-4 border-b">{formatarData(venda.dataVenda)}</td>
                          <td className="py-2 px-4 border-b">{venda.clienteNome}</td>
                          <td className="py-2 px-4 border-b">{venda.endereco}</td>
                          <td className="py-2 px-4 border-b text-blue-600 font-semibold">{formatarMoeda(venda.valor)}</td>
                          <td className="py-2 px-4 border-b">
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {venda.tipoImovel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-10">
                  <p>Nenhuma venda registrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comissoes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Comissões ao Longo do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-80">
                <div className="text-center">
                  <p>Total de comissões: {formatarMoeda(dadosComissoes.totalComissoes)}</p>
                  <p>Recebidas: {formatarMoeda(dadosComissoes.totalRecebido)}</p>
                  <p>Pendentes: {formatarMoeda(dadosComissoes.totalPendente)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Status das Comissões
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-80">
                {comissoes.length > 0 ? (
                  <div className="text-center">
                    <p>Recebidas: {dadosComissoes.recebidoCount} ({Math.round(dadosComissoes.recebidoCount / comissoes.length * 100)}%)</p>
                    <p>Pendentes: {dadosComissoes.pendenteCount} ({Math.round(dadosComissoes.pendenteCount / comissoes.length * 100)}%)</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <p>Nenhuma comissão registrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalhamento de Comissões</CardTitle>
            </CardHeader>
            <CardContent>
              {comissoes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left py-2 px-4 border-b">Cliente</th>
                        <th className="text-left py-2 px-4 border-b">Imóvel</th>
                        <th className="text-left py-2 px-4 border-b">Valor Comissão</th>
                        <th className="text-left py-2 px-4 border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comissoes.map(comissao => (
                        <tr key={comissao.id} className="hover:bg-slate-50">
                          <td className="py-2 px-4 border-b">{comissao.cliente}</td>
                          <td className="py-2 px-4 border-b">{comissao.imovel}</td>
                          <td className="py-2 px-4 border-b">{formatarMoeda(comissao.valorComissaoCorretor)}</td>
                          <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded-full text-xs ${comissao.status === 'Recebido' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                              {comissao.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-10">
                  <p>Nenhuma comissão registrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              {clientes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left py-2 px-4 border-b">Nome</th>
                        <th className="text-left py-2 px-4 border-b">Email</th>
                        <th className="text-left py-2 px-4 border-b">Telefone</th>
                        <th className="text-left py-2 px-4 border-b">Cidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map(cliente => (
                        <tr key={cliente.id} className="hover:bg-slate-50">
                          <td className="py-2 px-4 border-b">{cliente.nome}</td>
                          <td className="py-2 px-4 border-b">{cliente.email || '-'}</td>
                          <td className="py-2 px-4 border-b">{cliente.telefone || '-'}</td>
                          <td className="py-2 px-4 border-b">{cliente.cidade || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-10">
                  <p>Nenhum cliente registrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progresso de Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                {dadosComissoes.metaComissao > 0 ? (
                  <div className="space-y-4">
                    <p className="mb-2">Meta: {formatarMoeda(dadosComissoes.metaComissao)}</p>
                    <p>Atingido: {formatarMoeda(dadosComissoes.totalComissoes)} ({Math.round(dadosComissoes.atingidoPercentual)}%)</p>
                    <div className="w-full h-4 bg-slate-200 rounded">
                      <div 
                        className="h-4 bg-blue-500 rounded"
                        style={{ width: `${Math.min(dadosComissoes.atingidoPercentual, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">Nenhuma meta definida</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
