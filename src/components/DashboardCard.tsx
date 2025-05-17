
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  color?: "blue" | "green" | "purple" | "amber" | "rose";
}

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  className,
  color = "blue",
}: DashboardCardProps) => {
  // Color variants for cards with enhanced colors
  const colorVariants = {
    blue: "bg-blue-100 border-blue-300 shadow-sm shadow-blue-200",
    green: "bg-green-100 border-green-300 shadow-sm shadow-green-200",
    purple: "bg-purple-100 border-purple-300 shadow-sm shadow-purple-200",
    amber: "bg-amber-100 border-amber-300 shadow-sm shadow-amber-200", 
    rose: "bg-rose-100 border-rose-300 shadow-sm shadow-rose-200",
  };

  // Color variants for icons with enhanced colors
  const iconColorVariants = {
    blue: "text-blue-700 bg-blue-200 p-2 rounded-full",
    green: "text-green-700 bg-green-200 p-2 rounded-full",
    purple: "text-purple-700 bg-purple-200 p-2 rounded-full",
    amber: "text-amber-700 bg-amber-200 p-2 rounded-full",
    rose: "text-rose-700 bg-rose-200 p-2 rounded-full",
  };

  // Color variants for values with enhanced colors
  const valueColorVariants = {
    blue: "text-blue-800",
    green: "text-green-800",
    purple: "text-purple-800",
    amber: "text-amber-800",
    rose: "text-rose-800",
  };

  return (
    <Card className={cn("transition-all hover:shadow-md border", colorVariants[color], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-700">{title}</CardTitle>
        {icon && <div className={cn("h-8 w-8 flex items-center justify-center", iconColorVariants[color])}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueColorVariants[color])}>{value}</div>
        {description && (
          <div className="text-xs text-slate-600 mt-1">{description}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
