"use client";

import { addInventoryUnit } from "./actions";

type ProductOption = { id: string; name: string; size: string | null };

export default function NewInventoryForm({
  products,
  vendorNames,
}: {
  products: ProductOption[];
  vendorNames: string[];
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={addInventoryUnit}
      className="mb-8 grid grid-cols-2 gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-3"
    >
      <div className="col-span-2 md:col-span-3">
        <h2 className="mb-2 font-semibold text-gray-800">Nhập lô hàng mới</h2>
      </div>

      <div className="col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">Sản phẩm</label>
        <select name="productId" required className="w-full rounded-lg border border-gray-300 px-3 py-2">
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.size ? ` (${p.size})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nguồn hàng (vendor)</label>
        <input
          name="vendorName"
          required
          list="vendor-options"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
        <datalist id="vendor-options">
          {vendorNames.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Giá gốc (VND)</label>
        <input
          type="number"
          name="costPrice"
          required
          min={0}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Phí branding (VND)</label>
        <input
          type="number"
          name="brandingCost"
          defaultValue={0}
          min={0}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Ngày nhập</label>
        <input
          type="date"
          name="purchaseDate"
          defaultValue={today}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="col-span-2 flex items-end md:col-span-1">
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 py-2 font-medium text-white hover:bg-brand-700"
        >
          Thêm lô hàng
        </button>
      </div>
    </form>
  );
}
