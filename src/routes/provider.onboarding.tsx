import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Clock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/provider/onboarding")({
  head: () => ({ meta: [{ title: "Provider Onboarding — MoveOut" }] }),
  component: ProviderOnboarding,
});

function ProviderOnboarding() {
  const { user } = useAuth();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [mySvcIds, setMySvcIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // onboarding form
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [busy, setBusy] = useState(false);

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

  async function createProvider(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.from("providers").insert({
        id: user.id, business_name: businessName, phone, service_area: serviceArea,
      }).select().single();
      if (error) throw error;
      setProvider(data);
      toast.success("Profile submitted! Awaiting verification.");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }

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

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  // No provider record — show registration form
  if (!provider) {
    return (
      <>
        <h1 className="text-2xl font-bold">Provider onboarding</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tell us about your business. An admin will verify.</p>
        <form onSubmit={createProvider} className="mt-5 space-y-6">
          <div><Label>Business name</Label><Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required /></div>
          <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><Label>Service area</Label><Input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="e.g. Mumbai metro" /></div>
          <Button type="submit" disabled={busy} className="w-full shadow-sm">{busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</> : "Submit for verification"}</Button>
        </form>
      </>
    );
  }

  // Provider exists but not approved — show pending status + service picker
  return (
    <>
      <div className="rounded-xl border border-warning/40 bg-warning/10 p-5">
        <Clock className="h-5 w-5 text-warning-foreground" />
        <h2 className="mt-2 font-semibold">Verification {provider.status}</h2>
        <p className="mt-1 text-sm text-muted-foreground">An admin will review your account shortly.</p>
      </div>
      <div className="mt-6">
        <Label className="mb-2 block">Pick the services you offer</Label>
        <div className="grid grid-cols-2 gap-2">
          {services.map((s) => (
            <button key={s.id} onClick={() => toggleService(s.id)} className={`flex min-h-[80px] flex-col justify-center rounded-xl border p-3 text-left text-sm shadow-sm transition-all ${mySvcIds.has(s.id) ? "border-primary bg-primary text-primary-foreground shadow-primary/20" : "border-border bg-card hover:border-primary/40"}`}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
