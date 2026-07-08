import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

type SeedUnit = { vendor: string; costPrice: number; brandingCost: number };
type SeedProduct = {
  name: string;
  tag: string;
  size: string | null;
  sellPrice: number;
  image: string | null;
  units: SeedUnit[];
};
type SeedData = { vendors: string[]; products: SeedProduct[] };

let cachedSeed: SeedData | null = null;
function loadSeedData(): SeedData {
  if (cachedSeed) return cachedSeed;
  const filePath = path.join(process.cwd(), "prisma", "seed-data.json");
  cachedSeed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return cachedSeed!;
}

export async function POST(req: NextRequest) {
  const { offset = 0, limit = 20 } = await req.json().catch(() => ({}));
  const seed = loadSeedData();

  // ensure all vendors exist (cheap, idempotent)
  await prisma.vendor.createMany({
    data: seed.vendors.map((name) => ({ name })),
    skipDuplicates: true,
  });
  const vendorRows = await prisma.vendor.findMany({ select: { id: true, name: true } });
  const vendorIdByName = new Map(vendorRows.map((v) => [v.name, v.id]));

  const slice = seed.products.slice(offset, offset + limit);
  let created = 0;
  let skipped = 0;

  for (const p of slice) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name, tag: p.tag, size: p.size },
    });
    if (existing) {
      skipped++;
      continue;
    }

    let imageUrl: string | undefined;
    if (p.image) {
      const imgPath = path.join(process.cwd(), "prisma", "seed-images", p.image);
      if (fs.existsSync(imgPath)) {
        const bytes = fs.readFileSync(imgPath);
        const blob = await put(`products/${p.image}`, bytes, {
          access: "public",
          contentType: "image/jpeg",
        });
        imageUrl = blob.url;
      }
    }

    await prisma.product.create({
      data: {
        name: p.name,
        tag: p.tag,
        size: p.size,
        sellPrice: p.sellPrice,
        imageUrl,
        units: {
          create: p.units
            .filter((u) => vendorIdByName.has(u.vendor))
            .map((u) => ({
              vendorId: vendorIdByName.get(u.vendor)!,
              costPrice: u.costPrice,
              brandingCost: u.brandingCost,
              status: "IN_STOCK",
            })),
        },
      },
    });
    created++;
  }

  const nextOffset = offset + limit;
  const done = nextOffset >= seed.products.length;

  return NextResponse.json({
    processed: slice.length,
    created,
    skipped,
    nextOffset,
    total: seed.products.length,
    done,
  });
}
