"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Package } from "lucide-react";
import { navItems as items } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-stone-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-stone-100">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-marca text-white">
          <Package size={18} />
        </div>
        <span className="font-medium text-stone-800">AbiQ</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const activo =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icono = item.icono;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                activo
                  ? "bg-marca-suave text-marca-oscuro font-medium"
                  : "text-stone-600 hover:bg-stone-50",
              )}
            >
              <Icono size={18} />
              {item.etiqueta}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-100 px-5 py-3 text-xs text-stone-400">
        Jefe de Tienda · Tienda Norte
      </div>
    </aside>
  );
}
