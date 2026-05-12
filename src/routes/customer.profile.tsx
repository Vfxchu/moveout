import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, LogOut, LayoutList, MessageSquare, LifeBuoy, Loader2, Edit2, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/customer/profile")({
  head: () => ({ meta: [{ title: "Profile — MoveOut" }] }),
  component: CustomerProfile,
});

function CustomerProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setNewName(data?.full_name || "");
      setLoading(false);
    };
    load();
  }, [user]);

  async function handleSaveName() {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({ full_name: newName }).eq("id", user.id);
      if (error) throw error;
      setProfile({ ...profile, full_name: newName });
      setEditingName(false);
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
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
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="-mt-4 px-6 relative z-10 space-y-6">
        {/* User Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary mb-4">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <User />}
          </div>
          
          {editingName ? (
            <div className="flex items-center gap-2 w-full max-w-xs">
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full Name" className="h-8 text-sm" />
              <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleSaveName} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-bold">{profile?.full_name || "New Customer"}</h2>
              <button onClick={() => setEditingName(true)} className="text-muted-foreground hover:text-primary transition-colors">
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          )}
          
          <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
          <span className="mt-3 inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            Customer
          </span>
        </div>

        {/* Menu List */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <MenuRow icon={LayoutList} label="My Requests" onClick={() => navigate({ to: "/customer/orders" })} />
          <MenuRow icon={MessageSquare} label="Messages" onClick={() => navigate({ to: "/customer/messages" })} />
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
