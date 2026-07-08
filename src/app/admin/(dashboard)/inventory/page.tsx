import { prisma } from "@/lib/prisma";
import NewInventoryForm from "./NewInventoryForm";
import MarkSoldForm from "./MarkSoldForm";

export const dynamic = "force-dynamic";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default async function InventoryPage() {
  const [products, vendors, inStockUnits] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, size: true, sellPrice: true }, orderBy: { name: "asc" } }),
    prisma.vendor.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
    prisma.inventoryUnit.findMany({
      where: { status: "IN_STOCK" },
      include: { product: true, vendor: true },
      orderBy: { purchaseDate: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Nhập hàng &amp; Bán hàng</h1>

      <NewInventoryForm
        products={products}
        vendorNames={vendors.map((v) => v.name)}
      />

      <h2 className="mb-3 font-semibold text-gray-800">Lô hàng còn tồn ({inStockUnits.length})</h2>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3">Sản phẩm</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Giá gốc</th>
              <th className="px-4 py-3">Branding</th>
              <th className="px-4 py-3">Ngày nhập</th>
              <th className="px-4 py-3">Đánh dấu đã bán</th>
            </tr>
          </thead>
          <tbody>
            {inStockUnits.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">
                  {u.product.name}
                  {u.product.size ? ` (${u.product.size})` : ""}
                </td>
                <td className="px-4 py-3">{u.vendor.name}</td>
                <td className="px-4 py-3">{formatVND(u.costPrice)}</td>
                <td className="px-4 py-3">{formatVND(u.brandingCost)}</td>
                <td className="px-4 py-3">{new Date(u.purchaseDate).toLocaleDateString("vi-VN")}</td>
                <td className="px-4 py-3">
                  <MarkSoldForm unitId={u.id} defaultPrice={u.product.sellPrice} />
                </td>
              </tr>
            ))}
            {inStockUnits.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Không có lô hàng nào còn tồn.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
