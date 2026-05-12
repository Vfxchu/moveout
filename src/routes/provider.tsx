import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { ProviderBottomNav } from "@/components/ProviderBottomNav";
import { RequireAuth } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, LogOut } from "lucide-react";

export const Route = createFileRoute("/provider")({
  component: ProviderLayout,
});

function ProviderLayout() {
  return (
    <RequireAuth role="provider">
      <ProviderShell />
    </RequireAuth>
  );
}

function ProviderShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [providerStatus, setProviderStatus] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("providers").select("status").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        setProviderStatus(data?.status ?? null);
        setChecked(true);
      });
  }, [user]);

  const isOnboarding = pathname.startsWith("/provider/onboarding");
  const isApproved = providerStatus === "approved";

  // Onboarding guard
  useEffect(() => {
    if (!checked) return;
    if (!isOnboarding && !isApproved) {
      // Non-approved provider trying to access dashboard -> redirect to onboarding
      navigate({ to: "/provider/onboarding" });
    } else if (isOnboarding && isApproved) {
      // Approved provider trying to access onboarding -> redirect to dashboard
      navigate({ to: "/provider" });
    }
  }, [checked, isOnboarding, isApproved, navigate]);

  if (!checked) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  // Prevent flash while redirecting in either direction
  if ((!isOnboarding && !isApproved) || (isOnboarding && isApproved)) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur">
        <Link to="/provider" className="flex items-center gap-2 font-semibold text-primary">
          <Sparkles className="h-5 w-5" /> MoveOut Pro
        </Link>
        <button
          onClick={async () => { await signOut(); navigate({ to: "/" }); }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">
        <Outlet />
      </main>
      <ProviderBottomNav />
    </div>
  );
}
