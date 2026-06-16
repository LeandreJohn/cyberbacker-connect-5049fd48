import { useState } from "react";
import { Send, Paperclip, Lock } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentList } from "./AttachmentList";
import type { TicketMessage } from "@/lib/data/types";

export function ConversationThread({
  messages,
  allowInternalNote = false,
  className,
}: {
  messages: TicketMessage[];
  allowInternalNote?: boolean;
  className?: string;
}) {
  const [reply, setReply] = useState("");
  const [internal, setInternal] = useState(false);

  const send = () => {
    if (!reply.trim()) {
      toast.error("Write a message before sending.");
      return;
    }
    toast.success(internal ? "Internal note added" : "Reply sent");
    setReply("");
    setInternal(false);
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.map((m) => {
          const isAgent = m.role === "agent";
          return (
            <div
              key={m.id}
              className={cn("flex gap-3", isAgent ? "flex-row-reverse" : "flex-row")}
            >
              <InitialsAvatar
                initials={m.initials}
                size="sm"
                className={isAgent ? "bg-success/15 text-success" : undefined}
              />
              <div className={cn("max-w-[80%] space-y-1", isAgent && "items-end text-right")}>
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    isAgent ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <span className="font-semibold text-foreground">{m.author}</span>
                  <span className="text-muted-foreground">{m.time}</span>
                  {m.internal && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                      <Lock className="h-2.5 w-2.5" /> Internal
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.internal
                      ? "bg-warning/10 text-foreground"
                      : isAgent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                  )}
                >
                  {m.body}
                </div>
                {m.attachments && m.attachments.length > 0 && (
                  <AttachmentList
                    attachments={m.attachments}
                    className={isAgent ? "justify-end" : undefined}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-3">
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          placeholder={internal ? "Add an internal note (not visible to client)…" : "Write a reply…"}
          className={cn(internal && "border-warning/40 bg-warning/5")}
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast("Attachment picker is a demo in this preview")}
            >
              <Paperclip className="h-4 w-4" /> Attach
            </Button>
            {allowInternalNote && (
              <Button
                type="button"
                variant={internal ? "default" : "outline"}
                size="sm"
                onClick={() => setInternal((v) => !v)}
              >
                <Lock className="h-4 w-4" /> Internal note
              </Button>
            )}
          </div>
          <Button type="button" size="sm" onClick={send}>
            <Send className="h-4 w-4" /> {internal ? "Add note" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
