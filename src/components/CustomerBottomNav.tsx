import { Link, useLocation } from "@tanstack/react-router";
import { Home, PlusCircle, ClipboardList, MessageSquare, User } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, to: "/customer" as const, exact: true },
  { label: "New Request", icon: PlusCircle, to: "/customer/new" as const, exact: false },
  { label: "Orders", icon: ClipboardList, to: "/customer/orders" as const, exact: false },
  { label: "Messages", icon: MessageSquare, to: "/customer/messages" as const, exact: false },
  { label: "Profile", icon: User, to: "/customer/profile" as const, exact: false },
];

export function CustomerBottomNav() {
  const { pathname } = useLocation();

  function isActive(to: string, exact: boolean) {
    if (exact) return pathname === to || pathname === to + "/";
    return pathname.startsWith(to);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const active = isActive(tab.to, tab.exact);
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for notched phones */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
