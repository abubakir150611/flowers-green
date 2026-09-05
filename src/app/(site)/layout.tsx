import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getStoreSettings } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStoreSettings();

  return (
    <>
      <Header storeName={settings.storeName} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
