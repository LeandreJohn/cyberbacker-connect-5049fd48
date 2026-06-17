import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Building2,
  DollarSign,
  Heart,
  Repeat,
  Smile,
  TrendingDown,
  TrendingUp,
  UserSquare,
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GroupedBarChart,
  SimpleLineChart,
  TrendAreaChart,
  chartColors,
} from "@/components/charts/Charts";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/internal/executive")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — Cyberbacker" },
      { name: "description", content: "Company-wide KPIs and strategic performance at a glance." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(q.revenueTrend());
    context.queryClient.ensureQueryData(q.growthTrend());
    context.queryClient.ensureQueryData(q.ticketVolume());
    context.queryClient.ensureQueryData(q.retentionTrend());
  },
  component: Executive,
});

const objectives = [
  { label: "Q2 Revenue Target", value: "$247k / $260k", pct: 95 },
  { label: "Net Revenue Retention", value: "112%", pct: 100 },
  { label: "Workforce Utilization", value: "89%", pct: 89 },
  { label: "Client Satisfaction (CSAT)", value: "4.7 / 5", pct: 94 },
];

const insights = [
  {
    tone: "success" as const,
    title: "Retention at record high",
    body: "Logo retention reached 95.8% in June, up 2pts YoY — driven by proactive Client Success outreach to at-risk accounts.",
  },
  {
    tone: "success" as const,
    title: "Referral engine compounding",
    body: "Referral-sourced signups grew 24% QoQ and now account for 31% of new ARR at a lower CAC than paid channels.",
  },
  {
    tone: "warning" as const,
    title: "Support load trending up",
    body: "Ticket volume rose in May; resolution now outpaces intake, but staffing should scale with the growing Cyberbacker base.",
  },
];

function Executive() {
  const { data: revenue } = useSuspenseQuery(q.revenueTrend());
  const { data: growth } = useSuspenseQuery(q.growthTrend());
  const { data: ticketVolume } = useSuspenseQuery(q.ticketVolume());
  const { data: retention } = useSuspenseQuery(q.retentionTrend());

  const latest = growth[growth.length - 1];
  const latestRetention = retention[retention.length - 1];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="Company-wide performance and strategic KPIs"
        actions={<Badge className="bg-success/12 text-success hover:bg-success/12">On track</Badge>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Total Clients" value={String(latest.clients)} change={7.2} trend="up" icon={Building2} />
        <StatCard label="Total Cyberbackers" value={String(latest.cyberbackers)} change={4.6} trend="up" icon={UserSquare} />
        <StatCard label="Revenue (ARR)" value="$2.96M" change={18.4} trend="up" icon={DollarSign} />
        <StatCard label="Retention Rate" value={`${latestRetention.retention}%`} change={2.0} trend="up" icon={Repeat} />
        <StatCard label="Churn Rate" value={`${latestRetention.churn}%`} change={-1.8} trend="down" icon={TrendingDown} />
        <StatCard label="Satisfaction" value="4.7 / 5" change={2.1} trend="up" icon={Smile} hint="CSAT" />
        <StatCard label="Referral Growth" value="+24%" change={6.0} trend="up" icon={Heart} hint="QoQ" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendAreaChart
              data={revenue}
              xKey="month"
              series={[
                { key: "revenue", color: chartColors[1], label: "Revenue" },
                { key: "payouts", color: chartColors[3], label: "Payouts" },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Client growth</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart
              data={growth}
              xKey="month"
              series={[{ key: "clients", color: chartColors[2], label: "Clients" }]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cyberbacker growth</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedBarChart
              data={growth}
              xKey="month"
              series={[{ key: "cyberbackers", color: chartColors[4], label: "Cyberbackers" }]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ticket volume</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart
              data={ticketVolume}
              xKey="month"
              series={[
                { key: "opened", color: chartColors[1], label: "Opened" },
                { key: "resolved", color: chartColors[2], label: "Resolved" },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retention analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendAreaChart
            data={retention}
            xKey="month"
            height={300}
            series={[
              { key: "retention", color: chartColors[1], label: "Retention %" },
              { key: "churn", color: chartColors[5], label: "Churn %" },
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strategic objectives</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5">
            {objectives.map((o) => (
              <div key={o.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium">{o.label}</span>
                  <span className="text-sm text-muted-foreground">{o.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                    style={{ width: `${o.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategic insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((ins) => (
              <div key={ins.title} className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${
                      ins.tone === "success"
                        ? "bg-success/12 text-success"
                        : "bg-warning/15 text-warning"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold">{ins.title}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{ins.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
