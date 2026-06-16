import { FileText, FileImage, FileSpreadsheet, File as FileIcon, Download } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AttachmentType, TicketAttachment } from "@/lib/data/types";

const iconFor: Record<AttachmentType, typeof FileIcon> = {
  image: FileImage,
  pdf: FileText,
  doc: FileText,
  sheet: FileSpreadsheet,
  file: FileIcon,
};

function formatSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export function AttachmentChip({
  attachment,
  onClick,
}: {
  attachment: TicketAttachment;
  onClick?: () => void;
}) {
  const Icon = iconFor[attachment.type];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-left text-xs transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <span className="max-w-[160px] truncate font-medium">{attachment.name}</span>
      <span className="text-muted-foreground">{formatSize(attachment.sizeKb)}</span>
      <Download className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

export function AttachmentList({
  attachments,
  className,
  onSelect,
}: {
  attachments: TicketAttachment[];
  className?: string;
  onSelect?: (a: TicketAttachment) => void;
}) {
  if (!attachments.length) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>No attachments.</p>
    );
  }
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {attachments.map((a) => (
        <AttachmentChip key={a.id} attachment={a} onClick={() => onSelect?.(a)} />
      ))}
    </div>
  );
}
