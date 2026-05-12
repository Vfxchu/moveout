import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/provider/")({
  head: () => ({ meta: [{ title: "Provider — MoveOut" }] }),
  component: ProviderDashboard,
});

function ProviderDashboard() {
  const { user } = useAuth();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [mySvcIds, setMySvcIds] = useState<Set<string>>(new Set());
  const [openServices, setOpenServices] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const { data: p } = await supabase.from("providers").select("*").eq("id", user.id).maybeSingle();
      setProvider(p);
      const { data: s } = await supabase.from("services").select("*").eq("active", true).order("name");
      setServices(s ?? []);
      if (p) {
        const { data: ps } = await supabase.from("provider_services").select("service_id").eq("provider_id", user.id);
        setMySvcIds(new Set((ps ?? []).map((r) => r.service_id)));
      }
      setLoading(false);
    };
    init();
  }, [user]);

  // Realtime: load open request_services for my services + my bids
  useEffect(() => {
    if (!provider || provider.status !== "approved" || mySvcIds.size === 0) return;
    const load = async () => {
      const { data: rs } = await supabase
        .from("request_services")
        .select("id, service_id, request_id, awarded_bid_id, job_status, services(name), requests(location, notes, preferred_date, status, customer_id)")
        .in("service_id", Array.from(mySvcIds))
        .is("awarded_bid_id", null);
      setOpenServices(((rs as any) ?? []).filter((x: any) => x.requests?.status === "open"));
      const { data: bb } = await supabase
        .from("bids")
        .select("id, request_service_id, amount, status, eta_hours, notes, request_services(services(name), requests(location, customer_id))")
        .eq("provider_id", user!.id)
        .order("created_at", { ascending: false });
      setMyBids((bb as any) ?? []);
    };
    load();
    const ch = supabase.channel("provider-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "request_services" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "requests" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "bids", filter: `provider_id=eq.${user!.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [provider, mySvcIds, user]);

  async function toggleService(serviceId: string) {
    if (!user) return;
    if (mySvcIds.has(serviceId)) {
      await supabase.from("provider_services").delete().eq("provider_id", user.id).eq("service_id", serviceId);
      setMySvcIds((s) => { const n = new Set(s); n.delete(serviceId); return n; });
    } else {
      await supabase.from("provider_services").insert({ provider_id: user.id, service_id: serviceId });
      setMySvcIds((s) => new Set(s).add(serviceId));
    }
  }

  if (loading) return <p className="mt-8 text-sm text-muted-foreground">Loading…</p>;
  if (!provider) return null;

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Rating" value={Number(provider.rating).toFixed(1)} />
        <Stat label="Jobs" value={provider.jobs_completed} />
        <Stat label="Wallet" value={`₹${provider.wallet_balance}`} />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">My services</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {services.map((s) => (
            <button key={s.id} onClick={() => toggleService(s.id)} className={`rounded-lg border p-2.5 text-left text-sm ${mySvcIds.has(s.id) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
              {s.name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Open requests for you</h2>
        {openServices.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No open requests right now.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {openServices.map((rs: any) => (
              <BidRow key={rs.id} rs={rs} providerId={user!.id} existingBid={myBids.find((b) => b.request_service_id === rs.id)} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

function BidRow({ rs, providerId, existingBid }: { rs: any; providerId: string; existingBid?: any }) {
  const [amount, setAmount] = useState(existingBid?.amount ?? "");
  const [eta, setEta] = useState(existingBid?.eta_hours ?? "");
  const [notes, setNotes] = useState(existingBid?.notes ?? "");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!amount) return toast.error("Enter an amount");
    setBusy(true);
    try {
      if (existingBid) {
        await supabase.from("bids").update({ amount: Number(amount), eta_hours: eta ? Number(eta) : null, notes }).eq("id", existingBid.id);
        toast.success("Bid updated");
      } else {
        const { error } = await supabase.from("bids").insert({
          request_service_id: rs.id, provider_id: providerId, amount: Number(amount), eta_hours: eta ? Number(eta) : null, notes,
        });
        if (error) throw error;
        toast.success("Bid submitted!");
      }
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }

  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{rs.services.name}</div>
          <div className="text-xs text-muted-foreground">{rs.requests.location}{rs.requests.preferred_date ? ` · ${rs.requests.preferred_date}` : ""}</div>
        </div>
        {existingBid && <span className="text-xs text-success">Bid sent</span>}
      </div>
      {rs.requests.notes && <p className="mt-2 text-xs text-muted-foreground">"{rs.requests.notes}"</p>}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Input type="number" placeholder="₹ Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input type="number" placeholder="ETA hrs" value={eta} onChange={(e) => setEta(e.target.value)} />
        <Button onClick={submit} disabled={busy}>{existingBid ? "Update" : "Bid"}</Button>
      </div>
      <Textarea className="mt-2" placeholder="Notes for customer" value={notes} onChange={(e) => setNotes(e.target.value)} />
    </li>
  );
}
