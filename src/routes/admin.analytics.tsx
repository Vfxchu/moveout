import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — MoveOut Admin" }] }),
  component: AdminAnalytics,
});

function AdminAnalytics() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <BarChart3 className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-5 text-xl font-bold">Analytics</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Platform analytics and performance metrics. This feature is coming soon.
      </p>
    </div>
  );
}
