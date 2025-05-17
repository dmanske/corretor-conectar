
import { Badge } from "@/components/ui/badge";

// Update the ComissaoStatus type to include all possible status values 
export type ComissaoStatus = "Pendente" | "Parcial" | "Recebido";

interface StatusBadgeProps {
  status: ComissaoStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants = {
    Pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Parcial: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    Recebido: "bg-green-100 text-green-800 hover:bg-green-100"
  };

  return (
    <Badge className={variants[status]} variant="outline">
      {status}
    </Badge>
  );
};

export default StatusBadge;
