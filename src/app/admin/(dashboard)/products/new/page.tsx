import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const [tags, sizes] = await Promise.all([
    prisma.product.findMany({ distinct: ["tag"], select: { tag: true }, orderBy: { tag: "asc" } }),
    prisma.product.findMany({
      distinct: ["size"],
      select: { size: true },
      where: { size: { not: null } },
      orderBy: { size: "asc" },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Thêm sản phẩm</h1>
      <ProductForm
        action={createProduct}
        tagOptions={tags.map((t) => t.tag)}
        sizeOptions={sizes.map((s) => s.size as string)}
      />
    </div>
  );
}
