import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/provider/bids")({
  head: () => ({ meta: [{ title: "My Bids — MoveOut" }] }),
  component: ProviderBids,
});

function ProviderBids() {
  const { user } = useAuth();
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("bids")
        .select("id, request_service_id, amount, status, eta_hours, notes, created_at, request_services(services(name), requests(location, status))")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });
      setBids((data as any) ?? []);
      setLoading(false);
    };
    load();
    const ch = supabase.channel("provider-bids")
      .on("postgres_changes", { event: "*", schema: "public", table: "bids", filter: `provider_id=eq.${user.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  return (
    <>
      <h1 className="text-2xl font-bold">My Bids</h1>
      <p className="mt-1 text-sm text-muted-foreground">All bids you have submitted.</p>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : bids.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No bids yet.</p>
          <p className="mt-2 text-xs text-muted-foreground">Browse open requests to start bidding.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {bids.map((b) => (
            <li key={b.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{b.request_services?.services?.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.request_services?.requests?.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₹{b.amount}</div>
                  <BidStatusBadge status={b.status} />
                </div>
              </div>
              {b.notes && <p className="mt-2 text-xs text-muted-foreground">"{b.notes}"</p>}
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(b.created_at).toLocaleDateString()}
                {b.eta_hours && <span>· ~{b.eta_hours}h ETA</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function BidStatusBadge({ status }: { status: string }) {
  const map: Record<string, { c: string; l: string }> = {
    pending: { c: "bg-secondary text-secondary-foreground", l: "Pending" },
    accepted: { c: "bg-success/15 text-success", l: "Accepted" },
    rejected: { c: "bg-destructive/15 text-destructive", l: "Rejected" },
    withdrawn: { c: "bg-muted text-muted-foreground", l: "Withdrawn" },
  };
  const s = map[status] ?? map.pending;
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s.c}`}>{s.l}</span>;
}
