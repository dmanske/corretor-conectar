
import { Comissao, CsvExportOptions, ParcelasPendentes } from "@/types/comissao.types";
import { formatarDataParaPDF, formatarMoedaParaPDF } from "@/utils/comissao.utils";
import { useToast } from "@/hooks/use-toast";

// Esta é uma implementação básica do serviço de Excel
// Para uma implementação completa, precisaríamos adicionar ExcelJS como dependência
export const exportarComissoesParaExcel = (
  comissoesParaExportar: Comissao[],
  filtros: CsvExportOptions,
  parcelasPendentes: ParcelasPendentes[],
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

  // Esta implementação simula o ExcelJS gerando um CSV mais formatado
  // que poderia ser substituído por uma implementação real do ExcelJS posteriormente
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Planilha 1: Comissões
  csvContent += "RELATÓRIO DE COMISSÕES\r\n\r\n";
  
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
      incluirCliente ? `"${comissao.cliente}"` : null,
      incluirImovel ? `"${comissao.imovel}"` : null,
      incluirValorVenda ? `"${formatarMoedaParaPDF(comissao.valorVenda)}"` : null,
      incluirValorComissao ? `"${formatarMoedaParaPDF(comissao.valorComissaoCorretor)}"` : null,
      incluirDataVenda ? `"${formatarDataParaPDF(comissao.dataVenda)}"` : null,
      incluirDataPagamento ? `"${formatarDataParaPDF(comissao.dataPagamento)}"` : null,
      incluirStatus ? `"${comissao.status}"` : null,
    ].filter(v => v !== null && v !== undefined).join(",");
    
    csvContent += row + "\r\n";
  });
  
  // Adicionando totais
  const totalValorVenda = comissoesParaExportar.reduce((acc, comissao) => acc + comissao.valorVenda, 0);
  const totalValorComissao = comissoesParaExportar.reduce((acc, comissao) => acc + comissao.valorComissaoCorretor, 0);
  
  csvContent += "\r\n";
  csvContent += `"TOTAIS",,"${formatarMoedaParaPDF(totalValorVenda)}","${formatarMoedaParaPDF(totalValorComissao)}",,,\r\n`;
  
  // Planilha 2: Parcelas Pendentes
  csvContent += "\r\n\r\nPARCELAS PENDENTES\r\n\r\n";
  csvContent += "Cliente,Imóvel,Valor Total,Valor Pago,Valor Pendente,Data da Venda,Último Pagamento,Próximo Vencimento,Dias em Atraso\r\n";
  
  parcelasPendentes.forEach(parcela => {
    csvContent += [
      `"${parcela.cliente}"`,
      `"${parcela.imovel}"`,
      `"${formatarMoedaParaPDF(parcela.valorTotal)}"`,
      `"${formatarMoedaParaPDF(parcela.valorPago)}"`,
      `"${formatarMoedaParaPDF(parcela.valorPendente)}"`,
      `"${formatarDataParaPDF(parcela.dataVenda)}"`,
      `"${formatarDataParaPDF(parcela.dataUltimoPagamento)}"`,
      `"${formatarDataParaPDF(parcela.proximoVencimento)}"`,
      `"${parcela.diasEmAtraso}"`,
    ].join(",") + "\r\n";
  });
  
  // Total pendente
  const totalPendente = parcelasPendentes.reduce((acc, p) => acc + p.valorPendente, 0);
  csvContent += `\r\n"TOTAL PENDENTE",,"","","${formatarMoedaParaPDF(totalPendente)}",,,\r\n`;
  
  toast({
    title: "Exportação iniciada",
    description: "O download do arquivo Excel está sendo gerado.",
    variant: "success"
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "relatorio_comissoes.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
