import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Award, Download, Gauge, Smile, Timer } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GroupedBarChart, TrendAreaChart, chartColors } from "@/components/charts/Charts";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/performance")({
  head: () => ({
    meta: [
      { title: "Performance Reports — Cyberbacker" },
      { name: "description", content: "Productivity, satisfaction and hours analytics for your team." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(q.performanceTrend());
    context.queryClient.ensureQueryData(q.cyberbackers());
  },
  component: Performance,
});

function Performance() {
  const { data: trend } = useSuspenseQuery(q.performanceTrend());
  const { data: team } = useSuspenseQuery(q.cyberbackers());
  const ranked = [...team].sort((a, b) => b.performance - a.performance);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Reports"
        description="Track productivity, satisfaction and output across your team"
        actions={
          <Button variant="outline">
            <Download className="mr-1.5 h-4 w-4" /> Download report
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Avg Productivity" value="94%" change={2.4} trend="up" icon={Gauge} />
        <StatCard label="Satisfaction" value="95%" change={2} trend="up" icon={Smile} />
        <StatCard label="Hours Logged" value="905" change={4} trend="up" icon={Timer} hint="this month" />
        <StatCard label="Top Performer" value="96%" icon={Award} hint="Maya Lin" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Productivity & satisfaction</CardTitle>
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
            <CardTitle>Hours logged per month</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedBarChart
              data={trend}
              xKey="label"
              series={[{ key: "hours", color: chartColors[1], label: "Hours" }]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ranked.map((cb, i) => (
            <div key={cb.id} className="flex items-center gap-3">
              <span className="w-5 text-sm font-semibold text-muted-foreground">{i + 1}</span>
              <InitialsAvatar initials={cb.initials} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{cb.name}</p>
                <p className="truncate text-xs text-muted-foreground">{cb.role}</p>
              </div>
              <div className="w-40 max-w-[40%]">
                <Progress value={cb.performance} className="h-2" />
              </div>
              <span className="w-10 text-right text-sm font-semibold">{cb.performance}%</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
