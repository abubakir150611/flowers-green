import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    nameRu: "Букеты",
    nameKg: "Букеттер",
    slug: "bukety",
    descriptionRu: "Готовые букеты на любой случай",
    descriptionKg: "Ар кандай учур үчүн даяр букеттер",
    sortOrder: 1,
    image: "/images/categories/category-01.svg",
  },
  {
    nameRu: "Цветы",
    nameKg: "Гүлдөр",
    slug: "cvety",
    descriptionRu: "Одиночные и поштучные цветы",
    descriptionKg: "Жеке жана даана-даана гүлдөр",
    sortOrder: 2,
    image: "/images/categories/category-02.svg",
  },
  {
    nameRu: "Розы",
    nameKg: "Розалар",
    slug: "rozy",
    descriptionRu: "Розы разных оттенков и размеров",
    descriptionKg: "Ар түрдүү өңдөгү жана өлчөмдөгү розалар",
    sortOrder: 3,
    image: "/images/categories/category-03.svg",
  },
  {
    nameRu: "Цветочные композиции",
    nameKg: "Гүл композициялары",
    slug: "kompozicii",
    descriptionRu: "Композиции в коробках и корзинах",
    descriptionKg: "Кутуларда жана себеттерде композициялар",
    sortOrder: 4,
    image: "/images/categories/category-04.svg",
  },
  {
    nameRu: "Авторские букеты",
    nameKg: "Автордук букеттер",
    slug: "avtorskie-bukety",
    descriptionRu: "Уникальные букеты от флористов Flowersgreen",
    descriptionKg: "Flowersgreen флористеринин уникалдуу букеттери",
    sortOrder: 5,
    image: "/images/categories/category-05.svg",
  },
  {
    nameRu: "Комнатные растения",
    nameKg: "Бөлмө өсүмдүктөрү",
    slug: "komnatnye-rasteniya",
    descriptionRu: "Живые растения для дома и офиса",
    descriptionKg: "Үй жана офис үчүн тирүү өсүмдүктөр",
    sortOrder: 6,
    image: "/images/categories/category-06.svg",
  },
  {
    nameRu: "Подарки",
    nameKg: "Белектер",
    slug: "podarki",
    descriptionRu: "Подарки к букету или отдельно",
    descriptionKg: "Букетке кошумча же өзүнчө белектер",
    sortOrder: 7,
    image: "/images/categories/category-07.svg",
  },
  {
    nameRu: "Мягкие игрушки",
    nameKg: "Жумшак оюнчуктар",
    slug: "myagkie-igrushki",
    descriptionRu: "Мягкие игрушки в подарок",
    descriptionKg: "Белек үчүн жумшак оюнчуктар",
    sortOrder: 8,
    image: "/images/categories/category-08.svg",
  },
  {
    nameRu: "Открытки",
    nameKg: "Открыткалар",
    slug: "otkrytki",
    descriptionRu: "Открытки для тёплых пожеланий",
    descriptionKg: "Жылуу каалоолор үчүн открыткалар",
    sortOrder: 9,
    image: "/images/categories/category-09.svg",
  },
  {
    nameRu: "Подарочные наборы",
    nameKg: "Белек топтомдору",
    slug: "podarochnye-nabory",
    descriptionRu: "Готовые наборы: цветы плюс подарок",
    descriptionKg: "Даяр топтомдор: гүл плюс белек",
    sortOrder: 10,
    image: "/images/categories/category-10.svg",
  },
];

type SeedProduct = {
  nameRu: string;
  nameKg: string;
  slug: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  descriptionRu: string;
  descriptionKg: string;
  compositionRu?: string;
  compositionKg?: string;
  careRu?: string;
  careKg?: string;
  characteristics?: Record<string, string>;
  featured?: boolean;
  isNew?: boolean;
  imageIndex: number;
};

