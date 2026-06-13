import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  Clock,
  LifeBuoy,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusBadge, toneFor, prettify } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendAreaChart, chartColors } from "@/components/charts/Charts";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Cyberbacker" },
      { name: "description", content: "Your Cyberbacker team overview, activity and performance." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(q.dashboardStats());
    context.queryClient.ensureQueryData(q.activityFeed());
    context.queryClient.ensureQueryData(q.cyberbackers());
    context.queryClient.ensureQueryData(q.performanceTrend());
  },
  component: Dashboard,
});

const statIcons = [Users, Clock, TrendingUp, LifeBuoy];

const quickActions = [
  { title: "Hire talent", desc: "Browse the marketplace", to: "/marketplace", icon: Store },
  { title: "View attendance", desc: "Today's time logs", to: "/attendance", icon: CalendarClock },
  { title: "Get support", desc: "Open a ticket", to: "/support", icon: LifeBuoy },
];

function Dashboard() {
  const { data: stats } = useSuspenseQuery(q.dashboardStats());
  const { data: activity } = useSuspenseQuery(q.activityFeed());
  const { data: team } = useSuspenseQuery(q.cyberbackers());
  const { data: trend } = useSuspenseQuery(q.performanceTrend());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Jordan"
        description="Here's what's happening with your Cyberbacker team today."
        actions={
          <Button asChild>
            <Link to="/marketplace">
              <Store className="mr-1.5 h-4 w-4" /> Hire a Cyberbacker
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.id} {...s} icon={statIcons[i]} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Team performance</CardTitle>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </CardHeader>
          <CardContent>
            <TrendAreaChart
              data={trend}
              xKey="label"
              series={[
                { key: "productivity", color: chartColors[1], label: "Productivity" },
                { key: "satisfaction", color: chartColors[2], label: "Satisfaction" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/60"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <a.icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Your Cyberbackers</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <Link to="/my-cyberbackers">
                View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {team.slice(0, 4).map((cb) => (
              <div key={cb.id} className="flex items-center gap-3">
                <InitialsAvatar initials={cb.initials} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{cb.name}</p>
                    <StatusBadge label={prettify(cb.status)} tone={toneFor(cb.status)} />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{cb.role}</p>
                </div>
                <div className="hidden w-32 sm:block">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Performance</span>
                    <span className="font-medium text-foreground">{cb.performance}%</span>
                  </div>
                  <Progress value={cb.performance} className="h-1.5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((a) => (
              <div key={a.id} className="flex gap-3">
                <InitialsAvatar initials={a.initials} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
