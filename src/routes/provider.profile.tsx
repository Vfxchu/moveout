import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, LogOut, Briefcase, MessageSquare, LifeBuoy, Loader2, Edit2, Check, LayoutList, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/provider/profile")({
  head: () => ({ meta: [{ title: "Profile — MoveOut" }] }),
  component: ProviderProfile,
});

function ProviderProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState("");
  const [newServiceArea, setNewServiceArea] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("providers").select("*").eq("id", user.id).single();
      setProvider(data);
      setNewBusinessName(data?.business_name || "");
      setNewServiceArea(data?.service_area || "");
      setLoading(false);
    };
    load();
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("providers").update({ 
        business_name: newBusinessName,
        service_area: newServiceArea 
      }).eq("id", user.id);
      if (error) throw error;
      setProvider({ ...provider, business_name: newBusinessName, service_area: newServiceArea });
      setEditing(false);
      toast.success("Business details updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update details");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex py-20 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="-mt-6 -mx-6 pb-6 bg-secondary/30 min-h-[calc(100vh-60px)]">
      {/* Top Banner */}
      <div className="bg-primary px-6 pb-8 pt-12 text-primary-foreground">
        <h1 className="text-2xl font-bold">Business Profile</h1>
      </div>

      <div className="-mt-4 px-6 relative z-10 space-y-6">
        {/* Business Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary mb-4">
            {provider?.business_name ? provider.business_name.charAt(0).toUpperCase() : <User />}
          </div>
          
          {editing ? (
            <div className="w-full max-w-xs space-y-2">
              <Input value={newBusinessName} onChange={(e) => setNewBusinessName(e.target.value)} placeholder="Business Name" className="text-sm" />
              <div className="flex items-center gap-2">
                <Input value={newServiceArea} onChange={(e) => setNewServiceArea(e.target.value)} placeholder="Service Area (e.g. Dubai)" className="h-8 text-sm flex-1" />
                <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-bold">{provider?.business_name || "New Provider"}</h2>
                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
              {provider?.service_area && (
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {provider.service_area}
                </div>
              )}
            </>
          )}
          
          <div className="mt-4 flex gap-2">
            <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Provider
            </span>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
              provider?.status === "approved" ? "bg-success/15 text-success" :
              provider?.status === "pending" ? "bg-warning/20 text-warning-foreground" :
              "bg-destructive/15 text-destructive"
            }`}>
              {provider?.status}
            </span>
          </div>
        </div>

        {/* Menu List */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <MenuRow icon={LayoutList} label="Open Requests" onClick={() => navigate({ to: "/provider" })} />
          <MenuRow icon={Briefcase} label="Active Jobs" onClick={() => navigate({ to: "/provider/jobs" })} />
          <MenuRow icon={MessageSquare} label="Messages" onClick={() => navigate({ to: "/provider/messages" })} />
          <MenuRow icon={LifeBuoy} label="Help & Support" onClick={() => toast("Support chat coming soon!")} />
        </div>

        <Button variant="destructive" className="w-full rounded-xl py-6 font-semibold" onClick={() => signOut()}>
          <LogOut className="mr-2 h-5 w-5" /> Sign Out
        </Button>
      </div>
    </div>
  );
}

function MenuRow({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 border-b border-border p-4 text-left last:border-0 hover:bg-secondary/50 transition-colors">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-medium flex-1">{label}</span>
      <span className="text-muted-foreground text-xl">›</span>
    </button>
  );
}
