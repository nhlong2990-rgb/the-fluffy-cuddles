import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Fluffy Cuddles — Gấu bông Jellycat",
  description: "Cửa hàng gấu bông Jellycat chính hãng",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
