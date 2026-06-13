import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Activity, MousePointerClick, Target, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DonutChart,
  SimpleLineChart,
  TrendAreaChart,
  chartColors,
} from "@/components/charts/Charts";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/internal/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics Dashboard — Cyberbacker" },
      { name: "description", content: "Acquisition funnel, engagement and platform analytics." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(q.acquisitionFunnel());
    context.queryClient.ensureQueryData(q.revenueTrend());
    context.queryClient.ensureQueryData(q.performanceTrend());
  },
  component: Analytics,
});

const planMix = [
  { name: "Scale", value: 42, color: "var(--color-chart-1)" },
  { name: "Growth", value: 33, color: "var(--color-chart-2)" },
  { name: "Starter", value: 25, color: "var(--color-chart-3)" },
];

function Analytics() {
  const { data: funnel } = useSuspenseQuery(q.acquisitionFunnel());
  const { data: revenue } = useSuspenseQuery(q.revenueTrend());
  const { data: perf } = useSuspenseQuery(q.performanceTrend());
  const maxFunnel = funnel[0]?.value ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Acquisition, engagement and growth metrics"
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Monthly Visitors" value="24.8k" change={11.2} trend="up" icon={Users} />
        <StatCard label="Conversion Rate" value="1.26%" change={0.3} trend="up" icon={Target} />
        <StatCard label="Avg Session" value="6m 42s" change={4.1} trend="up" icon={Activity} />
        <StatCard label="CTR" value="3.8%" change={-0.4} trend="down" icon={MousePointerClick} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Acquisition funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {funnel.map((step, i) => (
              <div key={step.step}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{step.step}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {step.value.toLocaleString()}
                  </span>
                </div>
                <div className="h-7 overflow-hidden rounded-md bg-muted">
                  <div
                    className="flex h-full items-center rounded-md bg-primary/85 px-2 text-xs font-medium text-primary-foreground transition-all"
                    style={{
                      width: `${Math.max((step.value / maxFunnel) * 100, 6)}%`,
                      opacity: 1 - i * 0.12,
                    }}
                  >
                    {Math.round((step.value / maxFunnel) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={planMix} height={220} />
            <div className="mt-4 space-y-2">
              {planMix.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                    {p.name}
                  </span>
                  <span className="font-medium">{p.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue growth</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendAreaChart
              data={revenue}
              xKey="month"
              series={[{ key: "revenue", color: chartColors[1], label: "Revenue" }]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engagement trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart
              data={perf}
              xKey="label"
              series={[
                { key: "productivity", color: chartColors[1], label: "Productivity" },
                { key: "satisfaction", color: chartColors[4], label: "Satisfaction" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
