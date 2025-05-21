export type MonthStatus = 'Abaixo da Meta' | 'Meta Atingida' | 'Meta Ultrapassada';

export interface MonthlyCommission {
  month: number;
  monthName: string;
  received: number;
  target: number;
  percentage: number;
  status: MonthStatus;
}

export interface AnnualCommissionReport {
  annualTarget: number;
  monthlyData: MonthlyCommission[];
  totalReceived: number;
  annualPercentage: number;
  annualStatus: MonthStatus;
} 