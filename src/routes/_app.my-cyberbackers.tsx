import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Clock, Mail, Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusBadge, toneFor, prettify } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/my-cyberbackers")({
  head: () => ({
    meta: [
      { title: "My Cyberbackers — Cyberbacker" },
      { name: "description", content: "Manage your dedicated Cyberbacker team members." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.cyberbackers()),
  component: MyCyberbackers,
});

function MyCyberbackers() {
  const { data: team } = useSuspenseQuery(q.cyberbackers());

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Cyberbackers"
        description={`${team.length} dedicated team members working with you`}
        actions={
          <Button>
            <Plus className="mr-1.5 h-4 w-4" /> Add Cyberbacker
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {team.map((cb) => (
          <Card key={cb.id} className="shadow-card">
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
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {cb.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Performance</span>
                  <span className="font-medium">{cb.performance}%</span>
                </div>
                <Progress value={cb.performance} className="h-1.5" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" /> This week
                </span>
                <span className="font-medium">
                  {cb.hoursThisWeek}/{cb.weeklyCapacity} hrs
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{cb.timezone}</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Mail className="mr-1.5 h-4 w-4" /> Message
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                View profile
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
