import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/disputes")({
  head: () => ({ meta: [{ title: "Disputes — MoveOut Admin" }] }),
  component: AdminDisputes,
});

function AdminDisputes() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <AlertTriangle className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-5 text-xl font-bold">Disputes</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Handle customer and provider disputes. This feature is coming soon.
      </p>
    </div>
  );
}
