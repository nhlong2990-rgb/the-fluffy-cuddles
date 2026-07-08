import Link from "next/link";
import LogoutButton from "./LogoutButton";

const navItems = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/inventory", label: "Nhập/Bán hàng" },
  { href: "/admin/settings", label: "Cài đặt" },
  { href: "/admin/import", label: "Import Excel" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-semibold text-brand-700">
            The Fluffy Cuddles — Admin
          </span>
          <LogoutButton />
        </div>
        <nav className="mx-auto flex max-w-6xl gap-6 px-6 pb-3 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-600 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
