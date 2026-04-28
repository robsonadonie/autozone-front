
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: number;
  className?: string;
  iconColor?: string;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  iconColor = "text-primary"
}: StatsCardProps) => {
  return (
    <Card className={cn("hover:-translate-y-2 transition-all p-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground p-0">
          {title}
        </CardTitle>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className={`text-xs mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? `+${trend}%` : `${trend}%`} depuis le mois dernier
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
