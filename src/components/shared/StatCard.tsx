import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  trend,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: number;
  trend?: "up" | "down";
  hint?: string;
  icon?: LucideIcon;
}) {
  const positive = trend === "up";
  return (
    <Card className="shadow-card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {Icon && (
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" />
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
        {typeof change === "number" && (
          <span
            className={cn(
              "mb-1 inline-flex items-center gap-0.5 text-xs font-semibold",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </Card>
  );
}
