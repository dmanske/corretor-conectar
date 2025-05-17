
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AnaliseFinanceiraProps {
  transacoes?: any[]; // Adicionando essa propriedade que está sendo passada
  formatarMoeda?: (valor: number) => string;
}

const AnaliseFinanceiraCustom = ({
  transacoes,
  formatarMoeda
}: AnaliseFinanceiraProps) => {
  // Lógica de análise financeira que usa as propriedades transacoes e formatarMoeda
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Gráfico de distribuição (em desenvolvimento)</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Gráfico de fluxo (em desenvolvimento)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnaliseFinanceiraCustom;
