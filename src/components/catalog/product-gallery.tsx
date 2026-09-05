"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import type { ProductImageDTO } from "@/lib/types";

export function ProductGallery({ images, alt }: { images: ProductImageDTO[]; alt: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [{ id: "placeholder", url: "/images/placeholder.svg", alt, sortOrder: 0 }];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ivory-deep">
        <Image
          src={list[active]?.url}
          alt={list[active]?.alt || alt}
          fill
          priority
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-2.5">
          {list.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors focus-ring",
                active === i ? "border-green" : "border-transparent"
              )}
              aria-label={`${alt} ${i + 1}`}
            >
              <Image src={img.url} alt={img.alt || alt} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
