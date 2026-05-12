import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Loader2, MessageSquare } from "lucide-react";
import { ChatWindow } from "@/components/ChatWindow";

export const Route = createFileRoute("/customer/messages")({
  head: () => ({ meta: [{ title: "Messages — MoveOut" }] }),
  component: CustomerMessages,
});

function CustomerMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<{ requestId: string; providerId: string; providerName: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("requests")
        .select("id, location, request_services(awarded_bid_id, bids(id, provider_id, providers(business_name)))")
        .eq("customer_id", user.id)
        .in("status", ["awarded", "in_progress", "completed"]);

      const convos: any[] = [];
      const seen = new Set();

      for (const req of data || []) {
        for (const rs of req.request_services || []) {
          if (rs.awarded_bid_id && rs.bids) {
            const awardedBid = Array.isArray(rs.bids)
              ? rs.bids.find((b: any) => b.id === rs.awarded_bid_id)
              : rs.bids;

            if (awardedBid) {
              const key = `${req.id}-${awardedBid.provider_id}`;
              if (!seen.has(key)) {
                seen.add(key);
                convos.push({
                  requestId: req.id,
                  location: req.location,
                  providerId: awardedBid.provider_id,
                  providerName: awardedBid.providers?.business_name || "Provider",
                });
              }
            }
          }
        }
      }

      setConversations(convos);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return <div className="flex py-20 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (activeChat) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)]">
        <div className="mb-4">
          <button onClick={() => setActiveChat(null)} className="text-sm font-medium text-primary mb-2">← Back to messages</button>
          <h1 className="text-2xl font-bold">{activeChat.providerName}</h1>
        </div>
        <div className="flex-1 min-h-0">
          <ChatWindow
            requestId={activeChat.requestId}
            currentUserId={user!.id}
            recipientId={activeChat.providerId}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Chat with your service providers.</p>

      {conversations.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 text-sm font-medium">No messages yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">Once a provider is awarded your job, you can chat here.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {conversations.map((c) => (
            <li key={`${c.requestId}-${c.providerId}`}>
              <button
                onClick={() => setActiveChat(c)}
                className="w-full rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md text-left flex items-center gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {c.providerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold">{c.providerName}</div>
                  <div className="text-xs text-muted-foreground">Re: {c.location}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
