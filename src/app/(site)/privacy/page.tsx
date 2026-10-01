import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="container-page max-w-3xl py-14 md:py-20">
      <h1 className="font-display text-3xl text-graphite sm:text-4xl">{dict.footer.privacy}</h1>
      <p className="mt-2 text-sm text-graphite-soft">
        Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
      </p>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-graphite-soft">
        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей интернет-магазина <strong>{settings.storeName}</strong> (далее — «Магазин»), расположенного по адресу: <em>{settings.address}</em>.
          </p>
          <p>
            Мы уважительно относимся к конфиденциальности вашей информации и обеспечиваем соблюдение законодательства Кыргызской Республики, включая Закон КР «Об информации персонального характера».
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">2. Какие персональные данные мы собираем</h2>
          <p>При оформлении заказа и использовании сайта Магазина могут собираться следующие данные:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Имя клиента:</strong> для обращения и идентификации заказа.</li>
            <li><strong>Номер телефона:</strong> для подтверждения заказа, отправки уведомлений и связи службы доставки.</li>
            <li><strong>Адрес доставки:</strong> при выборе курьерской доставки по Бишкеку.</li>
            <li><strong>Комментарий к заказу:</strong> дополнительные пожелания по составу букета или времени вручения.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">3. Цели обработки данных</h2>
          <p>Собранные данные используются исключительно для следующих целей:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Оформление, обработка и доставка вашего заказа.</li>
            <li>Связь с вами для уточнения деталей заказа, замен цветов или времени доставки.</li>
            <li>Предоставление клиентской поддержки.</li>
            <li>Обеспечение корректной работы интернет-магазина.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">4. Хранение данных и безопасность</h2>
          <p>
            Ваши данные хранятся в защищённой базе данных сервера. Доступ к базе данных ограничен авторизованным персоналом Магазина.
          </p>
          <p>
            Данные корзины и избранного хранятся исключительно в локальном хранилище вашего браузера (<code>localStorage</code>) и не передаются третьим лицам. Подробнее о техническом хранении вы можете прочитать на странице{" "}
            <Link href="/cookies" className="text-green hover:underline">
              Политики Cookies
            </Link>.
          </p>
          <p>
            Наш сайт не собирает и не хранит данные банковских карт пользователей непосредственно на сервере.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">5. Передача данных третьим лицам</h2>
          <p>
            Персональные данные не передаются и не продаются третьим лицам, за исключением случаев:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Необходимости выполнения заказа (передача имени, телефона и адреса курьерской службе).</li>
            <li>Требований законодательства Кыргызской Республики на основании официальных запросов уполномоченных органов.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">6. Права пользователя</h2>
          <p>Вы имеете право:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Запросить информацию о том, какие ваши персональные данные хранятся в нашей базе.</li>
            <li>Потребовать исправления или полного удаления ваших персональных данных.</li>
            <li>Отозвать согласие на обработку данных, обратившись к нам.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">7. Контакты по вопросам конфиденциальности</h2>
          <p>
            По всем вопросам, связанным с обработкой и удалением персональных данных, вы можете обращаться:
          </p>
          <ul className="list-none space-y-1 pl-0">
            <li><strong>Телефон:</strong> {settings.phone}</li>
            <li><strong>Адрес магазина:</strong> {settings.address}</li>
            <li><strong>Режим работы:</strong> {settings.workingHours}</li>
          </ul>
          <p className="mt-4 text-xs italic text-graphite-faint border-t border-border pt-4">
            Примечание: Полные юридические реквизиты организации (ИП/ОСОО, ИНН) уточняются у владельца проекта.
          </p>
        </section>
      </div>
    </div>
  );
}
