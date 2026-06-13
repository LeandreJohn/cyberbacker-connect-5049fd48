import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2, HeartPulse, Plus, TrendingUp, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusBadge, toneFor, prettify } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/internal/clients")({
  head: () => ({
    meta: [
      { title: "Client Management — Cyberbacker" },
      { name: "description", content: "Manage client accounts, health and revenue." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.clientAccounts()),
  component: ClientManagement,
});

function ClientManagement() {
  const { data: clients } = useSuspenseQuery(q.clientAccounts());
  const active = clients.filter((c) => c.status === "active").length;
  const mrr = clients.reduce((s, c) => s + (c.status === "churned" ? 0 : c.mrr), 0);
  const atRisk = clients.filter((c) => c.status === "at_risk").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Management"
        description="Accounts, health scores and revenue across all clients"
        actions={
          <Button>
            <Plus className="mr-1.5 h-4 w-4" /> Add client
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Clients" value={String(clients.length)} icon={Building2} />
        <StatCard label="Active" value={String(active)} icon={Users} hint="paying accounts" />
        <StatCard label="Total MRR" value={`$${(mrr / 1000).toFixed(1)}k`} icon={TrendingUp} change={6.2} trend="up" />
        <StatCard label="At Risk" value={String(atRisk)} icon={HeartPulse} hint="needs attention" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All clients</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Cyberbackers</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <InitialsAvatar initials={c.initials} size="sm" />
                        <div>
                          <p className="font-medium">{c.company}</p>
                          <p className="text-xs text-muted-foreground">{c.contact}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.plan}</TableCell>
                    <TableCell className="tabular-nums">{c.cyberbackers}</TableCell>
                    <TableCell className="tabular-nums">${c.mrr.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex w-28 items-center gap-2">
                        <Progress value={c.health} className="h-1.5" />
                        <span className="text-xs font-medium">{c.health}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge label={prettify(c.status)} tone={toneFor(c.status)} />
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
