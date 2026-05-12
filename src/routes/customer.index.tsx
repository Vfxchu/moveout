import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Plus, Clock, CheckCircle2, Loader2, Sparkles, LayoutList, MessageSquare, User, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/customer/")({
  head: () => ({ meta: [{ title: "Home — MoveOut" }] }),
  component: CustomerHome,
});

function CustomerHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // Load services
      const { data: s } = await supabase.from("services").select("*").eq("active", true).order("name");
      setServices(s ?? []);

      // Load recent activity
      const { data } = await supabase
        .from("requests")
        .select("id, location, status, total_amount, preferred_date, created_at, request_services(id, services(name))")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      setRequests(data ?? []);
      setLoading(false);
    };
    load();
    const ch = supabase.channel("cust-home")
      .on("postgres_changes", { event: "*", schema: "public", table: "requests", filter: `customer_id=eq.${user.id}` }, () => {
         // Reload recent requests
         supabase.from("requests")
          .select("id, location, status, total_amount, preferred_date, created_at, request_services(id, services(name))")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)
          .then(({data}) => setRequests(data ?? []));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const fallbackServices = [
    { name: "Painting" }, { name: "Cleaning" }, { name: "Handyman" }, { name: "AC Service" },
    { name: "Plumbing" }, { name: "Electrical" }, { name: "Moving" }, { name: "Pest Control" }
  ];

  const displayServices = services.length > 0 ? services : fallbackServices;

  return (
    <div className="-mt-6 -mx-6 pb-6">
      {/* Hero Section */}
      <div className="bg-primary px-6 pb-12 pt-14 text-primary-foreground">
        <h1 className="text-2xl font-bold">Hello! 👋</h1>
        <p className="mt-1 text-primary-foreground/80">What do you need help with today?</p>

        {/* Quick Actions Row */}
        <div className="mt-8 flex justify-between gap-2">
          <QuickAction icon={Plus} label="New Request" onClick={() => navigate({ to: "/customer/new" })} />
          <QuickAction icon={LayoutList} label="My Requests" onClick={() => navigate({ to: "/customer/orders" })} />
          <QuickAction icon={MessageSquare} label="Messages" onClick={() => navigate({ to: "/customer/messages" })} />
          <QuickAction icon={User} label="Profile" onClick={() => navigate({ to: "/customer/profile" })} />
        </div>
      </div>

      <div className="-mt-6 px-6 relative z-10">
        {/* Services Grid */}
        <div className="rounded-2xl bg-card p-5 shadow-sm border border-border">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Book a Service</h2>
          </div>
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            {displayServices.slice(0, 8).map((s, i) => (
              <button 
                key={s.id || i}
                onClick={() => navigate({ to: "/customer/new" })}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105 group-active:scale-95">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-center text-[10px] font-medium leading-tight">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Recent Activity</h2>
            {requests.length > 0 && (
              <Link to="/customer/orders" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex py-12 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card">
              <p className="text-sm text-muted-foreground">No recent activity.</p>
              <Link to="/customer/new" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform active:scale-95">
                Create your first request
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {requests.map((r) => (
                <li key={r.id}>
                  <Link
                    to="/customer/r/$id"
                    params={{ id: r.id }}
                    className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{r.location}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {r.request_services?.map((rs: any) => rs.services?.name).filter(Boolean).join(" · ")}
                        </div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {new Date(r.created_at).toLocaleDateString()}
                      </div>
                      {r.total_amount && <span className="font-semibold text-foreground">₹{r.total_amount}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-1 flex-col items-center gap-2 group">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm transition-transform group-hover:scale-105 group-active:scale-95">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-medium text-white/90 text-center leading-tight">
        {label}
      </span>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { c: string; l: string; icon?: any }> = {
    open: { c: "bg-secondary text-secondary-foreground", l: "Receiving bids" },
    awarded: { c: "bg-primary/10 text-primary", l: "Awarded" },
    in_progress: { c: "bg-warning/20 text-warning-foreground", l: "In progress" },
    completed: { c: "bg-success/15 text-success", l: "Completed", icon: CheckCircle2 },
    cancelled: { c: "bg-muted text-muted-foreground", l: "Cancelled" },
  };
  const s = map[status] ?? map.open;
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${s.c}`}>{s.l}</span>;
}
