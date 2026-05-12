import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Clock, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/customer/orders")({
  head: () => ({ meta: [{ title: "Orders — MoveOut" }] }),
  component: CustomerOrders,
});

function CustomerOrders() {
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
        .in("status", ["awarded", "in_progress", "completed"])
        .order("created_at", { ascending: false });
      setRequests(data ?? []);
      setLoading(false);
    };
    load();
    const ch = supabase.channel("cust-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "requests", filter: `customer_id=eq.${user.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  return (
    <>
      <h1 className="text-2xl font-bold">Your orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">Requests that have been awarded or are in progress.</p>

      {loading ? (
        <div className="flex py-12 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : requests.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No orders yet.</p>
          <p className="mt-2 text-xs text-muted-foreground">Once a provider is awarded, your orders will appear here.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
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
    awarded: { c: "bg-primary/10 text-primary", l: "Awarded" },
    in_progress: { c: "bg-warning/20 text-warning-foreground", l: "In progress" },
    completed: { c: "bg-success/15 text-success", l: "Completed", icon: CheckCircle2 },
    cancelled: { c: "bg-muted text-muted-foreground", l: "Cancelled" },
  };
  const s = map[status] ?? { c: "bg-secondary text-secondary-foreground", l: status };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${s.c}`}>{s.l}</span>;
}
