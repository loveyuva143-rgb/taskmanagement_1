import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: "success" | "warning" | "danger" | "neutral";
  className?: string;
}

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  status = "neutral",
  className,
}: DashboardCardProps) => {
  const statusColors = {
    success: "border-l-success",
    warning: "border-l-warning",
    danger: "border-l-destructive",
    neutral: "border-l-primary",
  };

  return (
    <Card
      className={cn(
        "p-6 border-l-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        statusColors[status],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
