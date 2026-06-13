import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus, UserCheck, UserCog, UserPlus } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusBadge, toneFor, prettify } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/internal/cyberbackers")({
  head: () => ({
    meta: [
      { title: "Cyberbacker Management — Cyberbacker" },
      { name: "description", content: "Manage the Cyberbacker workforce, status and assignments." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.cyberbackers()),
  component: CyberbackerManagement,
});

function CyberbackerManagement() {
  const { data: team } = useSuspenseQuery(q.cyberbackers());
  const active = team.filter((c) => c.status === "active").length;
  const onboarding = team.filter((c) => c.status === "onboarding").length;
  const avgPerf = Math.round(team.reduce((s, c) => s + c.performance, 0) / team.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cyberbacker Management"
        description="Workforce overview, status and client assignments"
        actions={
          <Button>
            <Plus className="mr-1.5 h-4 w-4" /> Onboard Cyberbacker
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Workforce" value={String(team.length)} icon={UserCog} />
        <StatCard label="Active" value={String(active)} icon={UserCheck} hint="deployed" />
        <StatCard label="Onboarding" value={String(onboarding)} icon={UserPlus} hint="in training" />
        <StatCard label="Avg Performance" value={`${avgPerf}%`} icon={UserCheck} change={1.8} trend="up" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workforce roster</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cyberbacker</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <InitialsAvatar initials={c.initials} size="sm" />
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.role}</TableCell>
                    <TableCell className="text-muted-foreground">{c.timezone}</TableCell>
                    <TableCell className="tabular-nums">
                      {c.hoursThisWeek}/{c.weeklyCapacity}h
                    </TableCell>
                    <TableCell className="tabular-nums font-medium">{c.performance}%</TableCell>
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
