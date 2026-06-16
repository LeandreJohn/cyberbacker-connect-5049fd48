import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlarmClock, CircleDot, Inbox, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CreateTicketModal } from "@/components/support/CreateTicketModal";
import { TicketList } from "@/components/support/TicketList";
import { TicketDetailPanel } from "@/components/support/TicketDetailPanel";
import { q } from "@/lib/data/queries";
import type { Ticket } from "@/lib/data/types";

export const Route = createFileRoute("/_app/internal/tickets")({
  head: () => ({
    meta: [
      { title: "Support Ticket Management — Cyberbacker" },
      { name: "description", content: "Triage and resolve client support tickets with SLA tracking." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.tickets()),
  component: TicketManagement,
});

function TicketManagement() {
  const { data: tickets } = useSuspenseQuery(q.tickets());
  const [selected, setSelected] = useState<Ticket | null>(tickets[0] ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const open = tickets.filter((t) =>
    ["open", "in_progress", "pending_client"].includes(t.status),
  ).length;
  const urgent = tickets.filter((t) => t.priority === "urgent").length;
  const breaching = tickets.filter((t) => t.slaHoursLeft > 0 && t.slaHoursLeft <= 4).length;

  const select = (t: Ticket) => {
    setSelected(t);
    setMobileOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Ticket Management"
        description="Triage, assign and resolve client tickets"
        actions={<CreateTicketModal />}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Tickets" value={String(tickets.length)} icon={Inbox} />
        <StatCard label="Open" value={String(open)} icon={CircleDot} hint="awaiting action" />
        <StatCard label="Urgent" value={String(urgent)} icon={ShieldAlert} hint="high priority" />
        <StatCard label="SLA Breaching" value={String(breaching)} icon={AlarmClock} hint="< 4h left" />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid lg:grid-cols-[minmax(0,400px)_1fr]">
          <div className="lg:border-r lg:border-border">
            <TicketList
              tickets={tickets}
              selectedId={selected?.id}
              onSelect={select}
              showRequester
              className="h-[680px]"
            />
          </div>
          <div className="hidden lg:block">
            {selected ? (
              <TicketDetailPanel ticket={selected} variant="agent" className="h-[680px] p-5" />
            ) : (
              <div className="flex h-[680px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <Inbox className="h-10 w-10" />
                <p className="text-sm">Select a ticket from the queue.</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto p-5 sm:max-w-md lg:hidden">
          {selected && <TicketDetailPanel ticket={selected} variant="agent" className="h-full" />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
