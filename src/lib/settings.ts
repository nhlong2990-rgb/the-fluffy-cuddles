import { prisma } from "@/lib/prisma";

export type PriceRange = { label: string; min: number; max: number | null };

export const DEFAULT_PRICE_RANGES: PriceRange[] = [
  { label: "Dưới 1tr", min: 0, max: 999_999 },
  { label: "1-2tr", min: 1_000_000, max: 1_999_999 },
  { label: "2-3tr", min: 2_000_000, max: 2_999_999 },
  { label: "3-4tr", min: 3_000_000, max: 3_999_999 },
  { label: "4-5tr", min: 4_000_000, max: 4_999_999 },
  { label: "5tr+", min: 5_000_000, max: null },
];

export async function getSettings() {
  const existing = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (existing) return existing;
  return prisma.settings.create({
    data: {
      id: "singleton",
      facebookLink: "",
      priceRanges: DEFAULT_PRICE_RANGES,
    },
  });
}
