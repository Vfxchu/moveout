import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";

export const Route = createFileRoute("/admin/services")({
  head: () => ({ meta: [{ title: "Services — MoveOut Admin" }] }),
  component: AdminServices,
});

function AdminServices() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Wrench className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-5 text-xl font-bold">Services</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Manage available service categories and pricing. This feature is coming soon.
      </p>
    </div>
  );
}
