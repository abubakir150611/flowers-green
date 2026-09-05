"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

type ImageEntry = { url: string; alt: string };
type CharEntry = { key: string; value: string };

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryDTO[];
  product?: ProductDTO;
}) {
  const { dict } = useI18n();
  const { show } = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [nameRu, setNameRu] = useState(product?.nameRu ?? "");
  const [nameKg, setNameKg] = useState(product?.nameKg ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [oldPrice, setOldPrice] = useState(product?.oldPrice ? String(product.oldPrice) : "");
  const [stock, setStock] = useState(String(product?.stock ?? "0"));
  const [sku, setSku] = useState(product?.sku ?? "");
  const [descriptionRu, setDescriptionRu] = useState(product?.descriptionRu ?? "");
  const [descriptionKg, setDescriptionKg] = useState(product?.descriptionKg ?? "");
  const [compositionRu, setCompositionRu] = useState(product?.compositionRu ?? "");
  const [compositionKg, setCompositionKg] = useState(product?.compositionKg ?? "");
  const [careRu, setCareRu] = useState(product?.careRu ?? "");
  const [careKg, setCareKg] = useState(product?.careKg ?? "");
  const [images, setImages] = useState<ImageEntry[]>(
    product?.images.map((i) => ({ url: i.url, alt: i.alt })) ?? []
  );
  const [characteristics, setCharacteristics] = useState<CharEntry[]>(
    product?.characteristics ? Object.entries(product.characteristics).map(([key, value]) => ({ key, value })) : []
  );
  const [isPublished, setIsPublished] = useState(product?.isPublished ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);

  useEffect(() => {
    if (!product && nameRu && !slug) {
      setSlug(
        nameRu
          .toLowerCase()
          .replace(/[^a-zа-яё0-9\s-]/gi, "")
          .replace(/[а-яё]/g, (ch) => {
            const map: Record<string, string> = {
              а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
              и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
              с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
              ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
            };
            return map[ch] ?? ch;
          })
          .trim()
          .replace(/\s+/g, "-")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameRu]);

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        show(json.error ?? dict.toast.saveError, "error");
        return;
      }
      setImages((prev) => [...prev, { url: json.url, alt: nameRu }]);
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nameRu,
        nameKg,
        slug,
        brand: brand || null,
        categoryId,
        price: Number(price) || 0,
        oldPrice: oldPrice ? Number(oldPrice) : null,
        stock: Number(stock) || 0,
        sku,
        descriptionRu,
        descriptionKg,
        compositionRu,
        compositionKg,
        careRu,
        careKg,
        characteristics: characteristics.length
          ? Object.fromEntries(characteristics.filter((c) => c.key.trim()).map((c) => [c.key, c.value]))
          : null,
        images: images.map((img, i) => ({ ...img, sortOrder: i })),
        isPublished,
        featured,
        isNew,
      };

      const res = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        show(json.error ?? dict.toast.saveError, "error");
        return;
      }
      show(dict.toast.productSaved, "success");
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <Label>Название (RU)</Label>
          <Input value={nameRu} onChange={(e) => setNameRu(e.target.value)} required />
        </div>
        <div>
          <Label>Название (KG)</Label>
          <Input value={nameKg} onChange={(e) => setNameKg(e.target.value)} required />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div>
          <Label>SKU</Label>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} required />
        </div>
        <div>
          <Label>{dict.admin.products.category}</Label>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameRu}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Бренд</Label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
        <div>
          <Label>{dict.admin.products.price}</Label>
          <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label>Старая цена</Label>
          <Input type="number" min={0} value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} />
        </div>
        <div>
          <Label>{dict.admin.products.stock}</Label>
          <Input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>
      </Card>

      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <Label>Описание (RU)</Label>
          <Textarea value={descriptionRu} onChange={(e) => setDescriptionRu(e.target.value)} />
        </div>
        <div>
          <Label>Описание (KG)</Label>
          <Textarea value={descriptionKg} onChange={(e) => setDescriptionKg(e.target.value)} />
        </div>
        <div>
          <Label>Состав (RU)</Label>
          <Textarea value={compositionRu} onChange={(e) => setCompositionRu(e.target.value)} />
        </div>
        <div>
          <Label>Состав (KG)</Label>
          <Textarea value={compositionKg} onChange={(e) => setCompositionKg(e.target.value)} />
        </div>
        <div>
          <Label>Уход (RU)</Label>
          <Textarea value={careRu} onChange={(e) => setCareRu(e.target.value)} />
        </div>
        <div>
          <Label>Уход (KG)</Label>
          <Textarea value={careKg} onChange={(e) => setCareKg(e.target.value)} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <Label className="mb-0">Характеристики</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCharacteristics((prev) => [...prev, { key: "", value: "" }])}
          >
            <Plus className="h-3.5 w-3.5" /> {dict.common.add}
          </Button>
        </div>
        <div className="space-y-2">
          {characteristics.map((c, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Параметр"
                value={c.key}
                onChange={(e) =>
                  setCharacteristics((prev) => prev.map((p, idx) => (idx === i ? { ...p, key: e.target.value } : p)))
                }
              />
              <Input
                placeholder="Значение"
                value={c.value}
                onChange={(e) =>
                  setCharacteristics((prev) => prev.map((p, idx) => (idx === i ? { ...p, value: e.target.value } : p)))
                }
              />
              <button
                type="button"
                onClick={() => setCharacteristics((prev) => prev.filter((_, idx) => idx !== i))}
                className="focus-ring rounded p-2 text-graphite-faint hover:text-rose"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <Label className="mb-0">Изображения</Label>
          <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-graphite/15 px-3 py-2 text-sm font-medium text-graphite hover:border-green">
            <Upload className="h-4 w-4" />
            {uploading ? dict.common.loading : "Загрузить"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {images.map((img, i) => (
            <div key={img.url + i} className="relative">
              <div className="relative aspect-square overflow-hidden rounded-md bg-ivory-deep">
                <Image src={img.url} alt={img.alt} fill sizes="120px" className="object-cover" />
              </div>
              <div className="mt-1 flex justify-between">
                <button type="button" onClick={() => moveImage(i, -1)} className="text-graphite-faint hover:text-graphite">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => moveImage(i, 1)} className="text-graphite-faint hover:text-graphite">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-graphite-faint hover:text-rose"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-wrap gap-6 p-6">
        <label className="flex items-center gap-2 text-sm text-graphite">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 accent-green" />
          {dict.admin.products.published}
        </label>
        <label className="flex items-center gap-2 text-sm text-graphite">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-green" />
          {dict.product.popular}
        </label>
        <label className="flex items-center gap-2 text-sm text-graphite">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="h-4 w-4 accent-green" />
          {dict.product.new}
        </label>
      </Card>

      <Button type="submit" size="lg" disabled={saving}>
        {saving ? dict.common.loading : dict.common.save}
      </Button>
    </form>
  );
}
