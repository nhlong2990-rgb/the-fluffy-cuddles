"use client";

import { deleteProduct } from "./actions";

export default function DeleteProductButton({ productId }: { productId: string }) {
  return (
    <form
      action={() => deleteProduct(productId)}
      onSubmit={(e) => {
        if (!confirm("Xóa sản phẩm này? Toàn bộ lô hàng liên quan cũng sẽ bị xóa.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
