import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type PriceRange = { label: string; min: number; max: number | null };

export default async function HomePage({
  searchParams,
}: {
  searchParams: { tag?: string; size?: string; price?: string };
}) {
  const settings = await getSettings();
  const priceRanges = settings.priceRanges as unknown as PriceRange[];

  const selectedTags = searchParams.tag?.split(",").filter(Boolean) ?? [];
  const selectedSizes = searchParams.size?.split(",").filter(Boolean) ?? [];
  const selectedPriceLabels = searchParams.price?.split(",").filter(Boolean) ?? [];

  const inStockFilter: Prisma.ProductWhereInput = {
    units: { some: { status: "IN_STOCK" } },
  };

  const [allTags, allSizes] = await Promise.all([
    prisma.product.findMany({
      where: inStockFilter,
      distinct: ["tag"],
      select: { tag: true },
      orderBy: { tag: "asc" },
    }),
    prisma.product.findMany({
      where: { ...inStockFilter, size: { not: null } },
      distinct: ["size"],
      select: { size: true },
      orderBy: { size: "asc" },
    }),
  ]);

  const where: Prisma.ProductWhereInput = { ...inStockFilter };
  if (selectedTags.length > 0) where.tag = { in: selectedTags };
  if (selectedSizes.length > 0) where.size = { in: selectedSizes };

  if (selectedPriceLabels.length > 0) {
    const selectedRanges = priceRanges.filter((r) => selectedPriceLabels.includes(r.label));
    where.OR = selectedRanges.map((r) => ({
      sellPrice: {
        gte: r.min,
        ...(r.max !== null ? { lte: r.max } : {}),
      },
    }));
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-2xl font-bold text-brand-700">The Fluffy Cuddles</h1>
          <p className="text-sm text-gray-500">Gấu bông Jellycat chính hãng — bấm vào sản phẩm để inbox tư vấn</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <FilterBar
          tags={allTags.map((t) => t.tag)}
          sizes={allSizes.map((s) => s.size as string)}
          priceRanges={priceRanges}
        />

        {products.length === 0 ? (
          <p className="py-16 text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                tag={p.tag}
                size={p.size}
                sellPrice={p.sellPrice}
                imageUrl={p.imageUrl}
                facebookLink={settings.facebookLink}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
