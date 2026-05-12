import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { ReactNode } from "react";

export function AppShell({ title, children, bottomNav }: { title: string; children: ReactNode; bottomNav?: ReactNode }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
          <Sparkles className="h-5 w-5" /> {title}
        </Link>
        <button
          onClick={async () => { await signOut(); navigate({ to: "/" }); }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
      {bottomNav && (
        <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card">
          <div className="mx-auto flex max-w-3xl">{bottomNav}</div>
        </nav>
      )}
    </div>
  );
}

export function RequireAuth({ children, role }: { children: ReactNode; role?: "customer" | "provider" | "admin" }) {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) { navigate({ to: "/auth" }); return null; }
  if (role && !roles.includes(role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-sm text-muted-foreground">You don't have access to this area.</p>
        <button onClick={() => navigate({ to: "/" })} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Go home</button>
      </div>
    );
  }
  return <>{children}</>;
}
