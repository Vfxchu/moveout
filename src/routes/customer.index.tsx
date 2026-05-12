import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Plus, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/customer/")({
  head: () => ({ meta: [{ title: "My requests — MoveOut" }] }),
  component: CustomerHome,
});

function CustomerHome() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("requests")
        .select("id, location, status, total_amount, preferred_date, created_at, request_services(id, services(name))")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      setRequests(data ?? []);
      setLoading(false);
    };
    load();
    const ch = supabase.channel("cust-requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "requests", filter: `customer_id=eq.${user.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your requests</h1>
        <Link to="/customer/new" className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : requests.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No requests yet.</p>
          <Link to="/customer/new" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Create your first request
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {requests.map((r) => (
            <li key={r.id}>
              <Link
                to="/customer/r/$id"
                params={{ id: r.id }}
                className="block rounded-xl border border-border bg-card p-4 hover:border-primary"
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
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {new Date(r.created_at).toLocaleDateString()}
                  {r.total_amount && <span className="ml-auto font-medium text-foreground">₹{r.total_amount}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
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
