"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function findOrCreateVendor(name: string) {
  const trimmed = name.trim();
  const existing = await prisma.vendor.findUnique({ where: { name: trimmed } });
  if (existing) return existing;
  return prisma.vendor.create({ data: { name: trimmed } });
}

export async function addInventoryUnit(formData: FormData) {
  const productId = String(formData.get("productId") || "");
  const vendorName = String(formData.get("vendorName") || "").trim();
  const costPrice = Number(formData.get("costPrice") || 0);
  const brandingCost = Number(formData.get("brandingCost") || 0);
  const purchaseDateRaw = String(formData.get("purchaseDate") || "");

  if (!productId || !vendorName) return;

  const vendor = await findOrCreateVendor(vendorName);

  await prisma.inventoryUnit.create({
    data: {
      productId,
      vendorId: vendor.id,
      costPrice,
      brandingCost,
      purchaseDate: purchaseDateRaw ? new Date(purchaseDateRaw) : new Date(),
      status: "IN_STOCK",
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
}

export async function markUnitSold(unitId: string, formData: FormData) {
  const soldPrice = Number(formData.get("soldPrice") || 0);
  const soldDateRaw = String(formData.get("soldDate") || "");

  await prisma.inventoryUnit.update({
    where: { id: unitId },
    data: {
      status: "SOLD",
      soldPrice,
      soldDate: soldDateRaw ? new Date(soldDateRaw) : new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
}

export async function revertUnitToStock(unitId: string) {
  await prisma.inventoryUnit.update({
    where: { id: unitId },
    data: { status: "IN_STOCK", soldPrice: null, soldDate: null },
  });
  revalidatePath("/");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
}
