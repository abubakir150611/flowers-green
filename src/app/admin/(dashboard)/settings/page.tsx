"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Upload, BellRing, BellOff } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, Skeleton } from "@/components/ui/card";
import { useAdminPush } from "@/lib/push/use-admin-push";
import type { StoreSettings } from "@prisma/client";

export default function AdminSettingsPage() {
  const { dict } = useI18n();
  const { show } = useToast();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const push = useAdminPush();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((json) => setSettings(json.item))
      .catch(() => setSettings(null));
  }, []);

  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const onUploadHero = async (file: File) => {
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
      update("heroImage", json.url);
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok) {
        show(json.error ?? dict.toast.saveError, "error");
        return;
      }
      setSettings(json.item);
      show(dict.toast.saved, "success");
    } finally {
      setSaving(false);
    }
  };

  const sendTestPush = async () => {
    const res = await fetch("/api/admin/push/send-test", { method: "POST" });
    const json = await res.json();
    if (!json.configured) {
      show("VAPID-ключи не настроены на сервере", "error");
      return;
    }
    show(`Отправлено: ${json.sent}, ошибок: ${json.failed}`, json.sent > 0 ? "success" : "info");
  };

  if (!settings) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-graphite">{dict.admin.settings.title}</h1>

      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="col-span-full font-display text-lg text-graphite">{dict.admin.settings.general}</h2>
        <div>
          <Label>{dict.admin.settings.storeName}</Label>
          <Input value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} />
        </div>
        <div>
          <Label>{dict.admin.settings.phone}</Label>
          <Input value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div>
          <Label>{dict.admin.settings.whatsapp}</Label>
          <Input value={settings.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
        </div>
        <div>
          <Label>{dict.admin.settings.workingHours}</Label>
          <Input value={settings.workingHours} onChange={(e) => update("workingHours", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>{dict.admin.settings.address}</Label>
          <Input value={settings.address} onChange={(e) => update("address", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Ссылка на карту (Google Maps)</Label>
          <Input value={settings.mapUrl ?? ""} onChange={(e) => update("mapUrl", e.target.value)} placeholder="https://maps.google.com/..." />
        </div>
      </Card>

      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="col-span-full font-display text-lg text-graphite">{dict.admin.settings.delivery}</h2>
        <div>
          <Label>{dict.admin.settings.deliveryPrice}</Label>
          <Input type="number" min={0} value={settings.deliveryPrice} onChange={(e) => update("deliveryPrice", Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label>{dict.admin.settings.minimumOrder}</Label>
          <Input type="number" min={0} value={settings.minimumOrder} onChange={(e) => update("minimumOrder", Number(e.target.value) || 0)} />
        </div>
        <div className="sm:col-span-2">
          <Label>{dict.admin.settings.deliveryTexts} (RU)</Label>
          <Textarea value={settings.deliveryTextRu} onChange={(e) => update("deliveryTextRu", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>{dict.admin.settings.deliveryTexts} (KG)</Label>
          <Textarea value={settings.deliveryTextKg} onChange={(e) => update("deliveryTextKg", e.target.value)} />
        </div>
      </Card>

      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="col-span-full font-display text-lg text-graphite">{dict.admin.settings.social}</h2>
        <div>
          <Label>{dict.admin.settings.instagram}</Label>
          <Input value={settings.instagram ?? ""} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/..." />
        </div>
        <div className="sm:col-span-2">
          <Label>Текст WhatsApp (RU)</Label>
          <Input value={settings.whatsappMessageRu} onChange={(e) => update("whatsappMessageRu", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Текст WhatsApp (KG)</Label>
          <Input value={settings.whatsappMessageKg} onChange={(e) => update("whatsappMessageKg", e.target.value)} />
        </div>
      </Card>

      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="col-span-full font-display text-lg text-graphite">{dict.admin.settings.hero}</h2>
        <div>
          <Label>{dict.admin.settings.heroTitleRu}</Label>
          <Input value={settings.heroTitleRu} onChange={(e) => update("heroTitleRu", e.target.value)} />
        </div>
        <div>
          <Label>{dict.admin.settings.heroTitleKg}</Label>
          <Input value={settings.heroTitleKg} onChange={(e) => update("heroTitleKg", e.target.value)} />
        </div>
        <div>
          <Label>{dict.admin.settings.heroSubtitleRu}</Label>
          <Textarea value={settings.heroSubtitleRu} onChange={(e) => update("heroSubtitleRu", e.target.value)} />
        </div>
        <div>
          <Label>{dict.admin.settings.heroSubtitleKg}</Label>
          <Textarea value={settings.heroSubtitleKg} onChange={(e) => update("heroSubtitleKg", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>{dict.admin.settings.heroImage}</Label>
          <div className="flex items-center gap-4">
            {settings.heroImage && (
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-ivory-deep">
                <Image src={settings.heroImage} alt="" fill sizes="96px" className="object-cover" />
              </div>
            )}
            <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-graphite/15 px-3 py-2 text-sm font-medium text-graphite hover:border-green">
              <Upload className="h-4 w-4" />
              {uploading ? dict.common.loading : "Загрузить"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadHero(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg text-graphite">{dict.admin.settings.notifications}</h2>
        <p className="mt-2 text-sm text-graphite-soft">
          {push.state === "subscribed" ? dict.admin.settings.pushEnabled : dict.admin.settings.pushDisabled}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {push.state === "subscribed" ? (
            <Button type="button" variant="outline" onClick={push.unsubscribe} disabled={push.loading}>
              <BellOff className="h-4 w-4" />
              Отключить
            </Button>
          ) : (
            <Button type="button" onClick={push.subscribe} disabled={push.loading || push.state === "unsupported"}>
              <BellRing className="h-4 w-4" />
              {dict.admin.settings.enablePush}
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={sendTestPush}>
            Отправить тестовое уведомление
          </Button>
        </div>
        {push.state === "unsupported" && (
          <p className="mt-2 text-xs text-graphite-faint">Браузер не поддерживает push-уведомления.</p>
        )}
        {push.state === "denied" && (
          <p className="mt-2 text-xs text-rose">Уведомления заблокированы в настройках браузера.</p>
        )}
      </Card>

      <Button size="lg" onClick={onSave} disabled={saving}>
        {saving ? dict.common.loading : dict.common.save}
      </Button>
    </div>
  );
}
