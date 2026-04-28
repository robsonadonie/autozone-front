import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export function StatCard({ title, value, icon, change, subtitle, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-2 px-4 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground" style={{fontSize:"13px"}}>{title}</p>
          <p style={{fontSize :"14px"}} className="font-semibold mt-1 " >{value}</p>
         
      
        </div>
        {/* {icon && <div className="text-muted-foreground">{icon}</div>} */}
      </div>
    </div>
  );
}
