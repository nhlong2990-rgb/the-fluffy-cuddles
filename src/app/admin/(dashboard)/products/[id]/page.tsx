import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import { updateProduct } from "../actions";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, tags, sizes] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.product.findMany({ distinct: ["tag"], select: { tag: true }, orderBy: { tag: "asc" } }),
    prisma.product.findMany({
      distinct: ["size"],
      select: { size: true },
      where: { size: { not: null } },
      orderBy: { size: "asc" },
    }),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Sửa sản phẩm</h1>
      <ProductForm
        action={updateWithId}
        product={product}
        tagOptions={tags.map((t) => t.tag)}
        sizeOptions={sizes.map((s) => s.size as string)}
      />
    </div>
  );
}
