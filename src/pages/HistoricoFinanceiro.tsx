
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinanceiro } from "@/hooks/useFinanceiro";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, ArrowUpCircle, CircleDollarSign, ChevronDown, Plus, Calendar } from "lucide-react";
import ExportButtons from "@/components/financeiro/ExportButtons";
import AnaliseFinanceira from "@/components/financeiro/AnaliseFinanceira";
import { useTheme } from "@/hooks/useTheme";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const HistoricoFinanceiro = () => {
  const [tipo, setTipo] = useState("todos");
  const [termo, setTermo] = useState("");
  const [periodo, setPeriodo] = useState("todos");
  const [novaDespesa, setNovaDespesa] = useState({
    descricao: "",
    valor: 0,
    data: format(new Date(), "yyyy-MM-dd"),
    formaPagamento: "PIX" as "Dinheiro" | "PIX" | "Cartão" | "Cheque"
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { theme } = useTheme();
  
  const { 
    transacoes, 
    isLoading, 
    adicionarDespesa,
    filtrarTransacoes, 
    calcularTotais,
    formatarMoeda
  } = useFinanceiro();
  
  const transacoesFiltradas = filtrarTransacoes(tipo, termo, periodo);
  const { totalEntradas, totalSaidas, saldoTotal } = calcularTotais();
  
  const handleAdicionarDespesa = () => {
    if (novaDespesa.descricao && novaDespesa.valor > 0) {
      adicionarDespesa(novaDespesa);
      setDialogOpen(false);
      setNovaDespesa({
        descricao: "",
        valor: 0,
        data: format(new Date(), "yyyy-MM-dd"),
        formaPagamento: "PIX"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            Histórico Financeiro
          </h2>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Acompanhe as entradas e saídas financeiras.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className={`sm:max-w-[425px] ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-700' : ''}`}>
              <DialogHeader>
                <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>Adicionar Nova Despesa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao" className={theme === 'dark' ? 'text-white' : ''}>Descrição</Label>
                  <Input
                    id="descricao"
                    placeholder="Ex: Material de escritório"
                    value={novaDespesa.descricao}
                    onChange={(e) => setNovaDespesa({...novaDespesa, descricao: e.target.value})}
                    className={theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor" className={theme === 'dark' ? 'text-white' : ''}>Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    placeholder="0,00"
                    value={novaDespesa.valor || ''}
                    onChange={(e) => setNovaDespesa({...novaDespesa, valor: Number(e.target.value)})}
                    className={theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data" className={theme === 'dark' ? 'text-white' : ''}>Data</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="data"
                        type="date"
                        value={novaDespesa.data}
                        onChange={(e) => setNovaDespesa({...novaDespesa, data: e.target.value})}
                        className={`pl-10 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : ''}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formaPagamento" className={theme === 'dark' ? 'text-white' : ''}>Método</Label>
                    <Select 
                      value={novaDespesa.formaPagamento} 
                      onValueChange={(value: "Dinheiro" | "PIX" | "Cartão" | "Cheque") => 
                        setNovaDespesa({...novaDespesa, formaPagamento: value})
                      }
                    >
                      <SelectTrigger 
                        id="formaPagamento" 
                        className={theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : ''}
                      >
                        <SelectValue placeholder="Método" />
                      </SelectTrigger>
                      <SelectContent className={theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Cartão">Cartão</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className={theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : ''}>Cancelar</Button>
                </DialogClose>
                <Button onClick={handleAdicionarDespesa} className="bg-green-600 hover:bg-green-700">Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <ExportButtons
            transacoes={transacoesFiltradas}
            formatarMoeda={formatarMoeda}
            periodo={periodo}
            totalEntradas={totalEntradas}
            totalSaidas={totalSaidas}
            saldoTotal={saldoTotal}
          />
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={`from-blue-500 to-blue-700 bg-gradient-to-r text-white ${theme === 'dark' ? 'border-slate-700' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Recebido
            </CardTitle>
            <CardDescription className="text-blue-100">
              Valor total de comissões recebidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarMoeda(totalEntradas)}
            </div>
          </CardContent>
        </Card>
        
        <Card className={`from-red-500 to-red-700 bg-gradient-to-r text-white ${theme === 'dark' ? 'border-slate-700' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Despesas
            </CardTitle>
            <CardDescription className="text-red-100">
              Valor total de saídas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarMoeda(totalSaidas)}
            </div>
          </CardContent>
        </Card>
        
        <Card className={`from-green-500 to-green-700 bg-gradient-to-r text-white ${theme === 'dark' ? 'border-slate-700' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Total
            </CardTitle>
            <CardDescription className="text-green-100">
              Balanço geral de entradas e saídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarMoeda(saldoTotal)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transacoes">
        <TabsList>
          <TabsTrigger value="transacoes">Transações</TabsTrigger>
          <TabsTrigger value="analise">Análise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transacoes" className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col gap-2 sm:flex-row items-end">
            <div className="w-full sm:w-72">
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : ''}`}>Período</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className={theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent className={theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={termo}
                  onChange={(e) => setTermo(e.target.value)}
                  placeholder="Buscar por descrição..."
                  className={`pl-10 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>
            </div>
          </div>
      
          {/* Tabela */}
          <Tabs defaultValue="todos" value={tipo} onValueChange={setTipo}>
            <TabsList>
              <TabsTrigger value="todos">Todas</TabsTrigger>
              <TabsTrigger value="Entrada">Entradas</TabsTrigger>
              <TabsTrigger value="Saída">Saídas</TabsTrigger>
            </TabsList>
            <TabsContent value="todos" className="mt-4">
              <Card className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className={theme === 'dark' ? 'border-slate-700' : ''}>
                        <TableHead className={`w-[180px] ${theme === 'dark' ? 'text-slate-300' : ''}`}>Data</TableHead>
                        <TableHead className={theme === 'dark' ? 'text-slate-300' : ''}>Descrição</TableHead>
                        <TableHead className={theme === 'dark' ? 'text-slate-300' : ''}>Método</TableHead>
                        <TableHead className={`text-right ${theme === 'dark' ? 'text-slate-300' : ''}`}>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow className={theme === 'dark' ? 'border-slate-700 hover:bg-slate-700/50' : ''}>
                          <TableCell colSpan={4} className="h-24 text-center">
                            <div className="flex justify-center">
                              <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${theme === 'dark' ? 'border-slate-400' : 'border-slate-500'}`}></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : transacoesFiltradas.length === 0 ? (
                        <TableRow className={theme === 'dark' ? 'border-slate-700 hover:bg-slate-700/50' : ''}>
                          <TableCell colSpan={4} className="h-24 text-center">
                            Nenhuma transação encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        transacoesFiltradas.map((transacao) => (
                          <TableRow key={transacao.id} className={theme === 'dark' ? 'border-slate-700 hover:bg-slate-700/50' : ''}>
                            <TableCell className={theme === 'dark' ? 'text-slate-300' : ''}>
                              {transacao.data ? format(parseISO(transacao.data), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                            </TableCell>
                            <TableCell className={`font-medium ${theme === 'dark' ? 'text-slate-300' : ''}`}>
                              <div className="flex items-center gap-2">
                                <CircleDollarSign className={`h-4 w-4 ${transacao.tipo === "Entrada" ? "text-green-500" : "text-red-500"}`} />
                                {transacao.descricao}
                              </div>
                            </TableCell>
                            <TableCell className={theme === 'dark' ? 'text-slate-300' : ''}>{transacao.formaPagamento}</TableCell>
                            <TableCell className={`text-right font-medium ${transacao.tipo === "Entrada" ? "text-green-600" : "text-red-600"}`}>
                              {transacao.tipo === "Entrada" ? "+" : "-"}{formatarMoeda(transacao.valor)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="Entrada" className="mt-4">
              <Card className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className={theme === 'dark' ? 'border-slate-700' : ''}>
                        <TableHead className={`w-[180px] ${theme === 'dark' ? 'text-slate-300' : ''}`}>Data</TableHead>
                        <TableHead className={theme === 'dark' ? 'text-slate-300' : ''}>Descrição</TableHead>
                        <TableHead className={theme === 'dark' ? 'text-slate-300' : ''}>Método</TableHead>
                        <TableHead className={`text-right ${theme === 'dark' ? 'text-slate-300' : ''}`}>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow className={theme === 'dark' ? 'border-slate-700 hover:bg-slate-700/50' : ''}>
                          <TableCell colSpan={4} className="h-24 text-center">
                            <div className="flex justify-center">
                              <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${theme === 'dark' ? 'border-slate-400' : 'border-slate-500'}`}></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : transacoesFiltradas.length === 0 ? (
                        <TableRow className={theme === 'dark' ? 'border-slate-700 hover:bg-slate-700/50' : ''}>
                          <TableCell colSpan={4} className="h-24 text-center">
                            Nenhuma transação encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        transacoesFiltradas.map((transacao) => (
                          <TableRow key={transacao.id} className={theme === 'dark' ? 'border-slate-700 hover:bg-slate-700/50' : ''}>
                            <TableCell className={theme === 'dark' ? 'text-slate-300' : ''}>
                              {transacao.data ? format(parseISO(transacao.data), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                            </TableCell>
                            <TableCell className={`font-medium ${theme === 'dark' ? 'text-slate-300' : ''}`}>
                              <div className="flex items-center gap-2">
                                <CircleDollarSign className="h-4 w-4 text-green-500" />
                                {transacao.descricao}
                              </div>
                            </TableCell>
                            <TableCell className={theme === 'dark' ? 'text-slate-300' : ''}>
                              {transacao.formaPagamento}
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              +{formatarMoeda(transacao.valor)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="Saída" className="mt-4">
              <Card className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className={theme === 'dark' ? 'border-slate-700' : ''}>
                        <TableHead className={`w-[180px] ${theme === 'dark' ? 'text-slate-300' : ''}`}>Data</TableHead>
                        <TableHead className={theme === 'dark' ? 'text-slate-300' : ''}>Descrição</TableHead>
                        <TableHead className={theme === 'dark' ? 'text-slate-300' : ''}>Método</TableHead>
                        <TableHead className={`text-right ${theme === 'dark' ? 'text-slate-300' : ''}`}>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow className={theme === 'dark' ? 'border-slate-700 hover:bg-slate-700/50' : ''}>
                          <TableCell colSpan={4} className="h-24 text-center">
                            <div className="flex justify-center">
                              <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${theme === 'dark' ? 'border-slate-400' : 'border-slate-500'}`}></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : transacoesFiltradas.length === 0 ? (
                        <TableRow className={theme === 'dark' ? 'border-slate-700 hover:bg-slate-700/50' : ''}>
                          <TableCell colSpan={4} className="h-24 text-center">
                            Nenhuma transação encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        transacoesFiltradas.map((transacao) => (
                          <TableRow key={transacao.id} className={theme === 'dark' ? 'border-slate-700 hover:bg-slate-700/50' : ''}>
                            <TableCell className={theme === 'dark' ? 'text-slate-300' : ''}>
                              {transacao.data ? format(parseISO(transacao.data), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                            </TableCell>
                            <TableCell className={`font-medium ${theme === 'dark' ? 'text-slate-300' : ''}`}>
                              <div className="flex items-center gap-2">
                                <CircleDollarSign className="h-4 w-4 text-red-500" />
                                {transacao.descricao}
                              </div>
                            </TableCell>
                            <TableCell className={theme === 'dark' ? 'text-slate-300' : ''}>
                              {transacao.formaPagamento}
                            </TableCell>
                            <TableCell className="text-right font-medium text-red-600">
                              -{formatarMoeda(transacao.valor)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="analise">
          <AnaliseFinanceira 
            transacoes={transacoes}
            formatarMoeda={formatarMoeda}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoricoFinanceiro;
