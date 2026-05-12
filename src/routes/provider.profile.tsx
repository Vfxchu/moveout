import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { User } from "lucide-react";

export const Route = createFileRoute("/provider/profile")({
  head: () => ({ meta: [{ title: "Profile — MoveOut" }] }),
  component: ProviderProfile,
});

function ProviderProfile() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <User className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-5 text-xl font-bold">Profile</h1>
      {user?.email && (
        <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
      )}
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Manage your provider profile and settings. This feature is coming soon.
      </p>
    </div>
  );
}
