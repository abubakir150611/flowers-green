"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { formatMoney } from "@/lib/format";

type NewOrderEvent = {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  createdAt: string;
};

type RealtimeContextValue = {
  newOrdersCount: number;
  clearNewOrders: () => void;
  soundEnabled: boolean;
};

const RealtimeContext = createContext<RealtimeContextValue>({
  newOrdersCount: 0,
  clearNewOrders: () => undefined,
  soundEnabled: false,
});

export function useAdminRealtime() {
  return useContext(RealtimeContext);
}

function playChime(ctx: AudioContext) {
  const now = ctx.currentTime;
  [880, 1175].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0, now + i * 0.14);
    gain.gain.linearRampToValueAtTime(0.18, now + i * 0.14 + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + i * 0.14 + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.14);
    osc.stop(now + i * 0.14 + 0.3);
  });
}

export function AdminRealtimeProvider({ children }: { children: React.ReactNode }) {
  const { show } = useToast();
  const router = useRouter();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const unlock = () => {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (Ctx) audioCtxRef.current = new Ctx();
      }
      audioCtxRef.current?.resume();
      setSoundEnabled(true);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const source = new EventSource("/api/admin/orders/stream");
    source.addEventListener("order:new", (event) => {
      const data = JSON.parse((event as MessageEvent).data) as NewOrderEvent;
      setNewOrdersCount((n) => n + 1);
      show(`🔔 Заказ ${data.orderNumber} · ${data.customerName} · ${formatMoney(data.totalAmount)}`, "info");
      if (audioCtxRef.current) playChime(audioCtxRef.current);
      router.refresh();
    });
    source.onerror = () => {
      // EventSource auto-reconnects; nothing to do here besides letting it retry.
    };
    return () => source.close();
  }, [show, router]);

  return (
    <RealtimeContext.Provider
      value={{ newOrdersCount, clearNewOrders: () => setNewOrdersCount(0), soundEnabled }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}
