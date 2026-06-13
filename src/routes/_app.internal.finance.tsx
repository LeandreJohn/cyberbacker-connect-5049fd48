import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Banknote, Download, Receipt, TrendingUp, Wallet } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
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
import { GroupedBarChart, chartColors } from "@/components/charts/Charts";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/internal/finance")({
  head: () => ({
    meta: [
      { title: "Finance Dashboard — Cyberbacker" },
      { name: "description", content: "Revenue, payouts, receivables and invoice tracking." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(q.revenueTrend());
    context.queryClient.ensureQueryData(q.invoices());
  },
  component: Finance,
});

function Finance() {
  const { data: revenue } = useSuspenseQuery(q.revenueTrend());
  const { data: invoices } = useSuspenseQuery(q.invoices());
  const outstanding = invoices
    .filter((i) => i.status === "due" || i.status === "overdue")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance Dashboard"
        description="Revenue, payouts and receivables overview"
        actions={
          <Button variant="outline">
            <Download className="mr-1.5 h-4 w-4" /> Export
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="MRR" value="$247k" change={6.9} trend="up" icon={TrendingUp} />
        <StatCard label="Payouts" value="$121k" change={4.3} trend="up" icon={Banknote} hint="this month" />
        <StatCard label="Gross Margin" value="51%" change={1.2} trend="up" icon={Wallet} />
        <StatCard
          label="Outstanding AR"
          value={`$${(outstanding / 1000).toFixed(1)}k`}
          icon={Receipt}
          hint="due + overdue"
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Revenue vs payouts</CardTitle>
          <span className="text-xs text-muted-foreground">Last 6 months</span>
        </CardHeader>
        <CardContent>
          <GroupedBarChart
            data={revenue}
            xKey="month"
            height={320}
            series={[
              { key: "revenue", color: chartColors[1], label: "Revenue" },
              { key: "payouts", color: chartColors[2], label: "Payouts" },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.number}</TableCell>
                    <TableCell className="text-muted-foreground">{i.period}</TableCell>
                    <TableCell className="text-muted-foreground">{i.issuedOn}</TableCell>
                    <TableCell className="text-muted-foreground">{i.dueOn}</TableCell>
                    <TableCell className="tabular-nums">${i.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <StatusBadge label={prettify(i.status)} tone={toneFor(i.status)} />
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
