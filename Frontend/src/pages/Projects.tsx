import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
  client: string;
  status: "on-track" | "at-risk" | "critical" | "completed";
  progress: number;
  healthScore: number;
  deadline: string;
  teamSize: number;
  budget: string;
  startDate: string;
}

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const projects: Project[] = [
    {
      id: "1",
      name: "E-Commerce Platform Redesign",
      client: "TechCorp Solutions",
      status: "on-track",
      progress: 78,
      healthScore: 92,
      deadline: "2025-12-15",
      teamSize: 8,
      budget: "$120,000",
      startDate: "2025-08-01",
    },
    {
      id: "2",
      name: "Mobile Banking App",
      client: "FinanceHub Inc",
      status: "at-risk",
      progress: 45,
      healthScore: 68,
      deadline: "2026-01-30",
      teamSize: 6,
      budget: "$85,000",
      startDate: "2025-09-15",
    },
    {
      id: "3",
      name: "AI Analytics Dashboard",
      client: "DataViz Pro",
      status: "on-track",
      progress: 92,
      healthScore: 95,
      deadline: "2025-11-20",
      teamSize: 5,
      budget: "$65,000",
      startDate: "2025-06-01",
    },
    {
      id: "4",
      name: "Healthcare Portal",
      client: "MediTech Systems",
      status: "critical",
      progress: 34,
      healthScore: 45,
      deadline: "2026-03-15",
      teamSize: 12,
      budget: "$180,000",
      startDate: "2025-10-01",
    },
    {
      id: "5",
      name: "Cloud Migration Project",
      client: "InnoTech Solutions",
      status: "on-track",
      progress: 56,
      healthScore: 82,
      deadline: "2026-02-10",
      teamSize: 10,
      budget: "$150,000",
      startDate: "2025-07-15",
    },
    {
      id: "6",
      name: "UI/UX Redesign",
      client: "Creative Studio",
      status: "at-risk",
      progress: 41,
      healthScore: 58,
      deadline: "2025-12-28",
      teamSize: 4,
      budget: "$50,000",
      startDate: "2025-09-01",
    },
    {
      id: "7",
      name: "DevOps Infrastructure",
      client: "CloudFirst Inc",
      status: "completed",
      progress: 100,
      healthScore: 88,
      deadline: "2025-11-10",
      teamSize: 7,
      budget: "$95,000",
      startDate: "2025-05-01",
    },
    {
      id: "8",
      name: "Security Audit System",
      client: "CyberGuard Ltd",
      status: "on-track",
      progress: 63,
      healthScore: 79,
      deadline: "2026-01-15",
      teamSize: 9,
      budget: "$110,000",
      startDate: "2025-08-20",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "on-track": "bg-green-500/10 text-green-700 border-green-500/20",
      "at-risk": "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      "critical": "bg-red-500/10 text-red-700 border-red-500/20",
      "completed": "bg-blue-500/10 text-blue-700 border-blue-500/20",
    };
    return variants[status as keyof typeof variants] || variants["on-track"];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      "on-track": "On Track",
      "at-risk": "At Risk",
      "critical": "Critical",
      "completed": "Completed",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const totalBudget = projects.reduce((sum, p) => {
    return sum + parseFloat(p.budget.replace(/[$,]/g, ""));
  }, 0);

  const projectCount = projects.length;
  const activeProjects = projects.filter(p => p.status !== "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Project Management</h1>
            <p className="text-muted-foreground text-lg">
              Manage and track all your projects in one place
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-3xl">{projectCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {activeProjects} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Budget</CardDescription>
              <CardTitle className="text-3xl">${totalBudget.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Progress</CardDescription>
              <CardTitle className="text-3xl">
                {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projectCount)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Team performance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>At Risk</CardDescription>
              <CardTitle className="text-3xl">
                {projects.filter(p => p.status === "at-risk" || p.status === "critical").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-yellow-600" />
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>
              Search and filter projects by name, client, or status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects or clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Projects Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Project Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Health Score</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No projects found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`${getStatusBadge(project.status)} border`}
                          >
                            {getStatusLabel(project.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getHealthScoreColor(project.healthScore)}`}>
                            {project.healthScore}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(project.deadline)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            {project.teamSize}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{project.budget}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Projects;
