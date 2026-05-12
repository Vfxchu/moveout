import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface ChatWindowProps {
  requestId: string;
  currentUserId: string;
  recipientId: string;
  onClose?: () => void;
}

export function ChatWindow({ requestId, currentUserId, recipientId, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error: err } = await supabase
          .from("messages")
          .select("*")
          .eq("request_id", requestId)
          .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
          .order("created_at", { ascending: true });

        if (err) throw err;
        setMessages(data ?? []);
      } catch (e: any) {
        setError(e.message ?? "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    const ch = supabase.channel(`chat-${requestId}-${recipientId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `request_id=eq.${requestId}` },
        (payload) => {
          const msg = payload.new;
          if (
            (msg.sender_id === currentUserId && msg.recipient_id === recipientId) ||
            (msg.sender_id === recipientId && msg.recipient_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [requestId, currentUserId, recipientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const body = newMessage.trim();
    if (!body) return;

    setSending(true);
    try {
      const { error: err } = await supabase.from("messages").insert({
        request_id: requestId,
        sender_id: currentUserId,
        recipient_id: recipientId,
        body,
      });
      if (err) throw err;
      setNewMessage("");
    } catch (e: any) {
      setError(e.message ?? "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[400px] flex-col rounded-xl border border-border bg-card shadow-sm">
      {onClose && (
        <div className="flex items-center justify-between border-b border-border p-3">
          <h3 className="font-semibold">Chat</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
      )}
      
      {error && (
        <div className="m-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-secondary-foreground rounded-bl-none"
                  }`}
                >
                  {msg.body}
                  <div className={`mt-1 text-[10px] ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t border-border p-3 flex gap-2 bg-background/50 rounded-b-xl">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1"
        />
        <Button type="submit" disabled={sending || !newMessage.trim()} size="icon" className="shrink-0 shadow-sm">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
