"use client";

import { useState } from "react";
import { updateSettings } from "./actions";

type PriceRange = { label: string; min: number; max: number | null };

export default function SettingsForm({
  facebookLink,
  priceRanges: initialRanges,
}: {
  facebookLink: string;
  priceRanges: PriceRange[];
}) {
  const [ranges, setRanges] = useState<PriceRange[]>(initialRanges);

  function updateRange(i: number, field: keyof PriceRange, value: string) {
    setRanges((prev) =>
      prev.map((r, idx) => {
        if (idx !== i) return r;
        if (field === "label") return { ...r, label: value };
        if (field === "max") return { ...r, max: value === "" ? null : Number(value) };
        return { ...r, min: Number(value) };
      })
    );
  }

  function addRange() {
    setRanges((prev) => [...prev, { label: "", min: 0, max: null }]);
  }

  function removeRange(i: number) {
    setRanges((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <form action={updateSettings} className="max-w-2xl space-y-8 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Link Facebook / Messenger để tư vấn
        </label>
        <input
          name="facebookLink"
          type="url"
          required
          defaultValue={facebookLink}
          placeholder="https://m.me/tenfanpage"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Khoảng giá filter</label>
          <button type="button" onClick={addRange} className="text-sm text-brand-600 hover:underline">
            + Thêm khoảng
          </button>
        </div>
        <div className="space-y-2">
          {ranges.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={r.label}
                onChange={(e) => updateRange(i, "label", e.target.value)}
                placeholder="Nhãn (vd: Dưới 1tr)"
                className="w-40 rounded-lg border border-gray-300 px-2 py-1 text-sm"
              />
              <input
                type="number"
                value={r.min}
                onChange={(e) => updateRange(i, "min", e.target.value)}
                placeholder="Từ (VND)"
                className="w-32 rounded-lg border border-gray-300 px-2 py-1 text-sm"
              />
              <input
                type="number"
                value={r.max ?? ""}
                onChange={(e) => updateRange(i, "max", e.target.value)}
                placeholder="Đến (để trống = không giới hạn)"
                className="w-32 rounded-lg border border-gray-300 px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => removeRange(i)}
                className="text-sm text-red-600 hover:underline"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      </div>

      <input type="hidden" name="priceRangesJson" value={JSON.stringify(ranges)} readOnly />

      <button
        type="submit"
        className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
      >
        Lưu cài đặt
      </button>
    </form>
  );
}
