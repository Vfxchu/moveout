import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Loader2, MessageSquare } from "lucide-react";
import { ChatWindow } from "@/components/ChatWindow";

export const Route = createFileRoute("/provider/messages")({
  head: () => ({ meta: [{ title: "Messages — MoveOut" }] }),
  component: ProviderMessages,
});

function ProviderMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<{ requestId: string; customerId: string; title: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("bids")
        .select("id, request_services(request_id, services(name), requests(location, customer_id))")
        .eq("provider_id", user.id)
        .in("status", ["pending", "accepted"]);

      const convos: any[] = [];
      const seen = new Set();

      for (const bid of data || []) {
        if (bid.request_services?.request_id) {
          const reqId = bid.request_services.request_id;
          const custId = bid.request_services.requests?.customer_id;
          
          if (custId) {
            const key = `${reqId}-${custId}`;
            if (!seen.has(key)) {
              seen.add(key);
              convos.push({
                requestId: reqId,
                customerId: custId,
                title: `${bid.request_services.services?.name} - ${bid.request_services.requests?.location}`,
              });
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
          <h1 className="text-xl font-bold truncate">Customer</h1>
          <div className="text-xs text-muted-foreground truncate">{activeChat.title}</div>
        </div>
        <div className="flex-1 min-h-0">
          <ChatWindow
            requestId={activeChat.requestId}
            currentUserId={user!.id}
            recipientId={activeChat.customerId}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Chat with your customers.</p>

      {conversations.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 text-sm font-medium">No active conversations yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">When your bids are accepted, you can message customers here.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {conversations.map((c) => (
            <li key={`${c.requestId}-${c.customerId}`}>
              <button
                onClick={() => setActiveChat(c)}
                className="w-full rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md text-left flex items-center gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  C
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold">Customer</div>
                  <div className="text-xs text-muted-foreground truncate">{c.title}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
