import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/customer/new")({
  head: () => ({ meta: [{ title: "New request — MoveOut" }] }),
  component: NewRequest,
});

function NewRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").eq("active", true).order("name").then(({ data }) => setServices(data ?? []));
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.size === 0) return toast.error("Pick at least one service");
    if (!user) return;
    setBusy(true);
    try {
      const { data: req, error } = await supabase
        .from("requests")
        .insert({
          customer_id: user.id,
          location,
          rooms: rooms ? parseInt(rooms) : null,
          property_size: propertySize || null,
          preferred_date: date || null,
          notes: notes || null,
        })
        .select()
        .single();
      if (error) throw error;
      const rows = Array.from(selected).map((service_id) => ({ request_id: req.id, service_id }));
      const { error: e2 } = await supabase.from("request_services").insert(rows);
      if (e2) throw e2;
      toast.success("Request posted — providers are bidding now!");
      navigate({ to: "/customer/r/$id", params: { id: req.id } });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create request");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold">What do you need?</h1>
      <p className="mt-1 text-sm text-muted-foreground">Pick all the services you need. Providers will bid in real time.</p>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <Label className="mb-2 block">Services</Label>
          <div className="grid grid-cols-2 gap-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className={`flex min-h-[80px] flex-col justify-center rounded-xl border p-3 text-left text-sm shadow-sm transition-all ${
                  selected.has(s.id)
                    ? "border-primary bg-primary text-primary-foreground shadow-primary/20"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="font-medium">{s.name}</div>
                {s.description && <div className={`mt-0.5 text-xs ${selected.has(s.id) ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.description}</div>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Location / address</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Apt 4B, 123 Main St" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Rooms</Label>
            <Input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} placeholder="2" />
          </div>
          <div>
            <Label>Size</Label>
            <Input value={propertySize} onChange={(e) => setPropertySize(e.target.value)} placeholder="800 sqft" />
          </div>
        </div>

        <div>
          <Label>Preferred date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything providers should know" />
        </div>

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting…</> : "Post request"}
        </Button>
      </form>
    </>
  );
}

