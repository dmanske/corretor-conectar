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
    blue: "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-purple-700 shadow-lg shadow-purple-300/50",
    green: "bg-gradient-to-br from-green-500 to-teal-500 text-white border-teal-700 shadow-lg shadow-teal-300/50",
    purple: "bg-gradient-to-br from-orange-500 to-yellow-400 text-white border-yellow-600 shadow-lg shadow-yellow-300/50",
    amber: "bg-gradient-to-br from-pink-500 to-orange-400 text-white border-orange-600 shadow-lg shadow-orange-300/50",
    rose: "bg-rose-100 border-rose-300 shadow-sm shadow-rose-200", // Mantendo uma cor sólida como fallback ou para outros usos
  };

  // Color variants for icons with enhanced colors
  const iconColorVariants = {
    blue: "text-white bg-white/20 p-2 rounded-full",
    green: "text-white bg-white/20 p-2 rounded-full",
    purple: "text-white bg-white/20 p-2 rounded-full",
    amber: "text-white bg-white/20 p-2 rounded-full",
    rose: "text-rose-700 bg-rose-200 p-2 rounded-full",
  };

  // Color variants for values with enhanced colors
  const valueColorVariants = {
    blue: "text-white",
    green: "text-white",
    purple: "text-white",
    amber: "text-white",
    rose: "text-rose-800",
  };

  return (
    <Card className={cn("transition-all hover:shadow-md border", colorVariants[color], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
        {icon && <div className={cn("h-8 w-8 flex items-center justify-center", iconColorVariants[color])}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueColorVariants[color])}>{value}</div>
        {description && (
          <div className="text-xs text-white/80 mt-1">{description}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
