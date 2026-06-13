import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2, DollarSign, Smile, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendAreaChart, GroupedBarChart, chartColors } from "@/components/charts/Charts";
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
    context.queryClient.ensureQueryData(q.performanceTrend());
  },
  component: Executive,
});

const objectives = [
  { label: "Q2 Revenue Target", value: "$247k / $260k", pct: 95 },
  { label: "Net Revenue Retention", value: "112%", pct: 100 },
  { label: "Workforce Utilization", value: "89%", pct: 89 },
  { label: "Client Satisfaction (CSAT)", value: "4.7 / 5", pct: 94 },
];

function Executive() {
  const { data: revenue } = useSuspenseQuery(q.revenueTrend());
  const { data: perf } = useSuspenseQuery(q.performanceTrend());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="Company-wide performance and strategic KPIs"
        actions={<Badge className="bg-success/12 text-success hover:bg-success/12">On track</Badge>}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="ARR" value="$2.96M" change={18.4} trend="up" icon={DollarSign} />
        <StatCard label="Active Clients" value="312" change={7.2} trend="up" icon={Building2} />
        <StatCard label="Growth Rate" value="18%" change={2.1} trend="up" icon={TrendingUp} hint="YoY" />
        <StatCard label="NPS" value="68" change={5} trend="up" icon={Smile} hint="industry-leading" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue trajectory</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendAreaChart
              data={revenue}
              xKey="month"
              height={300}
              series={[
                { key: "revenue", color: chartColors[1], label: "Revenue" },
                { key: "payouts", color: chartColors[3], label: "Payouts" },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workforce output</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedBarChart
              data={perf}
              xKey="label"
              height={300}
              series={[{ key: "hours", color: chartColors[2], label: "Hours" }]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Strategic objectives</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
    </div>
  );
}
