
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Target } from "lucide-react";

interface MetaAnualDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (valor: number, ano: number) => Promise<boolean>;
  currentValue: number;
  ano: number;
}

const MetaAnualDialog = ({
  open,
  onOpenChange,
  onSave,
  currentValue,
  ano
}: MetaAnualDialogProps) => {
  const [valor, setValor] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && currentValue) {
      setValor(currentValue.toString());
    } else if (open) {
      setValor("");
    }
  }, [open, currentValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valor) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      const valorNumerico = parseFloat(valor);
      
      if (isNaN(valorNumerico) || valorNumerico < 0) {
        return;
      }
      
      const success = await onSave(valorNumerico, ano);
      
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: string) => {
    // Remove todos os caracteres que não são dígitos
    let onlyNums = value.replace(/[^\d]/g, "");
    
    // Converte para número decimal (valor em centavos)
    let numValue = parseInt(onlyNums || "0") / 100;
    
    // Formata como moeda brasileira
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove formatação atual
    let value = e.target.value.replace(/[^\d]/g, "");
    
    // Atualiza o estado com o valor numérico (em centavos)
    setValor(value);
    
    // Atualiza o input com o valor formatado
    e.target.value = formatCurrency(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Definir Meta Anual de {ano}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="meta-anual">Valor da Meta Anual</Label>
            <Input
              id="meta-anual"
              type="text"
              value={valor ? formatCurrency(valor) : ""}
              onChange={handleValueChange}
              placeholder="R$ 0,00"
              className="text-lg font-medium"
              required
            />
            <p className="text-xs text-slate-500">
              Defina sua meta anual de comissões. Você poderá acompanhar seu progresso no relatório anual.
            </p>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!valor || isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Meta Anual"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MetaAnualDialog;
