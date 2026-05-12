import { Link, useLocation } from "@tanstack/react-router";
import { LayoutList, Send, Briefcase, Wallet, User } from "lucide-react";

const tabs = [
  { label: "Requests", icon: LayoutList, to: "/provider" as const, exact: true },
  { label: "My Bids", icon: Send, to: "/provider/bids" as const, exact: false },
  { label: "Jobs", icon: Briefcase, to: "/provider/jobs" as const, exact: false },
  { label: "Wallet", icon: Wallet, to: "/provider/wallet" as const, exact: false },
  { label: "Profile", icon: User, to: "/provider/profile" as const, exact: false },
];

export function ProviderBottomNav() {
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
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
