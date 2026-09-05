import { cn } from "@/lib/cn";

type Tone = "green" | "rose" | "graphite" | "ivory";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-green text-ivory",
  rose: "bg-rose text-ivory",
  graphite: "bg-graphite text-ivory",
  ivory: "bg-ivory-deep text-graphite border border-border",
};

export function Badge({
  tone = "graphite",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
