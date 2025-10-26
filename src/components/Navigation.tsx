import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BarChart3, label: "Workload", path: "/workload" },
  { icon: Users, label: "Projects", path: "/projects" },
  { icon: MessageSquare, label: "Communications", path: "/communications" },
  { icon: Settings, label: "Admin", path: "/admin" },
];

export const Navigation = () => {
  const location = useLocation();
  const [role, setRole] = useState<"manager" | "client">("manager");

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
        {navItems.map((item) => {
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
            <p className="text-sm font-medium text-foreground truncate">
              {role === "manager" ? "Manager View" : "Client View"}
            </p>
            <p className="text-xs text-muted-foreground">admin@zenycon.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
