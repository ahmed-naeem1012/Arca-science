import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Lightbulb,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "KOL Explorer", href: "/explorer", icon: Users },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Insights", href: "/insights", icon: Lightbulb },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-sidebar-border",
          collapsed
            ? "justify-center px-2 flex-col gap-1"
            : "justify-between px-4"
        )}
      >
        {collapsed ? (
          <>
            {/* Collapsed: Stack icon and toggle vertically */}
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
              <Activity className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center w-8 h-6 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            {/* Expanded: Normal layout */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
                <Activity className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div className="animate-fade-in">
                <h1 className="text-base font-semibold text-sidebar-foreground">
                  KOL Analytics
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Medical Intelligence
                </p>
              </div>
            </div>

            {/* Collapse Toggle - Top Right */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center w-8 h-8 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex-shrink-0"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "sidebar-nav-item",
                isActive && "sidebar-nav-item-active"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="animate-fade-in">{item.title}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
