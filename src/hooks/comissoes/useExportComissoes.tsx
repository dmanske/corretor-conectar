import { Comissao, PdfExportOptions } from "@/types/comissao.types";
import { ParcelasPendentes } from "@/types/comissao.types";
import { exportarComissoesParaCSV } from "@/services/csv.service";
import { exportarComissoesParaPDF as exportarPdfService } from "@/services/pdf.service";
import { exportarComissoesParaExcel } from "@/services/excel.service";
import { calcularTotais, filtrarComissoes } from "@/utils/comissao.helpers";

// Hook for exporting comissoes data
export const useExportComissoes = (
  toast: any,
  parcelasPendentes: ParcelasPendentes[]
) => {
  // Function to export to CSV
  const exportarParaCSV = (comissoesParaExportar: Comissao[], filtros: any) => {
    exportarComissoesParaCSV(comissoesParaExportar, filtros, toast);
  };

  // Function to export to Excel
  const exportarParaExcel = (comissoesParaExportar: Comissao[], filtros: any) => {
    exportarComissoesParaExcel(comissoesParaExportar, filtros, parcelasPendentes, toast);
  };

  // Function to export to PDF
  const exportarParaPDF = (
    comissoesParaExportar: Comissao[], 
    filtros: PdfExportOptions
  ) => {
    const comissoesFiltradasFinal = filtrarComissoes(
      comissoesParaExportar, 
      "todas",
      "",
      filtros.periodo || "todos", 
      filtros.dataInicio, 
      filtros.dataFim
    );
    
    exportarPdfService(comissoesFiltradasFinal, calcularTotais, filtros, parcelasPendentes, toast);
  };

  return {
    exportarParaCSV,
    exportarParaExcel,
    exportarParaPDF,
    calcularTotais
  };
};
