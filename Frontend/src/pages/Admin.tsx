import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  Users, 
  UserPlus, 
  Search,
  Edit,
  Trash2,
  Key,
  Bell,
  Settings,
  Lock,
  Check,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "developer" | "client";
  status: "active" | "inactive";
  lastActive: string;
  projects: number;
  permissions: string[];
}

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const users: User[] = [
    {
      id: "1",
      name: "Sarah Chen",
      email: "admin@zenycon.com",
      role: "admin",
      status: "active",
      lastActive: "2025-11-15T10:30:00",
      projects: 12,
      permissions: ["all"]
    },
    {
      id: "2",
      name: "Alex Kumar",
      email: "alex.kumar@zenycon.com",
      role: "manager",
      status: "active",
      lastActive: "2025-11-15T09:15:00",
      projects: 8,
      permissions: ["view", "edit", "assign"]
    },
    {
      id: "3",
      name: "Maria Rodriguez",
      email: "maria@zenycon.com",
      role: "manager",
      status: "active",
      lastActive: "2025-11-15T08:45:00",
      projects: 5,
      permissions: ["view", "edit"]
    },
    {
      id: "4",
      name: "John Smith",
      email: "john.smith@zenycon.com",
      role: "developer",
      status: "active",
      lastActive: "2025-11-15T07:20:00",
      projects: 3,
      permissions: ["view"]
    },
    {
      id: "5",
      name: "Emily Davis",
      email: "emily.davis@techcorp.com",
      role: "client",
      status: "active",
      lastActive: "2025-11-14T16:00:00",
      projects: 2,
      permissions: ["view"]
    },
    {
      id: "6",
      name: "David Park",
      email: "david.park@zenycon.com",
      role: "developer",
      status: "inactive",
      lastActive: "2025-11-10T14:30:00",
      projects: 2,
      permissions: ["view"]
    },
  ];

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-purple-500/10 text-purple-700 border-purple-500/20",
      manager: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      developer: "bg-green-500/10 text-green-700 border-green-500/20",
      client: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    };
    return variants[role as keyof typeof variants] || variants.developer;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500/10 text-green-700 border-green-500/20",
      inactive: "bg-gray-500/10 text-gray-700 border-gray-500/20",
    };
    return variants[status as keyof typeof variants] || variants.inactive;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeUsers = users.filter(u => u.status === "active").length;
  const totalProjects = users.reduce((sum, u) => sum + u.projects, 0);
  const adminCount = users.filter(u => u.role === "admin" || u.role === "manager").length;
  const recentActivity = users.filter(u => {
    const date = new Date(u.lastActive);
    const now = new Date();
    return (now.getTime() - date.getTime()) < 86400000; // Last 24 hours
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-lg">
              User management, roles, and permissions
            </p>
          </div>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with role-based permissions
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@zenycon.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpenAddDialog(false)}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Users</CardDescription>
              <CardTitle className="text-3xl">{activeUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3 text-green-600" />
                of {users.length} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Admins & Managers</CardDescription>
              <CardTitle className="text-3xl">{adminCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary" />
                Elevated access
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Recent Activity</CardDescription>
              <CardTitle className="text-3xl">{recentActivity}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Bell className="w-3 h-3 text-blue-600" />
                Last 24 hours
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-3xl">{totalProjects}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Key className="w-3 h-3 text-purple-600" />
                Assigned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No users found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadge(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.projects}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.lastActive)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {user.permissions.includes("all") ? (
                              <Badge variant="secondary" className="text-xs">
                                <Lock className="w-3 h-3 mr-1" />
                                All Access
                              </Badge>
                            ) : (
                              <div className="flex gap-1">
                                {user.permissions.map((perm, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {perm}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage authentication and access policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Required for all admins</p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700">
                  <Check className="w-3 h-3 mr-1" /> Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <Badge variant="outline">8 hours</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">IP Whitelisting</p>
                  <p className="text-sm text-muted-foreground">Restrict access by IP</p>
                </div>
                <Badge variant="outline" className="bg-red-500/10 text-red-700">
                  <X className="w-3 h-3 mr-1" /> Disabled
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Monitor user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">admin@zenycon.com</p>
                    <p className="text-muted-foreground">Logged in - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">Alex Kumar</p>
                    <p className="text-muted-foreground">Updated project permissions - 5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">System Alert</p>
                    <p className="text-muted-foreground">Security scan completed - 1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
