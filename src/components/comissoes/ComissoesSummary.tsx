import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, CreditCard, Calendar } from "lucide-react";
import { FormatCurrency } from "./FormatComponents";

interface ComissoesSummaryProps {
  totalComissoes: number;
  totalCount: number;
  totalRecebido: number;
  recebidoCount: number;
  totalPendente: number;
  pendenteCount: number;
  metaComissao: number;
  atingidoPercentual: number;
  labelMeta?: string;
}

const ComissoesSummary = ({
  totalComissoes,
  totalCount,
  totalRecebido,
  recebidoCount,
  totalPendente,
  pendenteCount,
  metaComissao,
  atingidoPercentual,
  labelMeta = "Meta de venda"
}: ComissoesSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Comissões
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <FormatCurrency value={totalComissoes} />
          </div>
          <p className="text-xs text-muted-foreground">
            {totalCount} comissões no período
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Comissões Recebidas
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            <FormatCurrency value={totalRecebido} />
          </div>
          <p className="text-xs text-muted-foreground">
            {recebidoCount} comissões recebidas
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Comissões Pendentes
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            <FormatCurrency value={totalPendente} />
          </div>
          <p className="text-xs text-muted-foreground">
            {pendenteCount} comissões pendentes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {labelMeta}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            <FormatCurrency value={metaComissao} />
          </div>
          <p className="text-xs text-muted-foreground">
            Meta de vendas
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Atingido
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {atingidoPercentual.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Da meta atual
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComissoesSummary;
