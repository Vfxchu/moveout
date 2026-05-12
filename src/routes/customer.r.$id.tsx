import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, Trophy, Zap, Wallet, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/customer/r/$id")({
  head: () => ({ meta: [{ title: "Request details — MoveOut" }] }),
  component: RequestDetail,
});

type RS = { id: string; service_id: string; awarded_bid_id: string | null; job_status: string | null; services: { name: string } };
type Bid = { id: string; request_service_id: string; provider_id: string; amount: number; eta_hours: number | null; notes: string | null; status: string; providers: { business_name: string; rating: number; review_count: number } };

function RequestDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState<any>(null);
  const [services, setServices] = useState<RS[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: r } = await supabase.from("requests").select("*").eq("id", id).single();
      setRequest(r);
      const { data: rs } = await supabase
        .from("request_services")
        .select("id, service_id, awarded_bid_id, job_status, services(name)")
        .eq("request_id", id);
      setServices((rs as any) ?? []);
      const ids = (rs ?? []).map((x: any) => x.id);
      if (ids.length) {
        const { data: b } = await supabase
          .from("bids")
          .select("id, request_service_id, provider_id, amount, eta_hours, notes, status, providers(business_name, rating, review_count)")
          .in("request_service_id", ids);
        setBids((b as any) ?? []);
      }
      setLoading(false);
    };
    load();
    const ch = supabase.channel(`req-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "bids" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "request_services", filter: `request_id=eq.${id}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "requests", filter: `id=eq.${id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, user]);

  // Smart combinations: cheapest, best-rated, fastest
  const combos = useMemo(() => {
    if (services.length === 0) return null;
    const byService: Record<string, Bid[]> = {};
    services.forEach((s) => { byService[s.id] = bids.filter((b) => b.request_service_id === s.id && b.status === "pending"); });
    const allHaveBids = services.every((s) => byService[s.id].length > 0);
    if (!allHaveBids) return null;
    const pick = (cmp: (a: Bid, b: Bid) => number) =>
      services.map((s) => byService[s.id].slice().sort(cmp)[0]);
    return {
      cheap: pick((a, b) => a.amount - b.amount),
      best: pick((a, b) => b.providers.rating - a.providers.rating),
      fast: pick((a, b) => (a.eta_hours ?? 999) - (b.eta_hours ?? 999)),
    };
  }, [services, bids]);

  async function acceptCombo(combo: Bid[]) {
    try {
      const total = combo.reduce((s, b) => s + Number(b.amount), 0);
      // Accept selected bids
      for (const b of combo) {
        await supabase.from("bids").update({ status: "accepted" }).eq("id", b.id);
        await supabase.from("request_services").update({ awarded_bid_id: b.id, job_status: "confirmed" }).eq("id", b.request_service_id);
      }
      // Reject other bids on those services
      const rsIds = combo.map((b) => b.request_service_id);
      const otherIds = bids.filter((b) => rsIds.includes(b.request_service_id) && !combo.some((c) => c.id === b.id)).map((b) => b.id);
      if (otherIds.length) await supabase.from("bids").update({ status: "rejected" }).in("id", otherIds);
      await supabase.from("requests").update({ status: "awarded", total_amount: total }).eq("id", id);
      toast.success("Booking confirmed!");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to accept");
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!request) return <div className="p-8">Not found.</div>;

  const isAwarded = request.status !== "open";

  return (
    <>
      <Link to="/customer" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="text-xl font-bold">{request.location}</h1>
      <p className="mt-1 text-xs text-muted-foreground">Status: {request.status}</p>

      {!isAwarded && combos && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recommended combos</h2>
          <div className="space-y-3">
            <ComboCard icon={Wallet} label="Cheapest" combo={combos.cheap} services={services} onAccept={() => acceptCombo(combos.cheap)} accent="bg-success" />
            <ComboCard icon={Trophy} label="Best rated" combo={combos.best} services={services} onAccept={() => acceptCombo(combos.best)} accent="bg-primary" />
            <ComboCard icon={Zap} label="Fastest" combo={combos.fast} services={services} onAccept={() => acceptCombo(combos.fast)} accent="bg-warning" />
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">All bids by service</h2>
        <div className="space-y-4">
          {services.map((s) => {
            const sBids = bids.filter((b) => b.request_service_id === s.id);
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{s.services.name}</div>
                  {s.job_status && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{s.job_status.replace(/_/g, " ")}</span>}
                </div>
                {sBids.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">Waiting for bids…</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {sBids.map((b) => (
                      <li key={b.id} className={`flex items-center justify-between rounded-lg border p-3 ${b.status === "accepted" ? "border-success bg-success/5" : "border-border"}`}>
                        <div>
                          <div className="font-medium">{b.providers.business_name}</div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-warning text-warning" /> {Number(b.providers.rating).toFixed(1)} ({b.providers.review_count})
                            {b.eta_hours && <span>· ~{b.eta_hours}h</span>}
                          </div>
                          {b.notes && <p className="mt-1 text-xs text-muted-foreground">{b.notes}</p>}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">₹{b.amount}</div>
                          <div className="text-xs text-muted-foreground capitalize">{b.status}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function ComboCard({ icon: Icon, label, combo, services, onAccept, accent }: {
  icon: any; label: string; combo: Bid[]; services: RS[]; onAccept: () => void; accent: string;
}) {
  const total = combo.reduce((s, b) => s + Number(b.amount), 0);
  const avg = combo.reduce((s, b) => s + Number(b.providers.rating), 0) / combo.length;
  const eta = Math.max(...combo.map((b) => b.eta_hours ?? 0));
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${accent} text-white`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="font-semibold">{label}</div>
        <div className="ml-auto text-2xl font-bold">₹{total}</div>
      </div>
      <ul className="mt-3 space-y-1 text-sm">
        {combo.map((b) => {
          const svc = services.find((s) => s.id === b.request_service_id);
          return (
            <li key={b.id} className="flex justify-between text-muted-foreground">
              <span>{svc?.services.name} · {b.providers.business_name}</span>
              <span>₹{b.amount}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>★ {avg.toFixed(1)} avg{eta ? ` · up to ${eta}h` : ""}</span>
        <Button size="sm" onClick={onAccept}>Book this combo</Button>
      </div>
    </div>
  );
}
