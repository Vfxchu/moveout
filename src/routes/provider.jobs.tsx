import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { ChatWindow } from "@/components/ChatWindow";

export const Route = createFileRoute("/provider/jobs")({
  head: () => ({ meta: [{ title: "Active Jobs — MoveOut" }] }),
  component: ProviderJobs,
});

function ProviderJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("bids")
        .select("id, request_service_id, amount, status, eta_hours, notes, request_services(request_id, job_status, services(name), requests(location, customer_id))")
        .eq("provider_id", user.id)
        .eq("status", "accepted")
        .order("created_at", { ascending: false });
      setJobs((data as any) ?? []);
      setLoading(false);
    };
    load();
    const ch = supabase.channel("provider-jobs")
      .on("postgres_changes", { event: "*", schema: "public", table: "bids", filter: `provider_id=eq.${user.id}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "request_services" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  return (
    <>
      <h1 className="text-2xl font-bold">Active Jobs</h1>
      <p className="mt-1 text-sm text-muted-foreground">Jobs you have been awarded.</p>

      {loading ? (
        <div className="flex py-12 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : jobs.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No active jobs.</p>
          <p className="mt-2 text-xs text-muted-foreground">Once a customer accepts your bid, jobs will appear here.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {jobs.map((bid) => (
            <JobCard key={bid.id} bid={bid} currentUserId={user!.id} />
          ))}
        </ul>
      )}
    </>
  );
}

function JobCard({ bid, currentUserId }: { bid: any; currentUserId: string }) {
  const [status, setStatus] = useState<string | null>(bid.request_services?.job_status || null);
  const [showChat, setShowChat] = useState(false);
  async function update(s: string) {
    await supabase.from("request_services").update({ job_status: s as any }).eq("id", bid.request_service_id);
    if (s === "completed") {
      // mark request completed if all done
      const { data: rs } = await supabase.from("request_services").select("job_status, request_id").eq("id", bid.request_service_id).single();
      if (rs) {
        const { data: all } = await supabase.from("request_services").select("job_status").eq("request_id", rs.request_id);
        if ((all ?? []).every((x) => x.job_status === "completed")) {
          await supabase.from("requests").update({ status: "completed" }).eq("id", rs.request_id);
        } else {
          await supabase.from("requests").update({ status: "in_progress" }).eq("id", rs.request_id);
        }
      }
    } else {
      const { data: rs } = await supabase.from("request_services").select("request_id").eq("id", bid.request_service_id).single();
      if (rs) await supabase.from("requests").update({ status: "in_progress" }).eq("id", rs.request_id);
    }
    setStatus(s);
    toast.success(`Status: ${s.replace(/_/g, " ")}`);
  }
  const steps = ["on_the_way", "started", "completed"];
  return (
    <li className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{bid.request_services.services.name}</div>
          <div className="text-xs text-muted-foreground">{bid.request_services.requests.location}</div>
        </div>
        <div className="text-right">
          <div className="font-bold">₹{bid.amount}</div>
          <button onClick={() => setShowChat(!showChat)} className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <MessageSquare className="h-3 w-3" /> {showChat ? "Hide chat" : "Message customer"}
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {steps.map((s) => {
          const isActive = status === s;
          return (
            <button 
              key={s} 
              onClick={() => update(s)} 
              className={`rounded-md border px-3 py-1.5 text-xs capitalize transition-colors ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary hover:border-primary"}`}
            >
              {s === "completed" && <CheckCircle2 className="mr-1 inline h-3 w-3" />}
              {s.replace(/_/g, " ")}
            </button>
          );
        })}
      </div>
      {showChat && (
        <div className="mt-4 h-[350px]">
          <ChatWindow
            requestId={bid.request_services.request_id}
            currentUserId={currentUserId}
            recipientId={bid.request_services.requests.customer_id}
          />
        </div>
      )}
    </li>
  );
}
