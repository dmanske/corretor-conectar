
// Se esse arquivo for read-only, precisamos criar uma versão personalizada:

import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";

export interface ExportButtonsProps {
  transacoes?: any[]; // Adicionando essa propriedade que está sendo passada
  formatarMoeda?: (valor: number) => string;
  periodo?: string;
  totalEntradas?: number;
  totalSaidas?: number;
  saldoTotal?: number;
  exportarCSV?: () => void;
  exportarPDF?: () => void;
}

const ExportButtonsCustom = ({
  transacoes,
  formatarMoeda,
  periodo,
  totalEntradas,
  totalSaidas,
  saldoTotal,
  exportarCSV,
  exportarPDF
}: ExportButtonsProps) => {
  return (
    <div className="flex gap-2 justify-end mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={exportarCSV}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Exportar CSV
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={exportarPDF}
      >
        <FileText className="h-4 w-4" />
        Exportar PDF
      </Button>
    </div>
  );
};

export default ExportButtonsCustom;
