import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, Download } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusBadge, toneFor } from "@/components/shared/StatusBadge";
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
import { Clock, TimerOff, UserCheck, UserX } from "lucide-react";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — Cyberbacker" },
      { name: "description", content: "Track daily attendance and time logs for your team." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.attendance()),
  component: Attendance,
});

function Attendance() {
  const { data: rows } = useSuspenseQuery(q.attendance());
  const present = rows.filter((r) => r.status === "present").length;
  const late = rows.filter((r) => r.status === "late").length;
  const absent = rows.filter((r) => r.status === "absent").length;
  const totalHours = rows.reduce((sum, r) => sum + r.hours, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Daily attendance and time tracking — Friday, June 12, 2026"
        actions={
          <Button variant="outline">
            <Download className="mr-1.5 h-4 w-4" /> Export
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Present" value={String(present)} icon={UserCheck} hint="on time today" />
        <StatCard label="Late" value={String(late)} icon={Clock} hint="arrived late" />
        <StatCard label="Absent" value={String(absent)} icon={UserX} hint="no show / leave" />
        <StatCard label="Total Hours" value={String(totalHours)} icon={TimerOff} hint="logged today" />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" /> Today's time logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cyberbacker</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <InitialsAvatar initials={r.initials} size="sm" />
                        <span className="font-medium">{r.cyberbacker}</span>
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums">{r.clockIn}</TableCell>
                    <TableCell className="tabular-nums">{r.clockOut}</TableCell>
                    <TableCell className="tabular-nums">{r.hours}h</TableCell>
                    <TableCell className="text-right">
                      <StatusBadge label={r.status} tone={toneFor(r.status)} />
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
