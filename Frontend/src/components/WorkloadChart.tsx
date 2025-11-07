import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { name: "Alex K.", workload: 85, status: "danger" },
  { name: "Sarah M.", workload: 72, status: "warning" },
  { name: "James L.", workload: 45, status: "success" },
  { name: "Emma W.", workload: 68, status: "warning" },
  { name: "David R.", workload: 52, status: "success" },
  { name: "Lisa P.", workload: 78, status: "warning" },
];

const getBarColor = (status: string) => {
  switch (status) {
    case "danger":
      return "hsl(var(--destructive))";
    case "warning":
      return "hsl(var(--warning))";
    case "success":
      return "hsl(var(--success))";
    default:
      return "hsl(var(--primary))";
  }
};

export const WorkloadChart = () => {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground">
          Developer Workload Analysis
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Current capacity utilization across team members
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            label={{
              value: "Workload %",
              angle: -90,
              position: "insideLeft",
              style: { fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar dataKey="workload" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Healthy (0-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">At Risk (61-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Burnout Risk (81-100%)</span>
        </div>
      </div>
    </Card>
  );
};
