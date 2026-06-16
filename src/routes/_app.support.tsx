import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CircleDot, Loader2, Clock, CheckCircle2, Inbox } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CreateTicketModal } from "@/components/support/CreateTicketModal";
import { TicketList } from "@/components/support/TicketList";
import { TicketDetailPanel } from "@/components/support/TicketDetailPanel";
import { q } from "@/lib/data/queries";
import type { Ticket } from "@/lib/data/types";

export const Route = createFileRoute("/_app/support")({
  head: () => ({
    meta: [
      { title: "Support Center — Cyberbacker" },
      { name: "description", content: "Open and track support tickets with the Cyberbacker team." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.tickets()),
  component: Support,
});

function Support() {
  const { data: tickets } = useSuspenseQuery(q.tickets());
  const mine = tickets.filter(
    (t) => t.requester.includes("Jordan") || t.requester.includes("BrightPath"),
  );

  const [selected, setSelected] = useState<Ticket | null>(mine[0] ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const select = (t: Ticket) => {
    setSelected(t);
    setMobileOpen(true);
  };

  const count = (s: Ticket["status"]) => mine.filter((t) => t.status === s).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Center"
        description="Get help and track your requests"
        actions={<CreateTicketModal />}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Open" value={String(count("open"))} icon={CircleDot} hint="awaiting reply" />
        <StatCard label="In Progress" value={String(count("in_progress"))} icon={Loader2} />
        <StatCard label="Pending Client" value={String(count("pending_client"))} icon={Clock} hint="needs your input" />
        <StatCard label="Resolved" value={String(count("resolved"))} icon={CheckCircle2} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="lg:border-r lg:border-border">
            <TicketList
              tickets={mine}
              selectedId={selected?.id}
              onSelect={select}
              className="h-[640px]"
            />
          </div>
          {/* Desktop detail */}
          <div className="hidden lg:block">
            {selected ? (
              <TicketDetailPanel ticket={selected} variant="client" className="h-[640px] p-5" />
            ) : (
              <EmptyDetail />
            )}
          </div>
        </div>
      </Card>

      {/* Mobile detail in a sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto p-5 sm:max-w-md lg:hidden">
          {selected && <TicketDetailPanel ticket={selected} variant="client" className="h-full" />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="flex h-[640px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
      <Inbox className="h-10 w-10" />
      <p className="text-sm">Select a ticket to view the conversation.</p>
    </div>
  );
}
