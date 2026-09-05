import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.footer.terms, alternates: { canonical: "/terms" } };
}

export default async function TermsPage() {
  const { dict } = await getServerDictionary();
  const settings = await getStoreSettings();

  return (
    <div className="container-page max-w-2xl py-14 md:py-20">
      <h1 className="font-display text-3xl text-graphite">{dict.footer.terms}</h1>
      <div className="prose-sm mt-6 space-y-4 text-sm leading-relaxed text-graphite-soft">
        <p>
          Оформляя заказ на сайте {settings.storeName}, вы подтверждаете, что указанные вами
          данные (имя, телефон, адрес) верны и достаточны для связи с вами и доставки заказа.
        </p>
        <p>
          Стоимость товаров и доставки указана в сомах и рассчитывается на момент оформления
          заказа. Точная сумма и способ оплаты подтверждаются сотрудником магазина при
          обработке заказа.
        </p>
        <p>
          Наличие товара может уточняться при обработке заказа. Если товар закончился, мы
          свяжемся с вами для согласования замены или отмены заказа.
        </p>
        <p>
          По всем вопросам, связанным с заказом, вы можете обратиться по телефону {settings.phone}.
        </p>
      </div>
    </div>
  );
}
