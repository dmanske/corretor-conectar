
import { Comissao, CsvExportOptions } from "@/types/comissao.types";
import { escapeCSV, formatarDataParaPDF, formatarMoedaParaPDF } from "@/utils/comissao.utils";
import { useToast } from "@/hooks/use-toast";

export const exportarComissoesParaCSV = (
  comissoesParaExportar: Comissao[],
  filtros: CsvExportOptions,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  const {
    incluirCliente = true,
    incluirImovel = true,
    incluirValorVenda = true,
    incluirValorComissao = true,
    incluirDataVenda = true,
    incluirDataPagamento = true,
    incluirStatus = true,
  } = filtros;

  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Cabeçalho
  const header = [
    incluirCliente ? "Cliente" : null,
    incluirImovel ? "Imóvel" : null,
    incluirValorVenda ? "Valor da Venda" : null,
    incluirValorComissao ? "Valor da Comissão" : null,
    incluirDataVenda ? "Data da Venda" : null,
    incluirDataPagamento ? "Data de Pagamento" : null,
    incluirStatus ? "Status" : null,
  ].filter(v => v !== null && v !== undefined).join(",");
  
  csvContent += header + "\r\n";

  // Conteúdo das linhas
  comissoesParaExportar.forEach(comissao => {
    const row = [
      incluirCliente ? escapeCSV(comissao.cliente) : null,
      incluirImovel ? escapeCSV(comissao.imovel) : null,
      incluirValorVenda ? escapeCSV(formatarMoedaParaPDF(comissao.valorVenda)) : null,
      incluirValorComissao ? escapeCSV(formatarMoedaParaPDF(comissao.valorComissaoCorretor)) : null,
      incluirDataVenda ? escapeCSV(formatarDataParaPDF(comissao.dataVenda)) : null,
      incluirDataPagamento ? escapeCSV(formatarDataParaPDF(comissao.dataPagamento)) : null,
      incluirStatus ? escapeCSV(comissao.status) : null,
    ].filter(v => v !== null && v !== undefined).join(",");
    
    csvContent += row + "\r\n";
  });

  // Toast bonito do sistema
  toast({
    title: "Exportação iniciada",
    description: "O download do arquivo CSV está sendo gerado.",
    variant: "success"
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "comissoes.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
