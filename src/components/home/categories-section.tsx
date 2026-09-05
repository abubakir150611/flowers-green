import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCard } from "@/components/catalog/category-card";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { CategoryDTO } from "@/lib/types";

export function CategoriesSection({
  categories,
  dict,
}: {
  categories: CategoryDTO[];
  dict: Dictionary;
}) {
  if (categories.length === 0) return null;

  return (
    <section className="container-page py-14 md:py-20">
      <SectionHeading title={dict.home.categoriesTitle} subtitle={dict.home.categoriesSubtitle} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
