import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — MoveOut" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, providers: 0, jobs: 0, requests: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ count: u }, { count: p }, { count: r }, { count: a }, { count: pe }] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("providers").select("*", { count: "exact", head: true }).eq("status", "approved"),
          supabase.from("requests").select("*", { count: "exact", head: true }).in("status", ["awarded", "in_progress"]),
          supabase.from("requests").select("*", { count: "exact", head: true }),
          supabase.from("providers").select("*", { count: "exact", head: true }).eq("status", "pending"),
        ]);
        setStats({ users: u ?? 0, providers: p ?? 0, jobs: r ?? 0, requests: a ?? 0, pending: pe ?? 0 });
      } catch (e: any) {
        setError(e.message ?? "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    load();
    const ch = supabase.channel("admin-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "providers" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "requests" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error) return <div className="mt-8 rounded-xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">{error}</div>;

  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your MoveOut platform.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Users" v={stats.users} />
        <Stat label="Approved Providers" v={stats.providers} />
        <Stat label="Pending Approval" v={stats.pending} accent />
        <Stat label="Active Jobs" v={stats.jobs} />
        <Stat label="Total Requests" v={stats.requests} />
      </div>

      {stats.pending > 0 && (
        <div className="mt-6 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm shadow-sm">
          <span className="font-medium text-warning-foreground">{stats.pending} provider(s) awaiting approval.</span>
          {" "}
          <a href="/admin/providers" className="font-medium text-primary underline underline-offset-2">Review now →</a>
        </div>
      )}
    </>
  );
}

function Stat({ label, v, accent }: { label: string; v: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 text-center shadow-sm ${accent ? "border-warning/40 bg-warning/10" : "border-border bg-card"}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${accent && v > 0 ? "text-warning-foreground" : ""}`}>{v}</div>
    </div>
  );
}
