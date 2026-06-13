import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Search, Star } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusBadge, toneFor } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/marketplace")({
  head: () => ({
    meta: [
      { title: "Hiring Marketplace — Cyberbacker" },
      { name: "description", content: "Browse and hire vetted Cyberbacker talent for your team." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.candidates()),
  component: Marketplace,
});

function Marketplace() {
  const { data: candidates } = useSuspenseQuery(q.candidates());
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = role === "all" || c.availability === role;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hiring Marketplace"
        description="Vetted, ready-to-start Cyberbacker talent matched to your needs"
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, or skill…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All availability</SelectItem>
              <SelectItem value="available">Available now</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Recently hired</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id} className="shadow-card">
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <InitialsAvatar initials={c.initials} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{c.name}</p>
                <p className="truncate text-sm text-muted-foreground">{c.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {c.location}
                </p>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                {c.matchScore}% match
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 fill-warning text-warning" /> {c.rating}
                </span>
                <span className="text-muted-foreground">{c.yearsExperience} yrs exp</span>
                <span className="font-semibold">${c.hourlyRate}/hr</span>
              </div>
              <StatusBadge label={c.availability} tone={toneFor(c.availability)} />
            </CardContent>
            <CardFooter className="gap-2">
              <Button className="flex-1" disabled={c.availability === "hired"}>
                {c.availability === "hired" ? "Hired" : "Request interview"}
              </Button>
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
