import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FileText, Download, PenLine } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
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

export const Route = createFileRoute("/_app/contracts")({
  head: () => ({
    meta: [
      { title: "Contracts — Cyberbacker" },
      { name: "description", content: "View and manage your service agreements and contracts." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.contracts()),
  component: Contracts,
});

function Contracts() {
  const { data: contracts } = useSuspenseQuery(q.contracts());
  const pending = contracts.filter((c) => c.status === "pending_signature");

  return (
    <div className="space-y-6">
      <PageHeader title="Contracts" description="Service agreements and signed documents" />

      {pending.length > 0 && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-warning/15 text-warning">
                <PenLine className="h-4.5 w-4.5" />
              </span>
              <p className="text-sm font-medium">
                {pending.length} contract awaiting your signature
              </p>
            </div>
            <Button size="sm">Review & sign</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" /> All contracts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Monthly value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-muted-foreground">{c.party}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.startDate} → {c.endDate}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {c.value ? `$${c.value.toLocaleString()}` : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge label={prettify(c.status)} tone={toneFor(c.status)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Download className="mr-1.5 h-4 w-4" /> PDF
                      </Button>
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
