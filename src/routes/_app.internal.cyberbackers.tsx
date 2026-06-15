import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Activity,
  Award,
  CalendarClock,
  ClipboardCheck,
  GraduationCap,
  MessageSquarePlus,
  Plus,
  Repeat,
  Sparkles,
  Star,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusBadge, toneFor, prettify } from "@/components/shared/StatusBadge";
import { TrendAreaChart, DonutChart, chartColors } from "@/components/charts/Charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { q } from "@/lib/data/queries";
import type { Cyberbacker } from "@/lib/data/types";

export const Route = createFileRoute("/_app/internal/cyberbackers")({
  head: () => ({
    meta: [
      { title: "Cyberbacker Management — Cyberbacker" },
      {
        name: "description",
        content:
          "Manage the Cyberbacker workforce: attendance, productivity, performance, certifications and training.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(q.cyberbackers());
    context.queryClient.ensureQueryData(q.performanceTrend());
  },
  component: CyberbackerManagement,
});

const avg = (nums: number[]) =>
  nums.length ? Math.round(nums.reduce((s, n) => s + n, 0) / nums.length) : 0;

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

function CyberbackerManagement() {
  const { data: team } = useSuspenseQuery(q.cyberbackers());
  const [selected, setSelected] = useState<Cyberbacker | null>(null);

  const active = team.filter((c) => c.status === "active").length;
  const avgAttendance = avg(team.map((c) => c.attendanceRate ?? 0));
  const avgProductivity = avg(team.map((c) => c.productivity ?? 0));
  const avgPerf = avg(team.map((c) => c.performance));

  const trendData = useSuspenseQuery(q.performanceTrend()).data;

  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    team.forEach((c) => (counts[c.status] = (counts[c.status] ?? 0) + 1));
    const palette: Record<string, string> = {
      active: chartColors[1],
      onboarding: chartColors[2],
      paused: chartColors[4],
      offboarded: chartColors[5],
    };
    return Object.entries(counts).map(([name, value]) => ({
      name: prettify(name),
      value,
      color: palette[name] ?? chartColors[3],
    }));
  }, [team]);

  const fireAction = (label: string, cb: Cyberbacker) =>
    toast.success(`${label} requested`, {
      description: `${label} for ${cb.name} has been submitted to the success team.`,
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cyberbacker Management"
        description="Workforce overview, attendance, productivity and performance"
        actions={
          <Button>
            <Plus className="mr-1.5 h-4 w-4" /> Onboard Cyberbacker
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Active Cyberbackers" value={String(active)} icon={UserCheck} hint={`${team.length} total workforce`} />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} icon={CalendarClock} change={1.6} trend="up" />
        <StatCard label="Avg Productivity" value={`${avgProductivity}%`} icon={Activity} change={2.3} trend="up" />
        <StatCard label="Avg Performance" value={`${avgPerf}%`} icon={UserCog} change={1.8} trend="up" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Productivity & satisfaction</CardTitle>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </CardHeader>
          <CardContent>
            <TrendAreaChart
              data={trendData}
              xKey="label"
              height={260}
              series={[
                { key: "productivity", color: chartColors[1], label: "Productivity" },
                { key: "satisfaction", color: chartColors[2], label: "Satisfaction" },
              ]}
            />
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Workforce status</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={statusDistribution} height={200} />
            <div className="mt-4 space-y-2">
              {statusDistribution.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-medium tabular-nums">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5 text-primary" /> Active roster
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {team.map((cb) => (
            <Card
              key={cb.id}
              className="shadow-card flex cursor-pointer flex-col transition-shadow hover:shadow-md"
              onClick={() => setSelected(cb)}
            >
              <CardHeader className="flex-row items-start gap-3 space-y-0">
                <InitialsAvatar initials={cb.initials} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{cb.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{cb.role}</p>
                  <div className="mt-1.5">
                    <StatusBadge label={prettify(cb.status)} tone={toneFor(cb.status)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {cb.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto space-y-2.5">
                  <MiniBar label="Performance" value={cb.performance} />
                  <MiniBar label="Attendance" value={cb.attendanceRate ?? 0} />
                  <MiniBar label="Productivity" value={cb.productivity ?? 0} />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(cb);
                  }}
                >
                  View profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CyberbackerSheet
        cb={selected}
        onClose={() => setSelected(null)}
        onAction={fireAction}
      />
    </div>
  );
}

function CyberbackerSheet({
  cb,
  onClose,
  onAction,
}: {
  cb: Cyberbacker | null;
  onClose: () => void;
  onAction: (label: string, cb: Cyberbacker) => void;
}) {
  return (
    <Sheet open={!!cb} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        {cb && (
          <>
            <SheetHeader className="space-y-0 border-b p-6 text-left">
              <div className="flex items-start gap-4">
                <InitialsAvatar initials={cb.initials} size="lg" className="h-14 w-14 text-lg" />
                <div className="min-w-0 flex-1">
                  <SheetTitle className="truncate text-xl">{cb.name}</SheetTitle>
                  <SheetDescription className="truncate">{cb.role}</SheetDescription>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge label={prettify(cb.status)} tone={toneFor(cb.status)} />
                    <span className="text-xs text-muted-foreground">{cb.timezone}</span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <Tabs defaultValue="overview" className="w-full">
                <div className="sticky top-0 z-10 bg-background px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="certs">Certs</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="training">Training</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-5 p-6">
                  <div className="grid grid-cols-3 gap-3">
                    <Stat label="Performance" value={`${cb.performance}%`} />
                    <Stat label="Attendance" value={`${cb.attendanceRate ?? 0}%`} />
                    <Stat label="Productivity" value={`${cb.productivity ?? 0}%`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <InfoRow label="Email" value={cb.email} />
                    <InfoRow label="Started" value={cb.startedOn} />
                    <InfoRow label="Hours / week" value={`${cb.hoursThisWeek} / ${cb.weeklyCapacity}`} />
                    <InfoRow label="Tasks completed" value={String(cb.tasksCompleted ?? 0)} />
                  </div>
                  <div>
                    <SectionLabel icon={Sparkles}>Skills</SectionLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {cb.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="font-normal">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <SectionLabel icon={CalendarClock}>Weekly schedule</SectionLabel>
                    <div className="overflow-hidden rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Start</TableHead>
                            <TableHead>End</TableHead>
                            <TableHead className="text-right">Hours</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(cb.schedule ?? []).map((d) => (
                            <TableRow key={d.day}>
                              <TableCell className="font-medium">{d.day}</TableCell>
                              <TableCell className="text-muted-foreground">{d.start}</TableCell>
                              <TableCell className="text-muted-foreground">{d.end}</TableCell>
                              <TableCell className="text-right tabular-nums">{d.hours}h</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="certs" className="space-y-3 p-6">
                  <SectionLabel icon={Award}>Certifications</SectionLabel>
                  {(cb.certifications ?? []).map((c) => (
                    <div key={c.name} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.issuer}</p>
                        </div>
                        {c.expiresOn ? (
                          <StatusBadge label={`Expires ${c.expiresOn}`} tone="info" dot={false} />
                        ) : (
                          <StatusBadge label="No expiry" tone="neutral" dot={false} />
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Issued {c.issuedOn}</p>
                    </div>
                  ))}
                  {!cb.certifications?.length && (
                    <p className="text-sm text-muted-foreground">No certifications on record.</p>
                  )}
                </TabsContent>

                <TabsContent value="attendance" className="space-y-3 p-6">
                  <SectionLabel icon={CalendarClock}>Attendance history</SectionLabel>
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Hours</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(cb.attendanceHistory ?? []).map((d) => (
                          <TableRow key={d.date}>
                            <TableCell className="font-medium">{d.date}</TableCell>
                            <TableCell>
                              <StatusBadge label={prettify(d.status)} tone={toneFor(d.status)} />
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{d.hours}h</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-3 p-6">
                  <SectionLabel icon={Star}>Performance reviews</SectionLabel>
                  {(cb.reviews ?? []).map((r) => (
                    <div key={r.period} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{r.period}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          <Star className="h-3.5 w-3.5 fill-current" /> {r.score}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">Reviewed by {r.reviewer}</p>
                      <Separator className="my-2.5" />
                      <p className="text-sm text-muted-foreground">{r.summary}</p>
                    </div>
                  ))}
                  {!cb.reviews?.length && (
                    <p className="text-sm text-muted-foreground">No reviews yet.</p>
                  )}
                </TabsContent>

                <TabsContent value="training" className="space-y-3 p-6">
                  <SectionLabel icon={GraduationCap}>Training records</SectionLabel>
                  {(cb.trainings ?? []).map((t) => (
                    <div key={t.title} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium">{t.title}</p>
                        <StatusBadge label={prettify(t.status)} tone={toneFor(t.status)} dot={false} />
                      </div>
                      <div className="mt-2.5">
                        <Progress value={t.progress} className="h-1.5" />
                        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                          <span>{t.progress}% complete</span>
                          {t.completedOn && <span>Completed {t.completedOn}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!cb.trainings?.length && (
                    <p className="text-sm text-muted-foreground">No training records.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <SheetFooter className="grid grid-cols-2 gap-2 border-t p-4 sm:grid-cols-2 sm:space-x-0">
              <Button variant="outline" onClick={() => onAction("Coaching", cb)}>
                <GraduationCap className="mr-1.5 h-4 w-4" /> Request Coaching
              </Button>
              <Button variant="outline" onClick={() => onAction("Feedback", cb)}>
                <MessageSquarePlus className="mr-1.5 h-4 w-4" /> Submit Feedback
              </Button>
              <Button variant="outline" onClick={() => onAction("Replacement", cb)}>
                <Repeat className="mr-1.5 h-4 w-4" /> Request Replacement
              </Button>
              <Button onClick={() => onAction("Review", cb)}>
                <ClipboardCheck className="mr-1.5 h-4 w-4" /> Schedule Review
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <p className="text-lg font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate font-medium">{value}</p>
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <p className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold">
      <Icon className="h-4 w-4 text-primary" /> {children}
    </p>
  );
}
