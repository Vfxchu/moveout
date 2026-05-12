import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/admin/requests")({
  head: () => ({ meta: [{ title: "Requests — MoveOut Admin" }] }),
  component: AdminRequests,
});

function AdminRequests() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-5 text-xl font-bold">Requests</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        View and manage all customer service requests. This feature is coming soon.
      </p>
    </div>
  );
}
