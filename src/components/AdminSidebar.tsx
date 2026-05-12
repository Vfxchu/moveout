import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Users, FileText, Wrench, AlertTriangle, BarChart3 } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" as const, exact: true },
  { label: "Providers", icon: Users, to: "/admin/providers" as const, exact: false },
  { label: "Requests", icon: FileText, to: "/admin/requests" as const, exact: false },
  { label: "Services", icon: Wrench, to: "/admin/services" as const, exact: false },
  { label: "Disputes", icon: AlertTriangle, to: "/admin/disputes" as const, exact: false },
  { label: "Analytics", icon: BarChart3, to: "/admin/analytics" as const, exact: false },
];

export function AdminSidebar() {
  const { pathname } = useLocation();

  function isActive(to: string, exact: boolean) {
    if (exact) return pathname === to || pathname === to + "/";
    return pathname.startsWith(to);
  }

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-border md:bg-card">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4 font-semibold text-primary">
        <LayoutDashboard className="h-5 w-5" />
        Admin
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {items.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                active
                  ? "bg-primary/15 font-semibold text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileAdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();

  function isActive(to: string, exact: boolean) {
    if (exact) return pathname === to || pathname === to + "/";
    return pathname.startsWith(to);
  }

  return (
    <nav className="flex flex-col gap-2 mt-4">
      {items.map((item) => {
        const active = isActive(item.to, item.exact);
        return (
          <Link
            key={item.label}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-base transition-all ${
              active
                ? "bg-primary/15 font-semibold text-primary shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
