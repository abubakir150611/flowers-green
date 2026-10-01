import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="container-page max-w-3xl py-14 md:py-20">
      <h1 className="font-display text-3xl text-graphite sm:text-4xl">{dict.footer.terms}</h1>
      <p className="mt-2 text-sm text-graphite-soft">
        Публичная оферта и правила использования интернет-магазина
      </p>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-graphite-soft">
        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">1. Общие положения</h2>
          <p>
            Настоящий документ является официальным предложением (публичной офертой) интернет-магазина <strong>{settings.storeName}</strong> (далее — «Продавец») и содержит все существенные условия купли-продажи цветов, букетов, комнатных растений и сопутствующих товаров на сайте.
          </p>
          <p>
            Оформляя заказ на сайте, Покупатель выражает свое полное и безоговорочное согласие с условиями данного Пользовательского соглашения.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">2. Порядок оформления заказа</h2>
          <p>
            Заказ оформляется Покупателем самостоятельно через каталог сайта или при помощи менеджера по телефону.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>При оформлении заказа Покупатель обязан предоставить достоверные данные: имя, контактный номер телефона и адрес (в случае доставки).</li>
            <li>После успешного отправления формы формируется уникальный номер заказа (формата <code>FG-XXXXXX</code>).</li>
            <li>Обработка и подтверждение заказа производятся сотрудником Продавца в рабочее время (<em>{settings.workingHours}</em>).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">3. Цены и порядок оплаты</h2>
          <p>
            Все цены на товары на сайте указаны в национальной валюте Кыргызской Республики — <strong>сомах (КGS)</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Стоимость доставки рассчитывается при оформлении заказа в зависимости от выбранного способа получение товара.</li>
            <li>Оплата заказа производится наличными или безналичным расчётом при получении (курьеру/в магазине) либо переводом по реквизитам, согласованным с менеджером.</li>
            <li>Продавец оставляет за собой право менять цены на сайте, при этом цена уже оформленного и подтверждённого заказа изменению не подлежит.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">4. Особенности товара и эквивалентные замены</h2>
          <p>
            Цветочная продукция является природным материалом. Каждый авторский букет уникален и может незначительно отличаться от представленного на фотографии образца оттенками, формой или степенью раскрытия бутонов.
          </p>
          <p>
            В случае отсутствия отдельных видов цветов по причине сезонности, Продавец обязуется заранее связаться с Покупателем для согласования эквивалентной замены сопоставимого качества и стоимости.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">5. Доставка и самовывоз</h2>
          <p>
            Подробная информация о способах и интервалах доставки размещена на странице{" "}
            <Link href="/delivery" className="text-green hover:underline">
              Доставка и самовывоз
            </Link>.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Курьерская доставка осуществляется по территории города Бишкек.</li>
            <li>Самовывоз доступен по адресу: <em>{settings.address}</em>.</li>
            <li>Покупатель обязан обеспечить присутствие получателя по указанному адресу в согласованный интервал времени.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">6. Отмена и изменение заказа</h2>
          <p>
            Покупатель имеет право внести изменения или отменить заказ до того момента, как флорист приступил к сборке букета или заказ передан курьеру. Для отмены необходимо связаться с менеджером по телефону <strong>{settings.phone}</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">7. Ответственность сторон и применимое право</h2>
          <p>
            Стороны несут ответственность за неисполнение или ненадлежащее исполнение своих обязательств в соответствии с законодательством Кыргызской Республики.
          </p>
          <p>
            Все споры и разногласия решаются путем переговоров. При невозможности достижения согласия спор передается на рассмотрение в судебные органы Кыргызской Республики.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">8. Контакты и реквизиты</h2>
          <p>
            Магазин {settings.storeName}<br />
            Адрес: {settings.address}<br />
            Телефон: {settings.phone}<br />
            Режим работы: {settings.workingHours}
          </p>
          <p className="mt-4 text-xs italic text-graphite-faint border-t border-border pt-4">
            Примечание: Полные юридические реквизиты (ИП/ОСОО, ИНН) уточняются у владельца проекта.
          </p>
        </section>
      </div>
    </div>
  );
}
