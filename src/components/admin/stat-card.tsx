import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "warn";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-graphite-faint">{label}</p>
        <Icon className={cn("h-4 w-4", tone === "warn" ? "text-rose" : "text-green")} />
      </div>
      <p className="mt-2 font-display text-2xl text-graphite">{value}</p>
    </Card>
  );
}
