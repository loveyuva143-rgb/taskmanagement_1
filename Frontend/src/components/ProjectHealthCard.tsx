import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProjectHealthCardProps {
  projectName: string;
  clientName: string;
  progress: number;
  healthScore: number;
  status: "healthy" | "at-risk" | "critical";
  sprint: string;
  dueDate: string;
}

export const ProjectHealthCard = ({
  projectName,
  clientName,
  progress,
  healthScore,
  status,
  sprint,
  dueDate,
}: ProjectHealthCardProps) => {
  const statusConfig = {
    healthy: {
      label: "Healthy",
      color: "bg-success text-success-foreground",
      badge: "success",
    },
    "at-risk": {
      label: "At Risk",
      color: "bg-warning text-warning-foreground",
      badge: "warning",
    },
    critical: {
      label: "Critical",
      color: "bg-destructive text-destructive-foreground",
      badge: "destructive",
    },
  };

  const config = statusConfig[status];

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1 flex-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {projectName}
          </h3>
          <p className="text-sm text-muted-foreground">{clientName}</p>
        </div>
        <Badge variant={config.badge as any} className={cn("ml-2", config.color)}>
          {config.label}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Sprint Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Health Score</p>
            <p className="text-xl font-bold text-foreground">{healthScore}/100</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Sprint</p>
            <p className="text-sm font-medium text-foreground">{sprint}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Due Date</p>
            <p className="text-sm font-medium text-foreground">{dueDate}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
