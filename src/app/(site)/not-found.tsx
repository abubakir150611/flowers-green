import { ButtonLink } from "@/components/ui/button";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const { dict } = await getServerDictionary();

  return (
    <div className="container-page flex flex-col items-center justify-center py-28 text-center">
      <p className="font-display text-7xl text-green">404</p>
      <h1 className="mt-4 font-display text-2xl text-graphite">{dict.product.notFound}</h1>
      <p className="mt-2 max-w-sm text-sm text-graphite-soft">{dict.product.notFoundText}</p>
      <ButtonLink href="/catalog" className="mt-8">
        {dict.product.backToCatalog}
      </ButtonLink>
    </div>
  );
}
