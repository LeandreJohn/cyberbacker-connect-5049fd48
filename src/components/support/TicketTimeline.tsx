import {
  CircleDot,
  RefreshCw,
  UserPlus,
  Flag,
  MessageSquare,
  Paperclip,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { TicketEvent, TicketEventType } from "@/lib/data/types";

const iconFor: Record<TicketEventType, LucideIcon> = {
  created: CircleDot,
  status: RefreshCw,
  assignment: UserPlus,
  priority: Flag,
  comment: MessageSquare,
  attachment: Paperclip,
};

export function TicketTimeline({
  events,
  className,
}: {
  events: TicketEvent[];
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-5", className)}>
      {events.map((event, i) => {
        const Icon = iconFor[event.type];
        const isLast = i === events.length - 1;
        return (
          <li key={event.id} className="relative flex gap-3.5 pl-1">
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[15px] top-7 h-[calc(100%+4px)] w-px bg-border"
              />
            )}
            <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-medium text-foreground">{event.label}</p>
              <p className="text-xs text-muted-foreground">
                {event.actor} · {event.time}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
