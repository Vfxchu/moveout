import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";
import { RequireAuth } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { Sparkles, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <RequireAuth role="admin">
      <AdminShell />
    </RequireAuth>
  );
}

function AdminShell() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur">
          <Link to="/admin" className="flex items-center gap-2 font-semibold text-primary">
            <Sparkles className="h-5 w-5" /> MoveOut Admin
          </Link>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); }}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
