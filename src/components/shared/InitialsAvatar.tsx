import { cn } from "@/lib/utils";

export function InitialsAvatar({
  initials,
  className,
  size = "md",
}: {
  initials: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary",
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
