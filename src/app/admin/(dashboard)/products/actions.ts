"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function uploadImageIfProvided(formData: FormData): Promise<string | undefined> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const blob = await put(`products/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return blob.url;
  }
  return undefined;
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const tag = String(formData.get("tag") || "").trim();
  const size = String(formData.get("size") || "").trim();
  const sellPrice = Number(formData.get("sellPrice") || 0);
  return { name, tag, size: size || null, sellPrice };
}

export async function createProduct(formData: FormData) {
  const fields = readProductFields(formData);
  const imageUrl = await uploadImageIfProvided(formData);

  await prisma.product.create({
    data: { ...fields, imageUrl },
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const fields = readProductFields(formData);
  const imageUrl = await uploadImageIfProvided(formData);

  await prisma.product.update({
    where: { id: productId },
    data: { ...fields, ...(imageUrl ? { imageUrl } : {}) },
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/");
  revalidatePath("/admin/products");
}
