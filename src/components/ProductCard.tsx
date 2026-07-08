type Props = {
  name: string;
  tag: string;
  size: string | null;
  sellPrice: number;
  imageUrl: string | null;
  facebookLink: string;
};

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function ProductCard({ name, tag, size, sellPrice, imageUrl, facebookLink }: Props) {
  return (
    <a
      href={facebookLink || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            Chưa có ảnh
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium text-gray-800">{name}</p>
        <p className="mt-1 text-xs text-gray-500">
          {tag}
          {size ? ` · ${size}` : ""}
        </p>
        <p className="mt-1 font-semibold text-brand-600">{formatVND(sellPrice)}</p>
      </div>
    </a>
  );
}
