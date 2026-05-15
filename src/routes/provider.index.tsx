import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Star,
  Briefcase,
  Send,
  CheckCircle2,
  MapPin,
  CalendarDays,
  ChevronRight,
  MessageSquare,
  User,
  LayoutList,
  Check,
  ClipboardList,
  Inbox,
} from "lucide-react";

export const Route = createFileRoute("/provider/")(
  {
    head: () => ({ meta: [{ title: "Provider — MoveOut" }] }),
    component: ProviderDashboard,
  }
);

/* ─────────────────────────────────────────────────────────
   Skeleton shimmer for loading state
───────────────────────────────────────────────────────── */
function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-100 ${className}`}
      style={{ minHeight: 80 }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Main dashboard
───────────────────────────────────────────────────────── */
function ProviderDashboard() {
  const { user } = useAuth();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [mySvcIds, setMySvcIds] = useState<Set<string>>(new Set());
  const [openServices, setOpenServices] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── initial data load (UNCHANGED logic) ── */
  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const { data: p } = await supabase
        .from("providers")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      setProvider(p);
      const { data: s } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("name");
      setServices(s ?? []);
      if (p) {
        const { data: ps } = await supabase
          .from("provider_services")
          .select("service_id")
          .eq("provider_id", user.id);
        setMySvcIds(new Set((ps ?? []).map((r) => r.service_id)));
      }
      setLoading(false);
    };
    init();
  }, [user]);

  /* ── realtime feed (UNCHANGED logic) ── */
  useEffect(() => {
    if (!provider || provider.status !== "approved" || mySvcIds.size === 0)
      return;
    const load = async () => {
      const { data: rs } = await supabase
        .from("request_services")
        .select(
          "id, service_id, request_id, awarded_bid_id, job_status, services(name), requests(location, notes, preferred_date, status, customer_id)"
        )
        .in("service_id", Array.from(mySvcIds))
        .is("awarded_bid_id", null);
      setOpenServices(
        ((rs as any) ?? []).filter((x: any) => x.requests?.status === "open")
      );
      const { data: bb } = await supabase
        .from("bids")
        .select(
          "id, request_service_id, amount, status, eta_hours, notes, request_services(services(name), requests(location, customer_id))"
        )
        .eq("provider_id", user!.id)
        .order("created_at", { ascending: false });
      setMyBids((bb as any) ?? []);
    };
    load();
    const ch = supabase
      .channel("provider-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "request_services" },
        load
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "requests" },
        load
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bids",
          filter: `provider_id=eq.${user!.id}`,
        },
        load
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [provider, mySvcIds, user]);

  /* ── service toggle (UNCHANGED logic) ── */
  async function toggleService(serviceId: string) {
    if (!user) return;
    if (mySvcIds.has(serviceId)) {
      await supabase
        .from("provider_services")
        .delete()
        .eq("provider_id", user.id)
        .eq("service_id", serviceId);
      setMySvcIds((s) => {
        const n = new Set(s);
        n.delete(serviceId);
        return n;
      });
    } else {
      await supabase
        .from("provider_services")
        .insert({ provider_id: user.id, service_id: serviceId });
      setMySvcIds((s) => new Set(s).add(serviceId));
    }
  }

  /* ── loading state ── */
  if (loading) {
    return (
      <div className="space-y-4 pb-4">
        <SkeletonCard className="h-36" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} className="h-20" />
          ))}
        </div>
        <SkeletonCard className="h-14" />
        <SkeletonCard className="h-28" />
        <SkeletonCard className="h-44" />
      </div>
    );
  }

  if (!provider) return null;

  /* ── derived values ── */
  const initials = (provider.business_name ?? provider.full_name ?? "P")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isApproved = provider.status === "approved";
  const activeBids = myBids.filter((b) => b.status === "pending").length;

  /* ── quick actions ── */
  const quickActions = [
    { label: "Requests", icon: LayoutList, to: "/provider" as const },
    { label: "My Bids", icon: Send, to: "/provider/bids" as const },
    { label: "Jobs", icon: Briefcase, to: "/provider/jobs" as const },
    {
      label: "Messages",
      icon: MessageSquare,
      to: "/provider/messages" as const,
    },
    { label: "Profile", icon: User, to: "/provider/profile" as const },
  ];

  return (
    <div className="space-y-5 pb-4">
      {/* ── HERO CARD ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
        style={{
          background: "linear-gradient(135deg, #0066FF 0%, #0044BB 100%)",
        }}
      >
        {/* decorative blobs */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20"
          style={{ background: "rgba(255,255,255,0.4)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-6 right-16 h-20 w-20 rounded-full opacity-10"
          style={{ background: "rgba(255,255,255,0.6)" }}
        />

        <div className="relative flex items-start justify-between">
          {/* left: name + status */}
          <div>
            <p className="text-sm font-medium text-blue-100">Good day 👋</p>
            <h1 className="mt-0.5 text-xl font-bold leading-tight">
              {provider.business_name ?? provider.full_name ?? "Provider"}
            </h1>
            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isApproved
                  ? "bg-green-400/30 text-green-100"
                  : "bg-yellow-400/30 text-yellow-100"
              }`}
            >
              {isApproved ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {isApproved ? "Approved" : provider.status ?? "Pending"}
            </span>
          </div>

          {/* right: avatar */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold ring-2 ring-white/40">
            {initials}
          </div>
        </div>

        {/* open requests count teaser */}
        {openServices.length > 0 && (
          <div className="relative mt-4 flex items-center justify-between rounded-xl bg-white/15 px-3 py-2">
            <span className="text-sm font-medium">
              🔔 {openServices.length} open request
              {openServices.length !== 1 ? "s" : ""} waiting for you
            </span>
            <ChevronRight className="h-4 w-4 opacity-70" />
          </div>
        )}
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-4 gap-2">
        <StatPill
          icon={<Star className="h-4 w-4 text-yellow-400" />}
          label="Rating"
          value={Number(provider.rating ?? 0).toFixed(1)}
        />
        <StatPill
          icon={<Briefcase className="h-4 w-4 text-blue-500" />}
          label="Jobs"
          value={provider.jobs_completed ?? 0}
        />
        <StatPill
          icon={<ClipboardList className="h-4 w-4 text-purple-500" />}
          label="Bids"
          value={activeBids}
        />
        <StatPill
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
          label="Status"
          value={isApproved ? "✓" : "…"}
          valueColor={isApproved ? "text-green-600" : "text-yellow-500"}
        />
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Quick Actions
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex flex-none flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                <a.icon className="h-4 w-4 text-blue-600" />
              </div>
              <span className="whitespace-nowrap text-[10px] font-semibold text-gray-600">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── MY SERVICES ── */}
      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            My Services
          </p>
          <span className="text-xs text-gray-400">
            {mySvcIds.size} selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => {
            const active = mySvcIds.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleService(s.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all active:scale-95 ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                }`}
              >
                {active && <Check className="h-3 w-3" />}
                {s.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── OPEN REQUESTS ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Open Requests for You
          </p>
          {openServices.length > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {openServices.length}
            </span>
          )}
        </div>

        {openServices.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 px-6 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Inbox className="h-7 w-7 text-blue-400" />
            </div>
            <p className="font-semibold text-gray-700">No open requests yet</p>
            <p className="mt-1 text-sm text-gray-400">
              New customer requests matching your services will appear here.
            </p>
            <p className="mt-2 text-xs text-blue-500">
              Make sure your services are selected above ↑
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {openServices.map((rs: any) => (
              <BidCard
                key={rs.id}
                rs={rs}
                providerId={user!.id}
                existingBid={myBids.find(
                  (b) => b.request_service_id === rs.id
                )}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Stat pill card
───────────────────────────────────────────────────────── */
function StatPill({
  icon,
  label,
  value,
  valueColor = "text-gray-800",
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  valueColor?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-gray-100 bg-white py-3 px-1 shadow-sm">
      {icon}
      <span className={`text-base font-bold leading-none ${valueColor}`}>
        {value}
      </span>
      <span className="text-[9px] font-medium text-gray-400">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Bid card (modern job card)
   — all bid insert/update logic is UNCHANGED
───────────────────────────────────────────────────────── */
function BidCard({
  rs,
  providerId,
  existingBid,
}: {
  rs: any;
  providerId: string;
  existingBid?: any;
}) {
  const [amount, setAmount] = useState(existingBid?.amount ?? "");
  const [eta, setEta] = useState(existingBid?.eta_hours ?? "");
  const [notes, setNotes] = useState(existingBid?.notes ?? "");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(!existingBid);

  /* ── bid submit/update — UNCHANGED logic ── */
  async function submit() {
    if (!amount) return toast.error("Enter an amount");
    setBusy(true);
    try {
      if (existingBid) {
        await supabase
          .from("bids")
          .update({
            amount: Number(amount),
            eta_hours: eta ? Number(eta) : null,
            notes,
          })
          .eq("id", existingBid.id);
        toast.success("Bid updated");
      } else {
        const { error } = await supabase.from("bids").insert({
          request_service_id: rs.id,
          provider_id: providerId,
          amount: Number(amount),
          eta_hours: eta ? Number(eta) : null,
          notes,
        });
        if (error) throw error;
        toast.success("Bid submitted!");
      }
      setExpanded(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  const location = rs.requests?.location;
  const preferredDate = rs.requests?.preferred_date;
  const customerNotes = rs.requests?.notes;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* card header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex-1 min-w-0">
          {/* service badge */}
          <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {rs.services?.name}
          </span>

          {/* location + date */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {location && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3 text-gray-400" />
                {location}
              </span>
            )}
            {preferredDate && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <CalendarDays className="h-3 w-3 text-gray-400" />
                {new Date(preferredDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* customer notes */}
          {customerNotes && (
            <p className="mt-2 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs italic text-gray-500 leading-relaxed">
              "{customerNotes}"
            </p>
          )}
        </div>

        {/* bid sent badge or expand toggle */}
        <div className="ml-3 flex flex-col items-end gap-1.5 shrink-0">
          {existingBid && (
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
              <CheckCircle2 className="h-3 w-3" />
              Bid sent
            </span>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            {expanded ? "Hide" : existingBid ? "Edit bid" : "Place bid"}
          </button>
        </div>
      </div>

      {/* divider */}
      <div className="mx-4 h-px bg-gray-100" />

      {/* collapsed summary */}
      {!expanded && existingBid && (
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="text-sm">
            <span className="text-gray-400 text-xs">Your bid</span>
            <p className="font-bold text-gray-800">₹{existingBid.amount}</p>
          </div>
          {existingBid.eta_hours && (
            <div className="text-sm">
              <span className="text-gray-400 text-xs">ETA</span>
              <p className="font-bold text-gray-800">
                {existingBid.eta_hours}h
              </p>
            </div>
          )}
        </div>
      )}

      {/* bid form — shown when expanded */}
      {expanded && (
        <div className="px-4 pb-4 pt-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="e.g. 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                ETA (hours)
              </label>
              <Input
                type="number"
                placeholder="e.g. 3"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Note to customer
            </label>
            <Textarea
              placeholder="Add a message for the customer…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[64px] rounded-xl text-sm"
            />
          </div>
          <Button
            onClick={submit}
            disabled={busy}
            className="w-full rounded-xl font-semibold"
            style={{ background: "#0066FF" }}
          >
            {busy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : existingBid ? (
              "Update Bid"
            ) : (
              "Submit Bid →"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
