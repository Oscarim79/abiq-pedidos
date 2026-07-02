import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AbiQ — Gestión de pedidos",
  description: "Plataforma interna para muebles a la medida.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
