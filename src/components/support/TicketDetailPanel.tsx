import {
  Clock,
  Tag,
  User,
  Hash,
  CheckCircle2,
  RefreshCw,
  UserCog,
  Flag,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { StatusBadge, toneFor, prettify } from "@/components/shared/StatusBadge";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConversationThread } from "./ConversationThread";
import { TicketTimeline } from "./TicketTimeline";
import { AttachmentList } from "./AttachmentList";
import type { Ticket, TicketStatus } from "@/lib/data/types";

const statusOptions: TicketStatus[] = [
  "open",
  "in_progress",
  "pending_client",
  "resolved",
  "closed",
];

export function TicketDetailPanel({
  ticket,
  variant = "client",
  className,
}: {
  ticket: Ticket;
  variant?: "client" | "agent";
  className?: string;
}) {
  const isAgent = variant === "agent";

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-tight">{ticket.subject}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hash className="h-3.5 w-3.5" />
              {ticket.id.toUpperCase()} · opened {ticket.createdAt}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge label={prettify(ticket.status)} tone={toneFor(ticket.status)} />
            <StatusBadge label={ticket.priority} tone={toneFor(ticket.priority)} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" /> {ticket.category}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> {ticket.requester}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UserCog className="h-3.5 w-3.5" /> {ticket.assignedTo}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5",
              ticket.slaHoursLeft > 0 && ticket.slaHoursLeft <= 4 && "text-destructive",
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {ticket.slaHoursLeft > 0 ? `${ticket.slaHoursLeft}h SLA left` : "SLA met"}
          </span>
        </div>

        {/* Actions */}
        {isAgent ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Select
              defaultValue={ticket.status}
              onValueChange={(v) => toast.success(`Status changed to ${prettify(v)}`)}
            >
              <SelectTrigger className="h-8 w-[150px] text-xs">
                <RefreshCw className="h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {prettify(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              defaultValue={ticket.priority}
              onValueChange={(v) => toast.success(`Priority set to ${v}`)}
            >
              <SelectTrigger className="h-8 w-[130px] text-xs capitalize">
                <Flag className="h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["low", "medium", "high", "urgent"].map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Ticket reassigned")}
            >
              <UserCog className="h-4 w-4" /> Reassign
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {ticket.status !== "resolved" && ticket.status !== "closed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Marked as resolved")}
              >
                <CheckCircle2 className="h-4 w-4" /> Mark resolved
              </Button>
            )}
            {(ticket.status === "resolved" || ticket.status === "closed") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Ticket reopened")}
              >
                <RefreshCw className="h-4 w-4" /> Reopen ticket
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="conversation" className="flex min-h-0 flex-1 flex-col pt-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="conversation" className="mt-4 min-h-0 flex-1">
          <ConversationThread
            messages={ticket.messages}
            allowInternalNote={isAgent}
            className="h-full"
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-4 min-h-0 flex-1 overflow-y-auto">
          <TicketTimeline events={ticket.events} />
        </TabsContent>

        <TabsContent value="details" className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto">
          <div className="flex items-start gap-3">
            <InitialsAvatar initials={ticket.requesterInitials} size="sm" />
            <div>
              <p className="text-sm font-medium">{ticket.requester}</p>
              <p className="text-xs text-muted-foreground">Requester</p>
            </div>
          </div>
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </h3>
            <p className="text-sm leading-relaxed text-foreground">{ticket.description}</p>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Attachments
            </h3>
            <AttachmentList attachments={ticket.attachments} />
          </div>
          {ticket.tags && ticket.tags.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {ticket.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    <Tag className="h-3 w-3" /> {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
