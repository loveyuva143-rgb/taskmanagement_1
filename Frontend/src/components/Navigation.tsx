import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  UserCircle2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BarChart3, label: "Workload", path: "/workload" },
  { icon: Users, label: "Projects", path: "/projects" },
  { icon: MessageSquare, label: "Communications", path: "/communications" },
  { icon: Settings, label: "Admin", path: "/admin" },
];

const getUserRole = (): "admin" | "manager" | "developer" | "client" => {
  // In a real app, this would check authentication token or API
  const userEmail = "admin@zenycon.com";
  if (userEmail === "admin@zenycon.com") return "admin";
  return "manager"; // Default to manager for authorized access
};

export const Navigation = () => {
  const location = useLocation();
  const userRole = getUserRole();
  const isAuthorized = userRole === "admin" || userRole === "manager";

  // Filter navigation items based on role and authorization
  const getVisibleNavItems = () => {
    const visibleItems = navItems.filter((item) => {
      // All users can see Dashboard, Workload, and Projects
      if (item.path === "/" || item.path === "/workload" || item.path === "/projects") {
        return true;
      }
      // Communications and Admin require manager or admin access
      if (item.path === "/communications" || item.path === "/admin") {
        return isAuthorized;
      }
      return false;
    });
    return visibleItems;
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Zenycon PIP
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Project Intelligence
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {getVisibleNavItems().map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 transition-all",
                  isActive &&
                    "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <UserCircle2 className="w-8 h-8 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate capitalize">
              {userRole} Access
            </p>
            <p className="text-xs text-muted-foreground">admin@zenycon.com</p>
          </div>
          {isAuthorized && (
            <Shield className="w-4 h-4 text-primary" title="Authorized Access" />
          )}
        </div>
      </div>
    </div>
  );
};
