"use client";

type Product = {
  id: string;
  name: string;
  tag: string;
  size: string | null;
  sellPrice: number;
  imageUrl: string | null;
};

type Props = {
  action: (formData: FormData) => void;
  product?: Product;
  tagOptions: string[];
  sizeOptions: string[];
};

export default function ProductForm({ action, product, tagOptions, sizeOptions }: Props) {
  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-sm"
    >

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Tên sản phẩm</label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Loại</label>
        <input
          name="tag"
          required
          list="tag-options"
          defaultValue={product?.tag}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
        <datalist id="tag-options">
          {tagOptions.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Size (để trống nếu không áp dụng, ví dụ Bag Charm)
        </label>
        <input
          name="size"
          list="size-options"
          defaultValue={product?.size ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
        <datalist id="size-options">
          {sizeOptions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Giá bán (VND)</label>
        <input
          type="number"
          name="sellPrice"
          required
          min={0}
          defaultValue={product?.sellPrice}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Ảnh sản phẩm</label>
        {product?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="mb-2 h-32 w-32 rounded-lg object-cover" />
        )}
        <input type="file" name="image" accept="image/*" className="w-full text-sm" />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-brand-600 py-2 font-medium text-white hover:bg-brand-700"
      >
        Lưu
      </button>
    </form>
  );
}
