import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCheck, CircleAlert, CircleCheck, Info, TicketCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { q } from "@/lib/data/queries";
import type { Notification } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const iconFor = {
  success: { Icon: CircleCheck, cls: "text-success" },
  warning: { Icon: CircleAlert, cls: "text-warning" },
  info: { Icon: Info, cls: "text-info" },
  ticket: { Icon: TicketCheck, cls: "text-primary" },
} as const;

export function NotificationCenter() {
  const { data } = useQuery(q.notifications());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const items: Notification[] = (data ?? []).map((n) => ({
    ...n,
    read: n.read || readIds.has(n.id),
  }));
  const unread = items.filter((n) => !n.read).length;

  const markAll = () => setReadIds(new Set(items.map((n) => n.id)));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative text-muted-foreground"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAll}
            className="h-7 gap-1 text-xs text-muted-foreground"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </Button>
        </div>
        <ScrollArea className="h-[340px]">
          <div className="divide-y divide-border">
            {items.map((n) => {
              const { Icon, cls } = iconFor[n.type];
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                    !n.read && "bg-primary/[0.04]",
                  )}
                >
                  <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", cls)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
