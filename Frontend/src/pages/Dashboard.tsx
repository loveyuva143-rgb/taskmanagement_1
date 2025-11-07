import { DashboardCard } from "@/components/DashboardCard";
import { WorkloadChart } from "@/components/WorkloadChart";
import { ProjectHealthCard } from "@/components/ProjectHealthCard";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Clock,
} from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden rounded-b-3xl">
        <img
          src={dashboardHero}
          alt="Dashboard Hero"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Project Intelligence Dashboard
            </h1>
            <p className="text-white/90 text-lg">
              AI-Powered Insights for Smarter Project Management
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Active Projects"
            value="12"
            subtitle="3 at risk"
            icon={<TrendingUp className="w-6 h-6 text-primary" />}
            status="neutral"
            trend={{ value: 15, isPositive: true }}
          />
          <DashboardCard
            title="Team Capacity"
            value="73%"
            subtitle="Across 24 developers"
            icon={<Users className="w-6 h-6 text-accent" />}
            status="success"
            trend={{ value: 8, isPositive: false }}
          />
          <DashboardCard
            title="Burnout Alerts"
            value="2"
            subtitle="Immediate attention needed"
            icon={<AlertTriangle className="w-6 h-6 text-warning" />}
            status="warning"
          />
          <DashboardCard
            title="On-Time Delivery"
            value="94%"
            subtitle="Last 30 days"
            icon={<CheckCircle2 className="w-6 h-6 text-success" />}
            status="success"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* AI Insights Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                AI Insight of the Day
              </h3>
              <p className="text-muted-foreground">
                Analysis shows that <strong>Project Phoenix</strong> has 78%
                probability of delay based on current sprint velocity and team
                workload. Consider redistributing tasks from Alex K. (85%
                capacity) to available team members.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-sm font-medium">
                  Action Required
                </span>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  High Priority
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Workload Analysis */}
        <WorkloadChart />

        {/* Project Health Overview */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Active Projects
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectHealthCard
              projectName="E-Commerce Platform Redesign"
              clientName="TechCorp Solutions"
              progress={78}
              healthScore={92}
              status="healthy"
              sprint="Sprint 4/6"
              dueDate="Dec 15, 2025"
            />
            <ProjectHealthCard
              projectName="Mobile Banking App"
              clientName="FinanceHub Inc"
              progress={45}
              healthScore={68}
              status="at-risk"
              sprint="Sprint 2/8"
              dueDate="Jan 30, 2026"
            />
            <ProjectHealthCard
              projectName="AI Analytics Dashboard"
              clientName="DataViz Pro"
              progress={92}
              healthScore={95}
              status="healthy"
              sprint="Sprint 7/8"
              dueDate="Nov 20, 2025"
            />
            <ProjectHealthCard
              projectName="Healthcare Portal"
              clientName="MediTech Systems"
              progress={34}
              healthScore={45}
              status="critical"
              sprint="Sprint 3/10"
              dueDate="Mar 15, 2026"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
