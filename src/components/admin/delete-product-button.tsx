"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function DeleteProductButton({ productId }: { productId: string }) {
  const { dict } = useI18n();
  const { show } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        show(json.error ?? dict.toast.saveError, "error");
        return;
      }
      show(dict.toast.productDeleted, "success");
      router.push("/admin/products");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button type="button" variant="danger" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="h-3.5 w-3.5" />
        {dict.common.delete}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={dict.common.confirm}>
        <p className="text-sm text-graphite-soft">
          {dict.common.delete}? {dict.admin.products.title.toLowerCase()}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            {dict.common.cancel}
          </Button>
          <Button type="button" variant="danger" onClick={onDelete} disabled={deleting}>
            {dict.common.delete}
          </Button>
        </div>
      </Modal>
    </>
  );
}
