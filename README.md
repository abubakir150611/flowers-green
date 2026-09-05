# Flowersgreen — интернет-магазин цветов (Бишкек)

Полноценный коммерческий e-commerce проект для цветочного магазина **FLOWERSGREEN**
(ул. Исы Ахунбаева, 173/1, Бишкек). Каталог, корзина, оформление заказа с доставкой
или самовывозом, двуязычный интерфейс (RU/KG) и защищённая админ-панель с
реальными push-уведомлениями о новых заказах — всё подключено к PostgreSQL
через Prisma, без моков и заглушек.

## Стек

- **Next.js 16** (App Router, TypeScript, React 19)
- **Tailwind CSS 4** — дизайн-система на CSS-токенах (ivory / graphite / green)
- **Prisma ORM + PostgreSQL**
- **Zustand** — корзина и избранное (persisted в localStorage)
- **Zod** — серверная валидация всех входных данных
- **jose + bcryptjs** — сессии администратора (httpOnly JWT cookie) и хеширование паролей
- **web-push** — реальные Web Push уведомления (VAPID) + Service Worker
- **motion** (Framer Motion) — сдержанные микро-анимации, с уважением к `prefers-reduced-motion`
- **lucide-react** — иконки

## Структура проекта

```
prisma/
  schema.prisma        Модели БД (Admin, Category, Product, Order, ...)
  seed.ts               Категории, демо-товары, настройки магазина, админ
scripts/
  generate-placeholders.mjs  Генерация demo-изображений (SVG) для seed
  generate-icon.mjs          Генерация PNG-иконок для PWA/push
src/
  app/
    (site)/             Публичный сайт (Header/Footer layout)
      catalog/, product/[slug]/, cart/, checkout/, order-success/[id]/,
      favorites/, search/, about/, delivery/, contacts/, privacy/, terms/
    admin/
      login/             Страница входа (без сайдбара)
      (dashboard)/        Дашборд, заказы, товары, категории, клиенты,
                          аналитика, настройки (за middleware-защитой)
    api/                  Route handlers (см. ниже)
    robots.ts, sitemap.ts
  components/           UI-кит, layout, catalog, admin, home, checkout, seo
  lib/                   auth, db, i18n, orders, push, security, validation
  store/                 Zustand-хранилища (cart, favorites)
  middleware.ts          Защита /admin и /api/admin/*
public/
  sw.js                  Service Worker для push-уведомлений
  manifest.json
  images/                Демо-изображения (генерируются скриптом)
  uploads/                Загруженные через админку изображения (не в git)
```

## Функциональность

**Покупатель:** каталог с фильтрами/сортировкой/поиском, страница товара с
галереей и вкладками (описание/характеристики/состав/уход/доставка/отзывы),
избранное и корзина на localStorage, оформление заказа (доставка или
самовывоз) с серверной проверкой цены и остатков, страница подтверждения
заказа с реальным номером `FG-XXXXXX`.

**Администратор:** защищённый вход (bcrypt + JWT httpOnly cookie), дашборд с
реальной статистикй из БД, список и детали заказов со сменой статуса по
разрешённым переходам, CRUD товаров (с загрузкой изображений) и категорий
(с защитой от удаления непустой категории), список клиентов с агрегированной
суммой покупок, аналитика за 7/30/90 дней, настройки магазина (телефон,
адрес, часы работы, стоимость доставки, тексты Hero и т.д.) — изменения сразу
отражаются на публичном сайте.

**Push-уведомления:** админ включает уведомления в `/admin/settings` →
браузер запрашивает разрешение → подписка сохраняется в БД
(`PushSubscription`) → при создании нового заказа сервер отправляет реальный
Web Push через `web-push` (VAPID) всем подписчикам → клик по уведомлению
открывает `/admin/orders/[id]`. Пока администратор находится на дашборде,
новые заказы также приходят в реальном времени через Server-Sent Events
(`/api/admin/orders/stream`) со звуковым сигналом (Web Audio API,
разблокируется первым кликом администратора — без нарушения autoplay-политик
браузера).

## Требования

- Node.js 20+
- PostgreSQL 14+ (локально или в облаке)

## Установка

```bash
npm install
```

## Environment variables

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp .env.example .env
```

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `DIRECT_URL` | Прямое подключение для миграций (можно = `DATABASE_URL`) |
| `AUTH_SECRET` | Секрет для подписи JWT сессии администратора |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Используются один раз при `db:seed` для создания первого администратора |
| `NEXT_PUBLIC_SITE_URL` | Публичный URL сайта (для sitemap, metadata, ссылок в push) |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` | Ключи Web Push |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Публичный VAPID-ключ, доступный в браузере (то же значение, что `VAPID_PUBLIC_KEY`) |

Сгенерировать VAPID-ключи:

```bash
npx web-push generate-vapid-keys
```

**Никогда не коммитьте `.env`** — он уже в `.gitignore`. В production
используйте секреты платформы хостинга (Vercel/Netlify/сервер), а не файл.

## PostgreSQL и Prisma

```bash
# сгенерировать Prisma Client
npm run db:generate

# применить миграции (создаёт БД/таблицы), в development
npm run db:migrate

# в production используйте:
npm run db:deploy

# заполнить БД категориями, демо-товарами, настройками и админом
npm run db:seed
```

`npm run db:seed` создаёт администратора из `ADMIN_EMAIL`/`ADMIN_PASSWORD`
(пароль хешируется bcrypt перед сохранением). Если переменные не заданы,
шаг создания администратора пропускается с предупреждением. Пароль можно
сменить в будущем, повторно запустив seed с новым `ADMIN_PASSWORD` — он
обновит хеш для существующего email.

