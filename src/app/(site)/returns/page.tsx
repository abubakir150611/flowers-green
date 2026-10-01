import type { Metadata } from "next";
import { getStoreSettings, buildWhatsAppUrl } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.footer.returns, alternates: { canonical: "/returns" } };
}

export default async function ReturnsPage() {
  const { dict } = await getServerDictionary();
  const settings = await getStoreSettings();

  return (
    <div className="container-page max-w-3xl py-14 md:py-20">
      <h1 className="font-display text-3xl text-graphite sm:text-4xl">{dict.footer.returns}</h1>
      <p className="mt-2 text-sm text-graphite-soft">
        Правила возврата, обмена и предъявления претензий по качеству товаров
      </p>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-graphite-soft">
        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">1. Правовое регулирование и особенности категории товаров</h2>
          <p>
            Правила возврата и обмена товаров в интернет-магазине <strong>{settings.storeName}</strong> регулируются Законом Кыргызской Республики «О защите прав потребителей» и спецификой реализуемой продукции.
          </p>
          <p>
            Срезанные цветы, готовые букеты и цветочные композиции относятся к категории скоропортящихся товаров животного и растительного происхождения, сохраняющих свежесть при соблюдении температурного режима и правильного ухода.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">2. Проверка качества при получении</h2>
          <p>
            Покупатель или получатель заказа обязаны проверить внешний вид, свежесть и комплектность букета непосредственно в момент вручения:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>При самовывозе:</strong> проверка производится в магазине по адресу: <em>{settings.address}</em>.</li>
            <li><strong>При курьерской доставке:</strong> проверка производится в присутствии курьера.</li>
          </ul>
          <p>
            Если при осмотре товар имеет видимые повреждения или не соответствует заказанному, Покупатель имеет право отказаться от заказа на месте.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">3. Порядок предъявления претензий по качеству цветов</h2>
          <p>
            Если скрытый дефект или преждевременная увядаемость проявились после передачи заказа, Покупатель имеет право обратиться в магазин в течение <strong>24 часов</strong> с момента получения заказа.
          </p>
          <p>Для рассмотрения обращения необходимо предоставить:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Номер заказа (например, <code>FG-XXXXXX</code>) или номер телефона, на который оформлялся заказ.</li>
            <li>Чёткие фотографии или видеозапись букета под хорошим освещением.</li>
            <li>Описание условий содержания (наличие воды, температура помещения, отсутствие источников тепла).</li>
          </ul>
          <p>
            При подтверждении ненадлежащего качества товара Магазин осуществляет бесплатную замену букета на аналогичный свежий букет или предлагает иное решение, согласованное с Покупателем.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">4. Возврат непродовольственных товаров (подарки, вазы, сувениры)</h2>
          <p>
            Товары длительного пользования (вазы, мягкие игрушки, сувениры, открытки и т.д.) подлежат возврату или обмену в течение <strong>14 дней</strong> с момента покупки при соблюдении следующих условий:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Товар не был в употреблении, сохранен его товарный вид и потребительские свойства.</li>
            <li>Имеется подтверждение покупки (номер заказа или чек).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">5. Отмена заказа до момента доставки</h2>
          <p>
            Покупатель может отменить заказ без удержания средств в любой момент до того, как флорист приступил к сборке букета. Если заказ уже собран или передан курьеру, отмена производится с компенсацией фактических расходов на материалы и транспортировку.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-graphite">6. Контакты службы поддержки и подачи заявок</h2>
          <p>
            Для оперативной подачи претензий и вопросов по замене товаров вы можете обратиться:
          </p>
          <ul className="list-none space-y-1 pl-0">
            <li><strong>Телефон:</strong> {settings.phone}</li>
            <li>
              <strong>WhatsApp:</strong>{" "}
              <a
                href={buildWhatsAppUrl(settings.whatsapp, settings.whatsappMessageRu)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green hover:underline"
              >
                {settings.whatsapp}
              </a>
            </li>
            <li><strong>Адрес магазина:</strong> {settings.address}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
