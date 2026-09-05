"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import type { CategoryDTO } from "@/lib/types";

export function CategoryFormModal({
  open,
  onClose,
  onSaved,
  category,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  category?: CategoryDTO | null;
}) {
  const { dict } = useI18n();
  const { show } = useToast();
  const [nameRu, setNameRu] = useState("");
  const [nameKg, setNameKg] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionRu, setDescriptionRu] = useState("");
  const [descriptionKg, setDescriptionKg] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setNameRu(category?.nameRu ?? "");
      setNameKg(category?.nameKg ?? "");
      setSlug(category?.slug ?? "");
      setDescriptionRu(category?.descriptionRu ?? "");
      setDescriptionKg(category?.descriptionKg ?? "");
      setImage(category?.image ?? "");
      setIsActive(category?.isActive ?? true);
    }
  }, [open, category]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { nameRu, nameKg, slug, descriptionRu, descriptionKg, image: image || null, isActive };
      const res = await fetch(category ? `/api/admin/categories/${category.id}` : "/api/admin/categories", {
        method: category ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        show(json.error ?? dict.toast.saveError, "error");
        return;
      }
      show(dict.toast.categorySaved, "success");
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={category ? dict.common.edit : dict.admin.categories.add}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Название (RU)</Label>
            <Input value={nameRu} onChange={(e) => setNameRu(e.target.value)} required />
          </div>
          <div>
            <Label>Название (KG)</Label>
            <Input value={nameKg} onChange={(e) => setNameKg(e.target.value)} required />
          </div>
        </div>
        <div>
          <Label>{dict.admin.categories.slug}</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Описание (RU)</Label>
            <Textarea value={descriptionRu} onChange={(e) => setDescriptionRu(e.target.value)} />
          </div>
          <div>
            <Label>Описание (KG)</Label>
            <Textarea value={descriptionKg} onChange={(e) => setDescriptionKg(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Изображение (URL)</Label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/images/categories/..." />
        </div>
        <label className="flex items-center gap-2 text-sm text-graphite">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-green" />
          Активна
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {dict.common.cancel}
          </Button>
          <Button type="submit" disabled={saving}>
            {dict.common.save}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
