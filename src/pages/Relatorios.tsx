
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart, PieChart, LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVendas } from "@/hooks/useVendas";
import { useComissoes } from "@/hooks/useComissoes";
import { useClientes } from "@/hooks/useClientes";

const Relatorios = () => {
  const { toast } = useToast();
  const [periodo, setPeriodo] = useState("mes");
  const { vendas, formatarMoeda } = useVendas();
  const { comissoes, calcularTotais } = useComissoes();
  const { clientes } = useClientes();
  
  // Dados calculados para relatórios
  const dadosVendas = {
    total: vendas.length,
    valorTotal: vendas.reduce((acc, venda) => acc + venda.valor, 0)
  };
  
  const dadosComissoes = calcularTotais(comissoes);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-slate-500">Visualize os relatórios detalhados de vendas e comissões.</p>
        </div>
        <div className="flex space-x-3">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="comissoes">Comissões</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 justify-end">
          <Button variant={periodo === "mes" ? "default" : "outline"} size="sm" onClick={() => setPeriodo("mes")}>Mês</Button>
          <Button variant={periodo === "trimestre" ? "default" : "outline"} size="sm" onClick={() => setPeriodo("trimestre")}>Trimestre</Button>
          <Button variant={periodo === "ano" ? "default" : "outline"} size="sm" onClick={() => setPeriodo("ano")}>Ano</Button>
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
                <div className="text-center text-slate-500">
                  <p>Total de vendas: {dadosVendas.total}</p>
                  <p>Valor total: {formatarMoeda(dadosVendas.valorTotal)}</p>
                  <p className="text-sm mt-2 text-slate-400">Em uma implementação completa, utilizaríamos o componente recharts.</p>
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
              <CardTitle>Histórico de Vendas</CardTitle>
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
                      </tr>
                    </thead>
                    <tbody>
                      {vendas.map(venda => (
                        <tr key={venda.id} className="hover:bg-slate-50">
                          <td className="py-2 px-4 border-b">{new Date(venda.dataVenda).toLocaleDateString('pt-BR')}</td>
                          <td className="py-2 px-4 border-b">{venda.clienteNome}</td>
                          <td className="py-2 px-4 border-b">{venda.tipoImovel} - {venda.endereco}</td>
                          <td className="py-2 px-4 border-b">{formatarMoeda(venda.valor)}</td>
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
