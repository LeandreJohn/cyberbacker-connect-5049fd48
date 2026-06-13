import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Copy, Gift, Sparkles, Ticket } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge, toneFor } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards & Coupons — Cyberbacker" },
      { name: "description", content: "Redeem rewards, credits and coupons on your account." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.rewards()),
  component: Rewards,
});

const typeIcon = { coupon: Ticket, credit: Sparkles, perk: Gift };

function Rewards() {
  const { data: rewards } = useSuspenseQuery(q.rewards());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rewards & Coupons"
        description="Perks, credits and discounts available on your account"
      />

      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-elegant">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-sm text-primary-foreground/80">Available rewards balance</p>
            <p className="text-3xl font-bold">$250 + 2 bonus hours</p>
          </div>
          <Gift className="h-12 w-12 opacity-80" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rewards.map((r) => {
          const Icon = typeIcon[r.type];
          const expired = r.status === "expired";
          return (
            <Card key={r.id} className="shadow-card">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <StatusBadge label={r.status} tone={toneFor(r.status)} />
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle className="text-base">{r.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{r.description}</p>
                <p className="text-lg font-bold text-primary">{r.value}</p>
                {r.code && (
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2">
                    <code className="flex-1 text-sm font-semibold tracking-wider">{r.code}</code>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <Badge variant="secondary" className="font-normal">
                  Expires {r.expiresOn}
                </Badge>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={r.status !== "available"}>
                  {r.status === "available" ? "Redeem" : expired ? "Expired" : "Redeemed"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
