
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FileText, FileSpreadsheet, FileDown, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComissoes, Comissao } from "@/hooks/useComissoes";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comissoesParaExportar: Comissao[];
}

const ExportDialog = ({ 
  open, 
  onOpenChange,
  comissoesParaExportar
}: ExportDialogProps) => {
  const { toast } = useToast();
  const { exportarParaCSV, exportarParaPDF, exportarParaExcel } = useComissoes();
  
  const [formatoExportacao, setFormatoExportacao] = useState<"csv" | "excel" | "pdf">("pdf");
  const [filtros, setFiltros] = useState({
    incluirCliente: true,
    incluirImovel: true,
    incluirValorVenda: true,
    incluirValorComissao: true,
    incluirDataVenda: true,
    incluirDataPagamento: true,
    incluirStatus: true,
    incluirParcelasPendentes: true,
    incluirResumoFinanceiro: true,
    incluirGrafico: true,
    periodo: "todos" as "todos" | "mes" | "trimestre" | "ano" | "personalizado",
    dataInicio: "",
    dataFim: "",
    tema: "roxo" as "roxo" | "azul" | "verde"
  });

  const handleExportar = () => {
    if (comissoesParaExportar.length === 0) {
      toast({
        variant: "destructive",
        title: "Sem dados",
        description: "Não há comissões para exportar."
      });
      return;
    }

    try {
      if (formatoExportacao === "csv") {
        exportarParaCSV(comissoesParaExportar, filtros);
      } else if (formatoExportacao === "excel") {
        exportarParaExcel(comissoesParaExportar, filtros);
      } else {
        // Se for período personalizado sem datas, definir datas padrão
        if (filtros.periodo === "personalizado" && (!filtros.dataInicio || !filtros.dataFim)) {
          const hoje = new Date();
          const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          
          const novosFiltros = {
            ...filtros,
            dataInicio: filtros.dataInicio || primeiroDiaMes.toISOString().split('T')[0],
            dataFim: filtros.dataFim || hoje.toISOString().split('T')[0]
          };
          
          exportarParaPDF(comissoesParaExportar, novosFiltros);
        } else {
          exportarParaPDF(comissoesParaExportar, filtros);
        }
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo de exportação."
      });
    }
  };

  const toggleFiltro = (filtro: keyof typeof filtros) => {
    setFiltros(prev => ({
      ...prev,
      [filtro]: !prev[filtro]
    }));
  };

  // Atualiza o período e define datas padrão para personalizado
  const handlePeriodoChange = (value: typeof filtros.periodo) => {
    if (value === "personalizado" && !filtros.dataInicio && !filtros.dataFim) {
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      
      setFiltros({
        ...filtros,
        periodo: value,
        dataInicio: primeiroDiaMes.toISOString().split('T')[0],
        dataFim: hoje.toISOString().split('T')[0]
      });
    } else {
      setFiltros({
        ...filtros,
        periodo: value
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Exportar Comissões</DialogTitle>
          <DialogDescription>
            Configure as opções para exportar os dados das comissões.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="formato" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="formato">Formato</TabsTrigger>
            <TabsTrigger value="campos">Campos</TabsTrigger>
            <TabsTrigger value="periodo">Período</TabsTrigger>
            <TabsTrigger value="aparencia" disabled={formatoExportacao === "csv"}>Aparência</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formato">
            <div className="grid grid-cols-3 gap-4">
              <div 
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 ${formatoExportacao === "csv" ? "border-blue-500 bg-blue-50" : ""}`}
                onClick={() => setFormatoExportacao("csv")}
              >
                <FileText className="h-10 w-10 text-gray-600 mb-2" />
                <span className="font-medium">CSV</span>
                <span className="text-sm text-slate-500 text-center">Formato simples de dados</span>
              </div>
              
              <div 
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-green-300 hover:bg-green-50 ${formatoExportacao === "excel" ? "border-green-500 bg-green-50" : ""}`}
                onClick={() => setFormatoExportacao("excel")}
              >
                <FileSpreadsheet className="h-10 w-10 text-green-600 mb-2" />
                <span className="font-medium">Excel</span>
                <span className="text-sm text-slate-500 text-center">Planilha formatada com abas</span>
              </div>
              
              <div 
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 ${formatoExportacao === "pdf" ? "border-purple-500 bg-purple-50" : ""}`}
                onClick={() => setFormatoExportacao("pdf")}
              >
                <FileDown className="h-10 w-10 text-red-600 mb-2" />
                <span className="font-medium">PDF</span>
                <span className="text-sm text-slate-500 text-center">Relatório formatado completo</span>
              </div>
            </div>
            
            <div className="bg-violet-50 border border-violet-200 rounded-md p-3 mt-4 flex items-start">
              <div className="text-violet-600 mr-2 mt-0.5">ℹ️</div>
              <div className="text-sm text-violet-800">
                {formatoExportacao === "csv" 
                  ? "O formato CSV é simples e pode ser aberto em qualquer programa de planilha, mas sem formatação."
                  : formatoExportacao === "excel"
                  ? "O formato Excel inclui formatação, abas organizadas e totais calculados automaticamente."
                  : "O formato PDF gera um relatório completo e formatado, ideal para impressão e compartilhamento."}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="campos" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirCliente" 
                  checked={filtros.incluirCliente} 
                  onCheckedChange={() => toggleFiltro("incluirCliente")}
                />
                <Label htmlFor="incluirCliente">Nome do Cliente</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirImovel" 
                  checked={filtros.incluirImovel} 
                  onCheckedChange={() => toggleFiltro("incluirImovel")}
                />
                <Label htmlFor="incluirImovel">Descrição do Imóvel</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirValorVenda" 
                  checked={filtros.incluirValorVenda} 
                  onCheckedChange={() => toggleFiltro("incluirValorVenda")}
                />
                <Label htmlFor="incluirValorVenda">Valor da Venda</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirValorComissao" 
                  checked={filtros.incluirValorComissao} 
                  onCheckedChange={() => toggleFiltro("incluirValorComissao")}
                />
                <Label htmlFor="incluirValorComissao">Valor da Comissão</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirDataVenda" 
                  checked={filtros.incluirDataVenda} 
                  onCheckedChange={() => toggleFiltro("incluirDataVenda")}
                />
                <Label htmlFor="incluirDataVenda">Data da Venda</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirDataPagamento" 
                  checked={filtros.incluirDataPagamento} 
                  onCheckedChange={() => toggleFiltro("incluirDataPagamento")}
                />
                <Label htmlFor="incluirDataPagamento">Data de Pagamento</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirStatus" 
                  checked={filtros.incluirStatus} 
                  onCheckedChange={() => toggleFiltro("incluirStatus")}
                />
                <Label htmlFor="incluirStatus">Status</Label>
              </div>
              
              <div className="h-px bg-slate-200 my-2"></div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirParcelasPendentes" 
                  checked={filtros.incluirParcelasPendentes} 
                  onCheckedChange={() => toggleFiltro("incluirParcelasPendentes")}
                  disabled={formatoExportacao === "csv"}
                />
                <Label htmlFor="incluirParcelasPendentes" className={formatoExportacao === "csv" ? "text-gray-400" : ""}>
                  Detalhes de Parcelas Pendentes
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirResumoFinanceiro" 
                  checked={filtros.incluirResumoFinanceiro} 
                  onCheckedChange={() => toggleFiltro("incluirResumoFinanceiro")}
                  disabled={formatoExportacao === "csv"}
                />
                <Label htmlFor="incluirResumoFinanceiro" className={formatoExportacao === "csv" ? "text-gray-400" : ""}>
                  Resumo Financeiro
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirGrafico" 
                  checked={filtros.incluirGrafico} 
                  onCheckedChange={() => toggleFiltro("incluirGrafico")}
                  disabled={formatoExportacao !== "pdf"}
                />
                <Label htmlFor="incluirGrafico" className={formatoExportacao !== "pdf" ? "text-gray-400" : ""}>
                  Gráficos Visuais (apenas PDF)
                </Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="periodo" className="space-y-4">
            <div>
              <Label htmlFor="periodo">Período</Label>
              <Select
                value={filtros.periodo}
                onValueChange={handlePeriodoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="mes">Mês atual</SelectItem>
                  <SelectItem value="trimestre">Trimestre atual</SelectItem>
                  <SelectItem value="ano">Ano atual</SelectItem>
                  <SelectItem value="personalizado">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filtros.periodo === "personalizado" && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data Inicial
                  </Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={filtros.dataInicio}
                    onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataFim" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data Final
                  </Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={filtros.dataFim}
                    onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                  />
                </div>
              </div>
            )}
            
            {filtros.periodo !== "todos" && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Observação:</span> O período selecionado será aplicado às comissões exportadas. 
                  {filtros.periodo === "mes" && " Apenas as comissões do mês atual serão incluídas."}
                  {filtros.periodo === "trimestre" && " Apenas as comissões do trimestre atual serão incluídas."}
                  {filtros.periodo === "ano" && " Apenas as comissões do ano atual serão incluídas."}
                  {filtros.periodo === "personalizado" && " Apenas as comissões do período especificado serão incluídas."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="aparencia" className="space-y-4">
            <div>
              <Label htmlFor="tema">Tema do Relatório</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div 
                  className={`relative border rounded-lg p-4 cursor-pointer ${filtros.tema === "roxo" ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200 hover:border-purple-300"}`}
                  onClick={() => setFiltros(prev => ({ ...prev, tema: "roxo" }))}
                >
                  <div className="flex flex-col gap-1 items-center">
                    <div className="w-full h-3 rounded bg-purple-600"></div>
                    <div className="w-full h-2 rounded bg-purple-300"></div>
                    <div className="w-3/4 h-2 rounded bg-purple-200"></div>
                  </div>
                  <p className="text-xs text-center mt-2 font-medium">Roxo</p>
                  {filtros.tema === "roxo" && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  )}
                </div>
                
                <div 
                  className={`relative border rounded-lg p-4 cursor-pointer ${filtros.tema === "azul" ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-300"}`}
                  onClick={() => setFiltros(prev => ({ ...prev, tema: "azul" }))}
                >
                  <div className="flex flex-col gap-1 items-center">
                    <div className="w-full h-3 rounded bg-blue-600"></div>
                    <div className="w-full h-2 rounded bg-blue-300"></div>
                    <div className="w-3/4 h-2 rounded bg-blue-200"></div>
                  </div>
                  <p className="text-xs text-center mt-2 font-medium">Azul</p>
                  {filtros.tema === "azul" && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  )}
                </div>
                
                <div 
                  className={`relative border rounded-lg p-4 cursor-pointer ${filtros.tema === "verde" ? "border-green-500 ring-2 ring-green-200" : "border-gray-200 hover:border-green-300"}`}
                  onClick={() => setFiltros(prev => ({ ...prev, tema: "verde" }))}
                >
                  <div className="flex flex-col gap-1 items-center">
                    <div className="w-full h-3 rounded bg-green-600"></div>
                    <div className="w-full h-2 rounded bg-green-300"></div>
                    <div className="w-3/4 h-2 rounded bg-green-200"></div>
                  </div>
                  <p className="text-xs text-center mt-2 font-medium">Verde</p>
                  {filtros.tema === "verde" && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-violet-50 border border-violet-200 rounded-md p-3 mt-4">
              <h3 className="text-sm font-medium text-violet-800 mb-2">Seu relatório incluirá:</h3>
              <ul className="text-sm text-violet-700 space-y-1">
                <li>• Cabeçalho com dados da empresa</li>
                <li>• Resumo de valores em formato visual</li>
                <li>• Tabela de comissões detalhada</li>
                {formatoExportacao === "pdf" && filtros.incluirParcelasPendentes && (
                  <li>• Seção de parcelas pendentes com detalhes</li>
                )}
                {formatoExportacao === "excel" && (
                  <li>• Planilha com múltiplas abas organizadas</li>
                )}
                <li>• Formatação profissional com cores e estilos</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleExportar} 
            className={
              formatoExportacao === "pdf" ? "bg-purple-600 hover:bg-purple-700" : 
              formatoExportacao === "excel" ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            {formatoExportacao === "csv" ? "Exportar CSV" : 
             formatoExportacao === "excel" ? "Exportar Excel" : "Exportar PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
