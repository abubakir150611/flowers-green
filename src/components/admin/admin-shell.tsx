"use client";

import { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminTopbar } from "./topbar";
import { AdminRealtimeProvider } from "./realtime-provider";

export function AdminShell({
  adminName,
  adminEmail,
  children,
}: {
  adminName: string;
  adminEmail: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminRealtimeProvider>
      <div className="flex min-h-screen">
        <AdminSidebar
          adminName={adminName}
          adminEmail={adminEmail}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </AdminRealtimeProvider>
  );
}
