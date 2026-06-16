import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { StatusBadge, toneFor, prettify } from "@/components/shared/StatusBadge";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Ticket, TicketStatus } from "@/lib/data/types";

const statusTabs: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "pending_client", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function TicketList({
  tickets,
  selectedId,
  onSelect,
  showRequester = false,
  className,
}: {
  tickets: Ticket[];
  selectedId?: string;
  onSelect: (t: Ticket) => void;
  showRequester?: boolean;
  className?: string;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(tickets.map((t) => t.category))).sort(),
    [tickets],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (status !== "all" && t.status !== (status as TicketStatus)) return false;
      if (category !== "all" && t.category !== category) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (term) {
        const hay = `${t.subject} ${t.requester} ${t.id} ${t.category}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [tickets, search, status, category, priority]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="space-y-3 border-b border-border p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {["urgent", "high", "medium", "low"].map((p) => (
                <SelectItem key={p} value={p} className="capitalize">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
            {statusTabs.map((s) => (
              <TabsTrigger
                key={s.value}
                value={s.value}
                className="h-7 rounded-full border border-border px-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No tickets match your filters.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((t) => {
              const active = t.id === selectedId;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(t)}
                    className={cn(
                      "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
                      active && "bg-accent",
                    )}
                  >
                    {showRequester && (
                      <InitialsAvatar initials={t.requesterInitials} size="sm" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium">{t.subject}</p>
                        <StatusBadge
                          label={t.priority}
                          tone={toneFor(t.priority)}
                          dot={false}
                          className="shrink-0"
                        />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        #{t.id.toUpperCase()} · {showRequester ? `${t.requester} · ` : ""}
                        {t.category} · updated {t.updatedAt}
                      </p>
                      <div className="mt-1.5">
                        <StatusBadge label={prettify(t.status)} tone={toneFor(t.status)} />
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
