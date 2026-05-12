import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/providers")({
  head: () => ({ meta: [{ title: "Providers — MoveOut Admin" }] }),
  component: AdminProviders,
});

function AdminProviders() {
  const [pending, setPending] = useState<any[]>([]);
  const [allProviders, setAllProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch providers without profiles join (no FK relationship exists)
        const { data: pp, error: e1 } = await supabase.from("providers").select("*").eq("status", "pending");
        if (e1) throw e1;
        const { data: ap, error: e2 } = await supabase.from("providers").select("*").order("created_at", { ascending: false }).limit(50);
        if (e2) throw e2;

        // Collect all unique provider IDs and fetch profiles separately
        const allIds = Array.from(new Set([...(pp ?? []).map((p: any) => p.id), ...(ap ?? []).map((p: any) => p.id)]));
        const profileMap: Record<string, string> = {};
        if (allIds.length > 0) {
          const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", allIds);
          (profiles ?? []).forEach((pr: any) => { profileMap[pr.id] = pr.full_name; });
        }

        // Merge profile names into provider objects
        const withName = (list: any[]) => list.map((p) => ({ ...p, _full_name: profileMap[p.id] ?? null }));
        setPending(withName(pp ?? []));
        setAllProviders(withName(ap ?? []));
      } catch (e: any) {
        setError(e.message ?? "Failed to load providers");
      } finally {
        setLoading(false);
      }
    };
    load();
    const ch = supabase.channel("admin-providers").on("postgres_changes", { event: "*", schema: "public", table: "providers" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function decide(id: string, status: "approved" | "rejected") {
    const { error } = await supabase.from("providers").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Provider ${status}`);
    }
  }

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error) return <div className="mt-8 rounded-xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">{error}</div>;

  return (
    <>
      <h1 className="text-2xl font-bold">Providers</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage provider applications and approvals.</p>

      {/* Pending verification */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pending verification ({pending.length})</h2>
        {pending.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No pending provider requests found.</p>
            <p className="mt-1 text-xs text-muted-foreground">New provider applications will appear here for review.</p>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {pending.map((p) => (
              <li key={p.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.business_name}</div>
                    <div className="text-xs text-muted-foreground">{p._full_name} · {p.phone} · {p.service_area}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => decide(p.id, "rejected")}>Reject</Button>
                    <Button size="sm" onClick={() => decide(p.id, "approved")}>Approve</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* All providers */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">All providers ({allProviders.length})</h2>
        {allProviders.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No provider records found yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Providers will appear here once they register on the platform.</p>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {allProviders.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-sm">
                <div>
                  <div className="font-medium">{p.business_name}</div>
                  <div className="text-xs text-muted-foreground">{p._full_name} · ★ {Number(p.rating).toFixed(1)} · {p.jobs_completed} jobs</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                  p.status === "approved" ? "bg-success/15 text-success" :
                  p.status === "pending" ? "bg-warning/20 text-warning-foreground" :
                  "bg-destructive/15 text-destructive"
                }`}>{p.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
