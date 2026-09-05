"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, Skeleton, EmptyState } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryFormModal } from "@/components/admin/category-form-modal";
import type { CategoryDTO } from "@/lib/types";

export default function AdminCategoriesPage() {
  const { dict } = useI18n();
  const { show } = useToast();
  const [items, setItems] = useState<CategoryDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDTO | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((json) => setItems(json.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (category: CategoryDTO) => {
    if ((category.productCount ?? 0) > 0) {
      show(dict.admin.categories.cannotDelete, "error");
      return;
    }
    if (!window.confirm(`${dict.common.delete}: ${category.nameRu}?`)) return;
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      show(json.error ?? dict.toast.saveError, "error");
      return;
    }
    show(dict.toast.categoryDeleted, "success");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-graphite">{dict.admin.categories.title}</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {dict.admin.categories.add}
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !items || items.length === 0 ? (
          <div className="p-8">
            <EmptyState title={dict.admin.categories.title} />
          </div>
        ) : (
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-graphite-faint">
                <th className="px-5 py-3">{dict.admin.categories.name}</th>
                <th className="px-5 py-3">{dict.admin.categories.slug}</th>
                <th className="px-5 py-3">{dict.admin.categories.productsCount}</th>
                <th className="px-5 py-3">{dict.admin.categories.status}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((category) => (
                <tr key={category.id} className="hover:bg-black/[0.02]">
                  <td className="px-5 py-3 font-medium text-graphite">{category.nameRu}</td>
                  <td className="px-5 py-3 text-graphite-faint">{category.slug}</td>
                  <td className="px-5 py-3 text-graphite-soft">{category.productCount ?? 0}</td>
                  <td className="px-5 py-3">
                    <Badge tone={category.isActive ? "green" : "graphite"}>
                      {category.isActive ? dict.admin.products.published : dict.admin.products.hidden}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditing(category);
                          setModalOpen(true);
                        }}
                        className="focus-ring rounded p-1.5 text-graphite-faint hover:text-green"
                        aria-label={dict.common.edit}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(category)}
                        className="focus-ring rounded p-1.5 text-graphite-faint hover:text-rose"
                        aria-label={dict.common.delete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        category={editing}
      />
    </div>
  );
}
