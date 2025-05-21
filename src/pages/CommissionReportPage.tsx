import { CommissionReport } from '../components/CommissionReport';

export function CommissionReportPage() {
  // Dados de exemplo
  const annualTarget = 120000; // R$ 120.000,00
  const monthlyCommissions = [
    { month: 1, value: 8500 },
    { month: 2, value: 9200 },
    { month: 3, value: 10500 },
    { month: 4, value: 9800 },
    { month: 5, value: 11000 },
    { month: 6, value: 12500 },
    { month: 7, value: 11500 },
    { month: 8, value: 13200 },
    { month: 9, value: 10800 },
    { month: 10, value: 9500 },
    { month: 11, value: 11800 },
    { month: 12, value: 12700 },
  ];

  return (
    <div className="container mx-auto py-8">
      <CommissionReport
        annualTarget={annualTarget}
        monthlyCommissions={monthlyCommissions}
      />
    </div>
  );
} 