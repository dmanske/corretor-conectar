import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonsProps {
  onExportCSV?: () => void;
  onExportPDF?: () => void;
}

const ExportButtons = ({ onExportCSV, onExportPDF }: ExportButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onExportCSV}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Exportar CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onExportPDF}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Exportar PDF
      </Button>
    </div>
  );
};

export default ExportButtons; 