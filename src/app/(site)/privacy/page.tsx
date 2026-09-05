import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.footer.privacy, alternates: { canonical: "/privacy" } };
}

export default async function PrivacyPage() {
  const { dict } = await getServerDictionary();
  const settings = await getStoreSettings();

  return (
    <div className="container-page max-w-2xl py-14 md:py-20">
      <h1 className="font-display text-3xl text-graphite">{dict.footer.privacy}</h1>
      <div className="prose-sm mt-6 space-y-4 text-sm leading-relaxed text-graphite-soft">
        <p>
          {settings.storeName} собирает только те данные, которые необходимы для оформления
          и выполнения вашего заказа: имя, номер телефона, адрес доставки и комментарий к заказу.
        </p>
        <p>
          Эти данные используются исключительно для связи с вами по поводу заказа, доставки
          и не передаются третьим лицам, за исключением случаев, необходимых для выполнения
          заказа (например, курьерской доставки).
        </p>
        <p>
          Вы можете в любой момент запросить удаление своих данных, обратившись по телефону{" "}
          {settings.phone}.
        </p>
        <p>
          Продолжая пользоваться сайтом и оформляя заказ, вы соглашаетесь с настоящей политикой
          обработки персональных данных.
        </p>
      </div>
    </div>
  );
}
