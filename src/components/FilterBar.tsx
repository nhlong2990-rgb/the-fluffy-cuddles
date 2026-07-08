"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type PriceRange = { label: string; min: number; max: number | null };

type Props = {
  tags: string[];
  sizes: string[];
  priceRanges: PriceRange[];
};

function toggleValue(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

export default function FilterBar({ tags, sizes, priceRanges }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedTags = searchParams.get("tag")?.split(",").filter(Boolean) ?? [];
  const selectedSizes = searchParams.get("size")?.split(",").filter(Boolean) ?? [];
  const selectedPrices = searchParams.get("price")?.split(",").filter(Boolean) ?? [];

  function updateParam(key: string, values: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length === 0) params.delete(key);
    else params.set(key, values.join(","));
    router.push(`${pathname}?${params.toString()}`);
  }

  function Pill({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={onClick}
        className={`rounded-full border px-3 py-1 text-sm transition ${
          active
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-gray-300 bg-white text-gray-600 hover:border-brand-400"
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="mb-8 space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">Loại sản phẩm</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Pill
              key={tag}
              active={selectedTags.includes(tag)}
              onClick={() => updateParam("tag", toggleValue(selectedTags, tag))}
            >
              {tag}
            </Pill>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Pill
              key={size}
              active={selectedSizes.includes(size)}
              onClick={() => updateParam("size", toggleValue(selectedSizes, size))}
            >
              {size}
            </Pill>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">Khoảng giá</p>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((r) => (
            <Pill
              key={r.label}
              active={selectedPrices.includes(r.label)}
              onClick={() => updateParam("price", toggleValue(selectedPrices, r.label))}
            >
              {r.label}
            </Pill>
          ))}
        </div>
      </div>
      {(selectedTags.length > 0 || selectedSizes.length > 0 || selectedPrices.length > 0) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm text-gray-500 underline hover:text-brand-600"
        >
          Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  );
}
