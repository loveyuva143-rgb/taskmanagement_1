import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Brain } from "lucide-react";

const teamMembers = [
  {
    name: "Alex Kumar",
    role: "Senior Full-Stack Developer",
    workload: 85,
    status: "danger",
    projects: ["E-Commerce Platform", "Healthcare Portal"],
    burnoutRisk: 92,
    recommendation:
      "Redistribute 2 tasks to available team members. Consider 1-day break.",
  },
  {
    name: "Sarah Martinez",
    role: "Frontend Developer",
    workload: 72,
    status: "warning",
    projects: ["Mobile Banking App", "AI Dashboard"],
    burnoutRisk: 68,
    recommendation: "Monitor closely. Current pace sustainable for 2 weeks.",
  },
  {
    name: "James Lee",
    role: "Backend Developer",
    workload: 45,
    status: "success",
    projects: ["AI Dashboard"],
    burnoutRisk: 22,
    recommendation: "Available for additional tasks. Good candidate for mentoring.",
  },
  {
    name: "Emma Wilson",
    role: "UI/UX Developer",
    workload: 68,
    status: "warning",
    projects: ["E-Commerce Platform", "Mobile Banking App"],
    burnoutRisk: 55,
    recommendation: "Capacity allows for 1 additional small task.",
  },
  {
    name: "David Rodriguez",
    role: "DevOps Engineer",
    workload: 52,
    status: "success",
    projects: ["Healthcare Portal"],
    burnoutRisk: 30,
    recommendation: "Well-balanced workload. Can handle infrastructure tasks.",
  },
];

const Workload = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            AI Workload Analyzer
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time capacity monitoring and burnout prediction powered by AI
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="p-6 bg-destructive/10 border-destructive/30">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-destructive mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Critical Alert: 2 Team Members at High Burnout Risk
              </h3>
              <p className="text-sm text-muted-foreground">
                Alex Kumar and Sarah Martinez are operating above sustainable
                capacity. Immediate action recommended.
              </p>
            </div>
          </div>
        </Card>

        {/* Team Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Team Average</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">64.4%</p>
            <p className="text-sm text-muted-foreground mt-1">
              Capacity utilization
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-foreground">At Risk</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">2</p>
            <p className="text-sm text-muted-foreground mt-1">
              Team members need attention
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">AI Confidence</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">94%</p>
            <p className="text-sm text-muted-foreground mt-1">
              Prediction accuracy
            </p>
          </Card>
        </div>

        {/* Team Members List */}
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <Card key={member.name} className="p-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                  <Badge
                    variant={
                      member.status === "danger"
                        ? "destructive"
                        : member.status === "warning"
                        ? "secondary"
                        : "default"
                    }
                    className={
                      member.status === "success"
                        ? "bg-success text-success-foreground"
                        : ""
                    }
                  >
                    {member.workload}% Capacity
                  </Badge>
                </div>

                {/* Workload Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Current Workload
                    </span>
                    <span className="font-medium text-foreground">
                      {member.workload}%
                    </span>
                  </div>
                  <Progress
                    value={member.workload}
                    className="h-3"
                  />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Active Projects
                    </p>
                    <div className="space-y-1">
                      {member.projects.map((project) => (
                        <p
                          key={project}
                          className="text-sm font-medium text-foreground"
                        >
                          {project}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Burnout Risk
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-foreground">
                        {member.burnoutRisk}%
                      </p>
                      <Progress
                        value={member.burnoutRisk}
                        className="h-2 flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      AI Recommendation
                    </p>
                    <p className="text-sm text-foreground">
                      {member.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workload;
