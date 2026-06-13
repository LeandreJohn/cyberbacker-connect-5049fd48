import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge, toneFor, prettify } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/support")({
  head: () => ({
    meta: [
      { title: "Support Center — Cyberbacker" },
      { name: "description", content: "Open and track support tickets with the Cyberbacker team." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.tickets()),
  component: Support,
});

function Support() {
  const { data: tickets } = useSuspenseQuery(q.tickets());
  const mine = tickets.filter((t) => t.requester.includes("Jordan") || t.requester.includes("BrightPath"));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Center"
        description="Get help and track your requests"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Your tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mine.map((t) => (
                    <TableRow key={t.id} className="cursor-pointer">
                      <TableCell>
                        <p className="font-medium">{t.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          #{t.id.toUpperCase()} · updated {t.updatedAt}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{t.category}</TableCell>
                      <TableCell>
                        <StatusBadge label={t.priority} tone={toneFor(t.priority)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge label={prettify(t.status)} tone={toneFor(t.status)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> New ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Briefly describe your issue" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select defaultValue="account">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={4} placeholder="Tell us what's happening…" />
            </div>
            <Button className="w-full">Submit ticket</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
