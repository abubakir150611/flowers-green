import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-paper shadow-soft",
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-ivory-deep/40 px-6 py-16 text-center">
      {icon && <div className="text-graphite-faint">{icon}</div>}
      <h3 className="font-display text-xl text-graphite">{title}</h3>
      {description && <p className="max-w-sm text-sm text-graphite-soft">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
