import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/format';
import { AnnualCommissionReport, MonthlyCommission } from '../types/commission';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface CommissionReportProps {
  annualTarget: number;
  monthlyCommissions: { month: number; value: number }[];
}

const getMonthName = (month: number): string => {
  return new Date(2024, month - 1, 1).toLocaleString('pt-BR', { month: 'long' });
};

const calculateStatus = (percentage: number): 'Abaixo da Meta' | 'Meta Atingida' | 'Meta Ultrapassada' => {
  if (percentage < 90) return 'Abaixo da Meta';
  if (percentage <= 109) return 'Meta Atingida';
  return 'Meta Ultrapassada';
};

export function CommissionReport({ annualTarget, monthlyCommissions }: CommissionReportProps) {
  const [report, setReport] = useState<AnnualCommissionReport | null>(null);

  useEffect(() => {
    const monthlyTarget = annualTarget / 12;
    const monthlyData: MonthlyCommission[] = monthlyCommissions.map(({ month, value }) => {
      const percentage = (value / monthlyTarget) * 100;
      return {
        month,
        monthName: getMonthName(month),
        received: value,
        target: monthlyTarget,
        percentage,
        status: calculateStatus(percentage),
      };
    });

    const totalReceived = monthlyData.reduce((sum, data) => sum + data.received, 0);
    const annualPercentage = (totalReceived / annualTarget) * 100;

    setReport({
      annualTarget,
      monthlyData,
      totalReceived,
      annualPercentage,
      annualStatus: calculateStatus(annualPercentage),
    });
  }, [annualTarget, monthlyCommissions]);

  const exportToPDF = () => {
    if (!report) return;

    const docDefinition = {
      content: [
        { text: 'Relatório Anual de Comissões', style: 'header' },
        { text: `Meta Anual: ${formatCurrency(report.annualTarget)}`, style: 'subheader' },
        { text: `Total Recebido: ${formatCurrency(report.totalReceived)}`, style: 'subheader' },
        { text: `Percentual Anual: ${report.annualPercentage.toFixed(2)}%`, style: 'subheader' },
        { text: `Status Anual: ${report.annualStatus}`, style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              ['Mês', 'Meta', 'Recebido', 'Percentual', 'Status'],
              ...report.monthlyData.map(data => [
                data.monthName,
                formatCurrency(data.target),
                formatCurrency(data.received),
                `${data.percentage.toFixed(2)}%`,
                data.status,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('relatorio-comissoes.pdf');
  };

  if (!report) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relatório Anual de Comissões</h1>
        <Button onClick={exportToPDF}>Exportar PDF</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Meta Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(report.annualTarget)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(report.totalReceived)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{report.annualStatus}</p>
            <p className="text-sm text-muted-foreground">
              {report.annualPercentage.toFixed(2)}% da meta
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="received" name="Recebido" fill="#4CAF50" />
                <Bar dataKey="target" name="Meta" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>Recebido</TableHead>
                <TableHead>Percentual</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.monthlyData.map((data) => (
                <TableRow key={data.month}>
                  <TableCell>{data.monthName}</TableCell>
                  <TableCell>{formatCurrency(data.target)}</TableCell>
                  <TableCell>{formatCurrency(data.received)}</TableCell>
                  <TableCell>{data.percentage.toFixed(2)}%</TableCell>
                  <TableCell>{data.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 