Демо-товары используют сгенерированные процедурно SVG-иллюстрации
(`scripts/generate-placeholders.mjs`) вместо реальных фотографий — их легко
заменить на настоящие фото через `/admin/products` → загрузка изображения.
При необходимости пересоздать иллюстрации:

```bash
node scripts/generate-placeholders.mjs
node scripts/generate-icon.mjs
```

## Разработка

```bash
npm run dev
```

Сайт: http://localhost:3000
Админка: http://localhost:3000/admin/login (данные из `ADMIN_EMAIL`/`ADMIN_PASSWORD`)

## Production build

```bash
npm run build
npm run start
```

`npm run build` выполняет `next build` (включая проверку типов). Проект
успешно проходит `npm run build` без ошибок TypeScript.

## Линтинг

```bash
npm run lint
```

Примечание: правило `react-hooks/set-state-in-effect` (новое, ориентированное
на React Compiler правило из `eslint-config-next`) намеренно понижено до
`warn` в `eslint.config.mjs` — оно помечает как ошибку стандартный и
идиоматичный паттерн «загрузка данных в `useEffect`» и паттерн `mounted`-флага
для защиты от гидратационных расхождений (localStorage-хранилища корзины/
избранного). Это не обход реальной ошибки, а осознанная настройка
избыточно строгого правила.

## Деплой

Проект — обычное Next.js приложение с Node.js рантаймом (route handlers,
Server-Sent Events, локальная запись файлов в `/api/admin/upload`,
`node:events`/`node:fs` в API-роутах) — то есть требует **Node.js-совместимый
хостинг** (VPS, Docker, Render, Railway, обычный "Node" таргет Vercel и т.п.),
а не чисто edge/serverless-статический хостинг.

Важно для serverless/эфемерной файловой системы (например, Vercel):
`/api/admin/upload` по умолчанию сохраняет файлы на локальный диск
(`/public/uploads`), что **не переживёт** redeploy или новый инстанс на
таких платформах. Для продакшена на serverless-хостинге замените backend
этого роута на объектное хранилище (S3-совместимый бакет, Cloudinary и т.п.)
— остальной админ-интерфейс работает с любым backend, ему нужен только
возвращаемый URL изображения.

Шаги деплоя:

1. Создайте managed PostgreSQL (Neon, Supabase, RDS, etc.)
2. Задайте все переменные окружения на хостинге (см. `.env.example`)
3. `npm run build`
4. `npm run db:deploy` (миграции) и `npm run db:seed` (один раз, для
   первоначального наполнения и создания администратора)
5. `npm run start`

## Push-уведомления: как проверить

1. Откройте `/admin/settings`, нажмите «Включить push-уведомления» и
   разрешите уведомления в браузере.
2. Нажмите «Отправить тестовое уведомление» — должно прийти системное
   уведомление браузера.
3. Оформите тестовый заказ на публичном сайте — администратор получит
   реальный push с номером заказа, именем клиента и суммой; клик по
   уведомлению открывает `/admin/orders/[id]`.

Если VAPID-ключи не заданы в окружении, отправка push тихо пропускается
(в консоли сервера будет предупреждение) — сайт и админка продолжают
работать в обычном режиме.

## Управление изображениями

Все изображения (товары, категории, Hero на главной) загружаются через
админ-панель (`/api/admin/upload`) и хранятся в `/public/uploads`
(на локальном диске сервера). URL сохраняется в БД (`ProductImage.url`,
`Category.image`, `StoreSettings.heroImage`) — ничего не захардкожено,
владелец магазина может заменить любое изображение в любой момент.

## Troubleshooting

- **`Could not find Prisma Schema`** — убедитесь, что `prisma/schema.prisma`
  на месте и вы запускаете команды из корня проекта.
- **Подключение к БД не работает** — проверьте `DATABASE_URL`, что
  PostgreSQL запущен и доступен, и что пользователь имеет права на схему
  `public`.
- **Админ не может войти** — убедитесь, что `db:seed` был запущен с
  правильными `ADMIN_EMAIL`/`ADMIN_PASSWORD`, и что `AUTH_SECRET` задан
  (без него сессии не создаются).
- **Push не приходит** — проверьте, что `VAPID_PUBLIC_KEY`,
  `VAPID_PRIVATE_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY` заданы и совпадают,
  что браузер поддерживает Push API (Safari — с ограничениями), и что
  сайт открыт по HTTPS в production (Service Worker требует HTTPS вне
  localhost).
- **Изображения не отображаются после деплоя на serverless** — см. раздел
  «Деплой» выше про эфемерную файловую систему.

## Известные ограничения / осознанные решения

- `/api/admin/upload` использует локальный диск — см. предупреждение в
  разделе «Деплой».
- Realtime-обновления в админке используют SSE и in-memory EventEmitter —
  подходит для одного Node-инстанса; для горизонтального масштабирования
  замените на Redis pub/sub (комментарий в `src/lib/realtime/order-events.ts`).
- Rate limiting — простой in-memory fixed-window лимитер
  (`src/lib/security/rate-limit.ts`), подходит для одного инстанса; при
  масштабировании замените на общий стор (Redis).
- Демо-товары используют процедурно сгенерированные SVG-иллюстрации вместо
  реальных фотографий Flowersgreen (сеть недоступна из среды разработки для
  загрузки стоковых фото) — архитектура полностью готова к замене через
  админку, ничего не привязано к конкретным файлам намертво.
- Раздел отзывов на странице товара показывает честное пустое состояние —
  в задании прямо указано не выдавать демо-контент за реальные отзывы
  магазина.
