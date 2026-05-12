import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/customer/messages")({
  head: () => ({ meta: [{ title: "Messages — MoveOut" }] }),
  component: CustomerMessages,
});

function CustomerMessages() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-5 text-xl font-bold">Messages</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Chat with your service providers directly. This feature is coming soon.
      </p>
    </div>
  );
}
