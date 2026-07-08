"use client";

import { markUnitSold } from "./actions";

export default function MarkSoldForm({ unitId, defaultPrice }: { unitId: string; defaultPrice: number }) {
  const today = new Date().toISOString().slice(0, 10);
  const action = markUnitSold.bind(null, unitId);

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input
        type="number"
        name="soldPrice"
        defaultValue={defaultPrice}
        min={0}
        className="w-28 rounded-lg border border-gray-300 px-2 py-1 text-sm"
      />
      <input
        type="date"
        name="soldDate"
        defaultValue={today}
        className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
      />
      <button
        type="submit"
        className="rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
      >
        Đã bán
      </button>
    </form>
  );
}
