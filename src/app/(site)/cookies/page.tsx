import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.footer.cookies, alternates: { canonical: "/cookies" } };
}

export default async function CookiesPage() {
  const { dict } = await getServerDictionary();
  const settings = await getStoreSettings();

  return (
    <div className="container-page max-w-3xl py-14 md:py-20">
      <h1 className="font-display text-3xl text-graphite sm:text-4xl">{dict.footer.cookies}</h1>
      <p className="mt-2 text-sm text-graphite-soft">
        Информация об использовании файлов cookie и локального хранилища браузера
      </p>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-graphite-soft">
        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">1. Что такое файлы Cookie и LocalStorage</h2>
          <p>
            Для удобства пользователей веб-сайт <strong>{settings.storeName}</strong> использует механизмы хранения данных на стороне клиента: файлы Cookie и локальное хранилище браузера (<code>localStorage</code>).
          </p>
          <p>
            Эти технологии позволяют сайту запоминать ваши действия и предпочтения (например, содержимое корзины или выбранный язык), чтобы вам не приходилось вводить их заново при каждом посещении.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">2. Как мы используем LocalStorage</h2>
          <p>На нашем сайте используются следующие технические записи в локальном хранилище:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong><code>cart-storage</code>:</strong> хранит состав вашей корзины (выбранные товары и их количество), чтобы вы могли продолжить выбор покупок в любое время.
            </li>
            <li>
              <strong><code>favorites-storage</code>:</strong> хранит список понравившихся вам товаров («Избранное»).
            </li>
            <li>
              <strong><code>NEXT_LOCALE</code>:</strong> запоминает выбранный языковой интерфейс (русский или кыргызский).
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">3. Использование файлов Cookie</h2>
          <p>Наш сайт использует ограниченное количество технических файлов Cookie:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong><code>admin_session</code>:</strong> защищённый зашифрованный файл cookie (httpOnly), используемый исключительно для авторизации администратора в панели управления сайтом. Для обычных покупателей данный файл не устанавливается.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">4. Отсутствие рекламных и отслеживающих трекеров</h2>
          <p>
            Магазин {settings.storeName} <strong>не использует</strong> сторонние рекламные файлы cookie, маркетинговые трекеры или межсайтовые пиксели для отслеживания ваших действий на других сайтах.
          </p>
          <p>
            При переходе по внешним ссылкам (например, на картах Google Maps / Yandex или в мессенджер WhatsApp) применяются политики конфиденциальности соответствующего стороннего сервиса.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">5. Управление данными браузера</h2>
          <p>
            Вы в любой момент можете очистить или заблокировать файлы cookie и данные <code>localStorage</code> в настройках вашего веб-браузера. Обратите внимание: очистка <code>localStorage</code> приведет к сбросу товаров в вашей корзине и списке избранного.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">6. Контактная информация</h2>
          <p>
            Если у вас возникли вопросы по поводу технической работы сайта, свяжитесь с нами по телефону: <strong>{settings.phone}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
