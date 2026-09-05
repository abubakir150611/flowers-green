import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  subtitle,
  href,
  hrefLabel,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl text-graphite sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-graphite-soft">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="focus-ring flex shrink-0 items-center gap-1.5 rounded text-sm font-medium text-green hover:text-green-deep"
        >
          {hrefLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
