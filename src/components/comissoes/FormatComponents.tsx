
interface CurrencyProps {
  value: number;
}

export const FormatCurrency = ({ value }: CurrencyProps) => {
  return (
    <span>
      {new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value)}
    </span>
  );
};

interface PercentProps {
  value: number;
}

export const FormatPercent = ({ value }: PercentProps) => {
  return <span>{value}%</span>;
};

interface DateProps {
  date: string | null;
}

export const FormatDate = ({ date }: DateProps) => {
  if (!date) return <span>-</span>;
  return (
    <span>
      {new Date(date).toLocaleDateString('pt-BR')}
    </span>
  );
};
