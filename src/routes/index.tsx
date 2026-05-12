import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Sparkles, Users, ShieldCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    if (roles.includes("admin")) navigate({ to: "/admin" });
    else if (roles.includes("provider")) navigate({ to: "/provider" });
    else navigate({ to: "/customer" });
  }, [user, roles, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <Sparkles className="h-5 w-5" /> MoveOut
        </div>
        <Link to="/auth" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Sign in
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-5 pb-20 pt-10">
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
          One booking. <span className="text-primary">Every move-out service.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Tell us what you need — painting, deep cleaning, packing, handyman — and get the best
          combination of trusted providers in seconds.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/auth" className="rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground">
            Get started
          </Link>
          <Link to="/auth" className="rounded-md border border-border bg-secondary px-6 py-3 text-base font-medium text-secondary-foreground">
            Become a provider
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Zap, title: "Smart combos", desc: "Cheapest, best-rated, or fastest — your call." },
            { icon: ShieldCheck, title: "Verified pros", desc: "Every provider is vetted by our team." },
            { icon: Users, title: "Live bidding", desc: "Real bids from real providers, in real time." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-5">
              <f.icon className="h-6 w-6 text-primary" />
              <div className="mt-3 font-semibold">{f.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
