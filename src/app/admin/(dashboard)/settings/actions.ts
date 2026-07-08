"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateSettings(formData: FormData) {
  const facebookLink = String(formData.get("facebookLink") || "").trim();
  const priceRangesRaw = String(formData.get("priceRangesJson") || "[]");

  let priceRanges;
  try {
    priceRanges = JSON.parse(priceRangesRaw);
  } catch {
    priceRanges = [];
  }

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: { facebookLink, priceRanges },
    create: { id: "singleton", facebookLink, priceRanges },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
