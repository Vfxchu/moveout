import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";

export const Route = createFileRoute("/provider/wallet")({
  head: () => ({ meta: [{ title: "Wallet — MoveOut" }] }),
  component: ProviderWallet,
});

function ProviderWallet() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Wallet className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-5 text-xl font-bold">Wallet</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Track your earnings and payment history. This feature is coming soon.
      </p>
    </div>
  );
}