const products: SeedProduct[] = [
  {
    nameRu: "Букет из сезонных цветов",
    nameKg: "Мезгилдик гүлдөрдөн букет",
    slug: "buket-iz-sezonnyh-cvetov",
    categorySlug: "bukety",
    price: 2200,
    stock: 14,
    sku: "FG-B-001",
    descriptionRu: "Букет из свежих сезонных цветов, собранный флористом в спокойной цветовой гамме.",
    descriptionKg: "Флорист жыйнаган, тынч түс гаммасындагы жаңы мезгилдик гүлдөрдөн букет.",
    careRu: "Обновляйте воду каждые два дня, подрезайте стебли под углом.",
    careKg: "Сууну эки күн сайын алмаштырыңыз, сабактарын бурчтап кесиңиз.",
    characteristics: { Высота: "40-45 см", Упаковка: "Крафт-бумага" },
    featured: true,
    imageIndex: 1,
  },
  {
    nameRu: "Нежная композиция в пастельных оттенках",
    nameKg: "Пастель өңдөрүндөгү назик композиция",
    slug: "nezhnaya-kompoziciya-v-pastelnyh-ottenkah",
    categorySlug: "kompozicii",
    price: 3400,
    oldPrice: 3900,
    stock: 8,
    sku: "FG-K-001",
    descriptionRu: "Композиция в коробке из пионовидных роз и эустомы в пастельной гамме.",
    descriptionKg: "Кутудагы пион түстөгу розалардан жана эустомадан турган пастелдик композиция.",
    characteristics: { Основа: "Флористическая губка", Диаметр: "25 см" },
    featured: true,
    imageIndex: 2,
  },
  {
    nameRu: "Букет из роз",
    nameKg: "Розалардан букет",
    slug: "buket-iz-roz",
    categorySlug: "rozy",
    price: 2800,
    stock: 20,
    sku: "FG-R-001",
    descriptionRu: "Классический букет из роз — универсальный выбор для любого повода.",
    descriptionKg: "Ар кандай учур үчүн классикалык розалардан букет.",
    compositionRu: "Розы, зелень, упаковочная бумага",
    compositionKg: "Розалар, көк жалбырак, кагаз таңгак",
    isNew: true,
    imageIndex: 3,
  },
  {
    nameRu: "Розы Premium (25 шт.)",
    nameKg: "Premium розалар (25 даана)",
    slug: "rozy-premium-25",
    categorySlug: "rozy",
    price: 5200,
    stock: 6,
    sku: "FG-R-002",
    descriptionRu: "25 роз премиального качества в единой цветовой гамме.",
    descriptionKg: "Бир түс гаммасындагы 25 даана премиум сапаттагы роза.",
    featured: true,
    imageIndex: 4,
  },
  {
    nameRu: "Авторский букет «Осенний вальс»",
    nameKg: "Автордук букет «Күзгү вальс»",
    slug: "avtorskiy-buket-osenniy-vals",
    categorySlug: "avtorskie-bukety",
    price: 3900,
    stock: 5,
    sku: "FG-A-001",
    descriptionRu: "Авторская работа флориста Flowersgreen в тёплых осенних тонах.",
    descriptionKg: "Flowersgreen флористинин жылуу күзгү түстөгу автордук иши.",
    isNew: true,
    imageIndex: 5,
  },
  {
    nameRu: "Авторский букет «Утренний сад»",
    nameKg: "Автордук букет «Эртеңки бак»",
    slug: "avtorskiy-buket-utrenniy-sad",
    categorySlug: "avtorskie-bukety",
    price: 4300,
    stock: 4,
    sku: "FG-A-002",
    descriptionRu: "Свежая и лёгкая композиция с преобладанием белых и зелёных тонов.",
    descriptionKg: "Ак жана жашыл түстөр басымдуу болгон жеңил, жаңы композиция.",
    featured: true,
    imageIndex: 6,
  },
  {
    nameRu: "Букет пионов",
    nameKg: "Пиондордон букет",
    slug: "buket-pionov",
    categorySlug: "bukety",
    price: 4600,
    stock: 7,
    sku: "FG-B-002",
    descriptionRu: "Пышный букет из пионов — символ нежности и достатка.",
    descriptionKg: "Пиондордон турган мол букет — назиктик жана байлыктын символу.",
    imageIndex: 7,
  },
  {
    nameRu: "Букет тюльпанов",
    nameKg: "Лаленин букеттери",
    slug: "buket-tyulpanov",
    categorySlug: "bukety",
    price: 1900,
    stock: 25,
    sku: "FG-B-003",
    descriptionRu: "Яркий весенний букет тюльпанов.",
    descriptionKg: "Жаркыраган жазгы лале гүлдөрүнөн букет.",
    isNew: true,
    imageIndex: 8,
  },
  {
    nameRu: "Монобукет из хризантем",
    nameKg: "Хризантемадан монобукет",
    slug: "monobuket-iz-hrizantem",
    categorySlug: "cvety",
    price: 2100,
    stock: 12,
    sku: "FG-C-001",
    descriptionRu: "Монобукет из кустовых хризантем плотной сборки.",
    descriptionKg: "Бадал хризантемадан турган тыгыз жыйылган монобукет.",
    imageIndex: 9,
  },
  {
    nameRu: "Эустома в упаковке",
    nameKg: "Таңгактагы эустома",
    slug: "eustoma-v-upakovke",
    categorySlug: "cvety",
    price: 2500,
    stock: 10,
    sku: "FG-C-002",
    descriptionRu: "Воздушная эустома, похожая на розу, в аккуратной упаковке.",
    descriptionKg: "Розага окшош, жеңил эустома, кынапталган таңгакта.",
    imageIndex: 10,
  },
  {
    nameRu: "Фикус Бенджамина",
    nameKg: "Бенджамин фикусу",
    slug: "fikus-bendzhamina",
    categorySlug: "komnatnye-rasteniya",
    price: 3200,
    stock: 9,
    sku: "FG-P-001",
    descriptionRu: "Неприхотливое комнатное растение для дома и офиса.",
    descriptionKg: "Үй жана офис үчүн кам көрүүсү жеңил бөлмө өсүмдүгү.",
    careRu: "Умеренный полив, рассеянный свет.",
    careKg: "Орточо сугаруу, чачыранды жарык.",
    imageIndex: 11,
  },
  {
    nameRu: "Спатифиллум",
    nameKg: "Спатифиллум",
    slug: "spatifillum",
    categorySlug: "komnatnye-rasteniya",
    price: 2700,
    stock: 11,
    sku: "FG-P-002",
    descriptionRu: "Спатифиллум в керамическом кашпо — символ семейного счастья.",
    descriptionKg: "Керамикалык кашподогу спатифиллум — үй-бүлөлүк бакыттын символу.",
    imageIndex: 12,
  },
  {
    nameRu: "Суккулент в кашпо",
    nameKg: "Кашподогу суккулент",
    slug: "sukkulent-v-kashpo",
    categorySlug: "komnatnye-rasteniya",
    price: 1200,
    stock: 30,
    sku: "FG-P-003",
    descriptionRu: "Небольшой суккулент — простое и стильное решение для интерьера.",
    descriptionKg: "Кичинекей суккулент — интерьер үчүн жөнөкөй жана стилдүү чечим.",
    isNew: true,
    imageIndex: 13,
  },
  {
    nameRu: "Плюшевый мишка",
    nameKg: "Жумшак аюу оюнчук",
    slug: "plyushevyy-mishka",
    categorySlug: "myagkie-igrushki",
    price: 1800,
    stock: 15,
    sku: "FG-T-001",
    descriptionRu: "Мягкий плюшевый мишка — тёплое дополнение к букету.",
    descriptionKg: "Жумшак аюу оюнчук — букетке жылуу кошумча.",
    imageIndex: 14,
  },
  {
    nameRu: "Мягкая игрушка «Зайка»",
    nameKg: "Жумшак оюнчук «Коён»",
    slug: "myagkaya-igrushka-zayka",
    categorySlug: "myagkie-igrushki",
    price: 1500,
    stock: 18,
    sku: "FG-T-002",
    descriptionRu: "Мягкая игрушка-зайка среднего размера.",
    descriptionKg: "Орто өлчөмдөгү жумшак коён оюнчук.",
    imageIndex: 15,
  },
  {
    nameRu: "Открытка «С днём рождения»",
    nameKg: "«Туулган күнүң менен» открыткасы",
    slug: "otkrytka-s-dnem-rozhdeniya",
    categorySlug: "otkrytki",
    price: 250,
    stock: 60,
    sku: "FG-O-001",
    descriptionRu: "Открытка с тёплыми пожеланиями на день рождения.",
    descriptionKg: "Туулган күнгө арналган жылуу тилектери бар открытка.",
    imageIndex: 16,
  },
  {
    nameRu: "Открытка «Спасибо»",
    nameKg: "«Рахмат» открыткасы",
    slug: "otkrytka-spasibo",
    categorySlug: "otkrytki",
    price: 250,
    stock: 60,
    sku: "FG-O-002",
    descriptionRu: "Небольшая открытка со словами благодарности.",
    descriptionKg: "Ыраазычылык сөздөрү бар кичинекей открытка.",
    imageIndex: 17,
  },
  {
    nameRu: "Набор «Цветы и мишка»",
    nameKg: "«Гүл жана аюу» топтому",
    slug: "nabor-cvety-i-mishka",
    categorySlug: "podarochnye-nabory",
    price: 4100,
    stock: 6,
    sku: "FG-N-001",
    descriptionRu: "Букет из роз в комплекте с мягким мишкой.",
    descriptionKg: "Жумшак аюу менен бирге розалардан букет.",
    featured: true,
    imageIndex: 18,
  },
  {
    nameRu: "Набор «Цветы и открытка»",
    nameKg: "«Гүл жана открытка» топтому",
    slug: "nabor-cvety-i-otkrytka",
    categorySlug: "podarochnye-nabory",
    price: 2450,
    stock: 10,
    sku: "FG-N-002",
    descriptionRu: "Букет сезонных цветов с открыткой на выбор.",
    descriptionKg: "Тандоо боюнча открыткасы бар мезгилдик гүлдөрдөн букет.",
    imageIndex: 19,
  },
  {
    nameRu: "Ароматическая свеча",
    nameKg: "Жыпар жыттуу шам",
    slug: "aromaticheskaya-svecha",
    categorySlug: "podarki",
    price: 900,
    stock: 22,
    sku: "FG-G-001",
    descriptionRu: "Ароматическая свеча в подарочной упаковке.",
    descriptionKg: "Белек таңгагындагы жыпар жыттуу шам.",
    imageIndex: 20,
  },
  {
    nameRu: "Шоколадный набор в подарок",
    nameKg: "Белек үчүн шоколад топтому",
    slug: "shokoladnyy-nabor-v-podarok",
    categorySlug: "podarki",
    price: 1100,
    stock: 16,
    sku: "FG-G-002",
    descriptionRu: "Набор шоколадных конфет как дополнение к букету.",
    descriptionKg: "Букетке кошумча катары шоколад топтому.",
    imageIndex: 21,
  },
  {
    nameRu: "Букет «Летнее настроение»",
    nameKg: "«Жайкы маанай» букети",
    slug: "buket-letnee-nastroenie",
    categorySlug: "bukety",
    price: 2600,
    stock: 13,
    sku: "FG-B-004",
    descriptionRu: "Яркий летний букет из смешанных цветов.",
    descriptionKg: "Аралаш гүлдөрдөн турган жаркыраган жайкы букет.",
    isNew: true,
    imageIndex: 22,
  },
  {
    nameRu: "Композиция в корзине",
    nameKg: "Себеттеги композиция",
    slug: "kompoziciya-v-korzine",
    categorySlug: "kompozicii",
    price: 3800,
    stock: 5,
    sku: "FG-K-002",
    descriptionRu: "Цветочная композиция в плетёной корзине.",
    descriptionKg: "Токулган себеттеги гүл композициясы.",
    imageIndex: 23,
  },
  {
    nameRu: "Розы в шляпной коробке",
    nameKg: "Шляпа кутудагы розалар",
    slug: "rozy-v-shlyapnoy-korobke",
    categorySlug: "rozy",
    price: 3600,
    oldPrice: 4000,
    stock: 7,
    sku: "FG-R-003",
    descriptionRu: "Розы, уложенные в стильную шляпную коробку.",
    descriptionKg: "Стилдүү шляпа кутуга салынган розалар.",
    featured: true,
    imageIndex: 24,
  },
];

