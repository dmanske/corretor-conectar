
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Comissao, ComissaoTotais, PdfExportOptions, ParcelasPendentes } from "@/types/comissao.types";
import { useToast } from "@/hooks/use-toast";
import { getPdfColors } from "./colors";
import { createDocumentDefinition } from "./document-builder";

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

export const exportarComissoesParaPDF = (
  comissoesParaExportar: Comissao[],
  calcularTotais: (comissoes: Comissao[]) => ComissaoTotais,
  filtros: PdfExportOptions,
  parcelasPendentes: ParcelasPendentes[],
  toast: ReturnType<typeof useToast>["toast"]
) => {
  // Verifique se há dados para exportar
  if (comissoesParaExportar.length === 0) {
    toast({
      variant: "destructive",
      title: "Sem dados",
      description: "Não há comissões para exportar."
    });
    return;
  }

  try {
    // Define o tema do relatório
    const tema = filtros.tema || 'roxo';
    const colors = getPdfColors(tema);
    
    // Informações resumidas para o cabeçalho
    const dadosComissoes = calcularTotais(comissoesParaExportar);
    
    // Cria o documento PDF
    const docDefinition = createDocumentDefinition(
      comissoesParaExportar,
      dadosComissoes,
      filtros,
      parcelasPendentes,
      colors
    );

    // Gera e faz o download do PDF
    toast({
      title: "Exportação de PDF",
      description: "Preparando o arquivo de relatório...",
    });

    pdfMake.createPdf(docDefinition).download('relatorio-comissoes.pdf');
    
  } catch (error) {
    console.error("Erro ao exportar para PDF:", error);
    toast({
      variant: "destructive",
      title: "Erro na exportação",
      description: "Não foi possível gerar o relatório em PDF."
    });
  }
};

// Re-export everything from the submodules for backwards compatibility
export * from './colors';
export * from './table-config';
export * from './components';
export * from './document-builder';
