"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { localizedField } from "@/lib/format";
import type { CategoryDTO } from "@/lib/types";

export function CategoryCard({ category }: { category: CategoryDTO }) {
  const { locale } = useI18n();
  const name = localizedField(locale, category.nameRu, category.nameKg);

  return (
    <Link
      href={`/catalog/${category.slug}`}
      className="group focus-ring block overflow-hidden rounded-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ivory-deep">
        {category.image && (
          <Image
            src={category.image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/55 via-transparent to-transparent" />
        <p className="absolute bottom-3 left-3.5 font-display text-lg text-ivory">{name}</p>
      </div>
    </Link>
  );
}
