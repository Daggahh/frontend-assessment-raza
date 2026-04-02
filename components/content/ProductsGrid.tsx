import { ProductCard } from "@/components/content/ProductCard";
import type { MediaType, TmdbListItem } from "@/types/tmdb";

type ProductsGridProps = {
  products: TmdbListItem[];
  mediaType: MediaType;
};

export function ProductsGrid({ products, mediaType }: ProductsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} mediaType={mediaType} priority={index < 4} />
      ))}
    </section>
  );
}