async function main() {
  console.log("Seeding categories...");
  const categoryIdBySlug = new Map<string, string>();
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        nameRu: c.nameRu,
        nameKg: c.nameKg,
        descriptionRu: c.descriptionRu,
        descriptionKg: c.descriptionKg,
        sortOrder: c.sortOrder,
        image: c.image,
      },
      create: c,
    });
    categoryIdBySlug.set(c.slug, created.id);
  }

  console.log("Seeding products...");
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) throw new Error(`Unknown category slug: ${p.categorySlug}`);

    const idx = String(p.imageIndex).padStart(2, "0");
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        nameRu: p.nameRu,
        nameKg: p.nameKg,
        categoryId,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        stock: p.stock,
        descriptionRu: p.descriptionRu,
        descriptionKg: p.descriptionKg,
        compositionRu: p.compositionRu ?? "",
        compositionKg: p.compositionKg ?? "",
        careRu: p.careRu ?? "",
        careKg: p.careKg ?? "",
        characteristics: p.characteristics ?? undefined,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
      },
      create: {
        nameRu: p.nameRu,
        nameKg: p.nameKg,
        slug: p.slug,
        categoryId,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        stock: p.stock,
        sku: p.sku,
        descriptionRu: p.descriptionRu,
        descriptionKg: p.descriptionKg,
        compositionRu: p.compositionRu ?? "",
        compositionKg: p.compositionKg ?? "",
        careRu: p.careRu ?? "",
        careKg: p.careKg ?? "",
        characteristics: p.characteristics ?? undefined,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
        images: {
          create: [
            { url: `/images/products/product-${idx}-a.svg`, alt: p.nameRu, sortOrder: 0 },
            { url: `/images/products/product-${idx}-b.svg`, alt: p.nameRu, sortOrder: 1 },
          ],
        },
      },
    });
  }

  console.log("Seeding store settings...");
  await prisma.storeSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      heroImage: "/images/hero/hero.svg",
    },
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.warn(
      "ADMIN_EMAIL / ADMIN_PASSWORD are not set — skipping admin account creation. " +
        "Set them in your environment and re-run `npm run db:seed` to create the admin."
    );
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: { email: adminEmail, passwordHash, name: "Администратор" },
    });
    console.log(`Admin account ready: ${adminEmail}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
