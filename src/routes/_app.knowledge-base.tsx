import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CreditCard,
  Eye,
  Rocket,
  Search,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/knowledge-base")({
  head: () => ({
    meta: [
      { title: "Knowledge Base — Cyberbacker" },
      { name: "description", content: "Guides, tutorials and best practices for working with Cyberbacker." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(q.kbCategories());
    context.queryClient.ensureQueryData(q.articles());
  },
  component: KnowledgeBase,
});

const icons: Record<string, LucideIcon> = { Rocket, Users, CreditCard, Zap };

function KnowledgeBase() {
  const { data: categories } = useSuspenseQuery(q.kbCategories());
  const { data: articles } = useSuspenseQuery(q.articles());

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-elegant">
        <CardContent className="space-y-4 p-8 text-center">
          <BookOpen className="mx-auto h-9 w-9" />
          <h1 className="text-2xl font-bold">How can we help?</h1>
          <p className="text-sm text-primary-foreground/80">
            Search our guides, tutorials and best practices
          </p>
          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles…"
              className="h-11 bg-background pl-9 text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Browse by category</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((c) => {
            const Icon = icons[c.icon] ?? BookOpen;
            return (
              <Card key={c.id} className="shadow-card cursor-pointer transition-colors hover:border-primary/40">
                <CardContent className="space-y-2 p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                  <p className="text-xs font-medium text-primary">{c.articleCount} articles</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular articles</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {articles.map((a) => (
            <div
              key={a.id}
              className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{a.title}</p>
                <p className="truncate text-sm text-muted-foreground">{a.excerpt}</p>
              </div>
              <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground sm:flex">
                <Badge variant="secondary" className="font-normal">
                  {a.category}
                </Badge>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {a.views.toLocaleString()}
                </span>
                <span>{a.readMinutes} min</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
