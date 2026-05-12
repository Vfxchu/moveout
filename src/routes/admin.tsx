import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { AdminSidebar, MobileAdminNav } from "@/components/AdminSidebar";
import { RequireAuth } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { Sparkles, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="md:hidden">
                <Menu className="h-6 w-6 text-foreground" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-4">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="mb-6 mt-4 flex items-center gap-2 font-semibold text-primary">
                  <Sparkles className="h-5 w-5" /> MoveOut Admin
                </div>
                <MobileAdminNav onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <Link to="/admin" className="flex items-center gap-2 font-semibold text-primary">
              <Sparkles className="hidden h-5 w-5 md:block" />
              <span className="md:hidden">Admin</span>
              <span className="hidden md:inline">MoveOut Admin</span>
            </Link>
          </div>
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
