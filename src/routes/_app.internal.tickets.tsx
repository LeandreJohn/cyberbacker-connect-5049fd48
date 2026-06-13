import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlarmClock, CircleDot, Inbox, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusBadge, toneFor, prettify } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { q } from "@/lib/data/queries";

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
  const [filter, setFilter] = useState("all");

  const open = tickets.filter((t) => t.status === "open").length;
  const urgent = tickets.filter((t) => t.priority === "urgent").length;
  const breaching = tickets.filter((t) => t.slaHoursLeft > 0 && t.slaHoursLeft <= 4).length;

  const filtered = tickets.filter((t) => {
    if (filter === "all") return true;
    if (filter === "open") return ["open", "in_progress", "waiting"].includes(t.status);
    if (filter === "urgent") return t.priority === "urgent" || t.priority === "high";
    if (filter === "resolved") return ["resolved", "closed"].includes(t.status);
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Ticket Management"
        description="Triage, assign and resolve client tickets"
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Tickets" value={String(tickets.length)} icon={Inbox} />
        <StatCard label="Open" value={String(open)} icon={CircleDot} hint="awaiting action" />
        <StatCard label="Urgent" value={String(urgent)} icon={ShieldAlert} hint="high priority" />
        <StatCard label="SLA Breaching" value={String(breaching)} icon={AlarmClock} hint="< 4h left" />
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer">
                    <TableCell>
                      <p className="font-medium">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        #{t.id.toUpperCase()} · {t.category}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <InitialsAvatar
                          initials={t.requester.slice(0, 2).toUpperCase()}
                          size="sm"
                        />
                        <span className="text-sm">{t.requester}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.assignedTo}</TableCell>
                    <TableCell>
                      <StatusBadge label={t.priority} tone={toneFor(t.priority)} />
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          t.slaHoursLeft > 0 && t.slaHoursLeft <= 4
                            ? "text-sm font-medium text-destructive"
                            : "text-sm text-muted-foreground"
                        }
                      >
                        {t.slaHoursLeft > 0 ? `${t.slaHoursLeft}h left` : "Met"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge label={prettify(t.status)} tone={toneFor(t.status)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
