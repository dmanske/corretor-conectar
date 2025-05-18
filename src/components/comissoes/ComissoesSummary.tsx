import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, CreditCard, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
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
  parcialCount?: number;
  naoRecebidoCount?: number;
  totalVendas?: number;
  totalVendasCount?: number;
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
  labelMeta = "Meta de venda",
  parcialCount,
  naoRecebidoCount,
  totalVendas,
  totalVendasCount
}: ComissoesSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Vendas
          </CardTitle>
          <DollarSign className="h-4 w-4 text-blue-100" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <FormatCurrency value={totalVendas || 0} />
          </div>
          <p className="text-xs text-blue-100">
            {totalVendasCount ?? 0} vendas no período
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-slate-500 to-slate-700 text-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Comissões
          </CardTitle>
          <DollarSign className="h-4 w-4 text-slate-100" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <FormatCurrency value={totalComissoes} />
          </div>
          <p className="text-xs text-slate-100">
            {totalCount} comissões no período
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Comissões Recebidas
          </CardTitle>
          <CreditCard className="h-4 w-4 text-green-100" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <FormatCurrency value={totalRecebido} />
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <span className="flex items-center gap-1 text-xs text-green-100 font-semibold">
              <CheckCircle className="w-4 h-4 text-green-200" />
              {recebidoCount ?? 0} comissões recebidas
            </span>
            <span className="flex items-center gap-1 text-xs text-yellow-100 font-semibold">
              <Clock className="w-4 h-4 text-yellow-200" />
              {parcialCount ?? 0} comissões parciais
            </span>
            <span className="flex items-center gap-1 text-xs text-red-100 font-semibold">
              <XCircle className="w-4 h-4 text-red-200" />
              {naoRecebidoCount ?? 0} comissões não recebidas
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Comissões Pendentes
          </CardTitle>
          <Calendar className="h-4 w-4 text-yellow-100" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <FormatCurrency value={totalPendente} />
          </div>
          <p className="text-xs text-yellow-100">
            {pendenteCount} comissões pendentes
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {labelMeta}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-blue-100" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <FormatCurrency value={metaComissao} />
          </div>
          <p className="text-xs text-blue-100">
            Meta de vendas
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Atingido
          </CardTitle>
          <DollarSign className="h-4 w-4 text-purple-100" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {atingidoPercentual.toFixed(1)}%
          </div>
          <p className="text-xs text-purple-100">
            Da meta atual
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComissoesSummary;
