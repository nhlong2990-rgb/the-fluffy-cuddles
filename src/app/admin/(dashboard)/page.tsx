import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default async function AdminDashboardPage() {
  const [soldUnits, inStockCount, productCount] = await Promise.all([
    prisma.inventoryUnit.findMany({
      where: { status: "SOLD" },
      include: { vendor: true, product: true },
      orderBy: { soldDate: "desc" },
    }),
    prisma.inventoryUnit.count({ where: { status: "IN_STOCK" } }),
    prisma.product.count(),
  ]);

  const totalRevenue = soldUnits.reduce((sum, u) => sum + (u.soldPrice ?? 0), 0);
  const totalCost = soldUnits.reduce((sum, u) => sum + u.costPrice + u.brandingCost, 0);
  const totalProfit = totalRevenue - totalCost;

  const byMonth = new Map<string, { revenue: number; profit: number; count: number }>();
  const byVendor = new Map<string, { revenue: number; profit: number; count: number }>();

  for (const u of soldUnits) {
    const revenue = u.soldPrice ?? 0;
    const cost = u.costPrice + u.brandingCost;
    const profit = revenue - cost;

    const monthKey = u.soldDate ? new Date(u.soldDate).toISOString().slice(0, 7) : "Không rõ";
    const m = byMonth.get(monthKey) ?? { revenue: 0, profit: 0, count: 0 };
    m.revenue += revenue;
    m.profit += profit;
    m.count += 1;
    byMonth.set(monthKey, m);

    const vendorName = u.vendor.name;
    const v = byVendor.get(vendorName) ?? { revenue: 0, profit: 0, count: 0 };
    v.revenue += revenue;
    v.profit += profit;
    v.count += 1;
    byVendor.set(vendorName, v);
  }

  const monthRows = [...byMonth.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  const vendorRows = [...byVendor.entries()].sort((a, b) => b[1].profit - a[1].profit);

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Tổng quan tài chính</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Doanh thu (đã bán)</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">{formatVND(totalRevenue)}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Lãi</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{formatVND(totalProfit)}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Sản phẩm / còn tồn</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">
            {productCount} / {inStockCount} lô
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-gray-800">Theo tháng</h2>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3">Tháng</th>
                <th className="px-4 py-3">Số lượng bán</th>
                <th className="px-4 py-3">Doanh thu</th>
                <th className="px-4 py-3">Lãi</th>
              </tr>
            </thead>
            <tbody>
              {monthRows.map(([month, v]) => (
                <tr key={month} className="border-t">
                  <td className="px-4 py-3">{month}</td>
                  <td className="px-4 py-3">{v.count}</td>
                  <td className="px-4 py-3">{formatVND(v.revenue)}</td>
                  <td className="px-4 py-3 text-green-600">{formatVND(v.profit)}</td>
                </tr>
              ))}
              {monthRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    Chưa có giao dịch bán hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-gray-800">Theo nguồn hàng (vendor)</h2>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Số lượng bán</th>
                <th className="px-4 py-3">Doanh thu</th>
                <th className="px-4 py-3">Lãi</th>
              </tr>
            </thead>
            <tbody>
              {vendorRows.map(([vendor, v]) => (
                <tr key={vendor} className="border-t">
                  <td className="px-4 py-3">{vendor}</td>
                  <td className="px-4 py-3">{v.count}</td>
                  <td className="px-4 py-3">{formatVND(v.revenue)}</td>
                  <td className="px-4 py-3 text-green-600">{formatVND(v.profit)}</td>
                </tr>
              ))}
              {vendorRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    Chưa có giao dịch bán hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
