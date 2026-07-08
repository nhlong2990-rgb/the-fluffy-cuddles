import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      units: { where: { status: "IN_STOCK" }, select: { id: true } },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sản phẩm ({products.length})</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Giá bán</th>
              <th className="px-4 py-3">Còn hàng</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.tag}</td>
                <td className="px-4 py-3">{p.size ?? "-"}</td>
                <td className="px-4 py-3">{formatVND(p.sellPrice)}</td>
                <td className="px-4 py-3">
                  {p.units.length > 0 ? (
                    <span className="text-green-600">{p.units.length} lô</span>
                  ) : (
                    <span className="text-gray-400">Hết hàng</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/products/${p.id}`} className="text-brand-600 hover:underline">
                      Sửa
                    </Link>
                    <DeleteProductButton productId={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
