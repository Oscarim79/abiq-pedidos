"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import { navItems as items } from "./nav-items";
import { LogoEmpresa } from "@/components/LogoEmpresa";
import { cerrarSesion, useSesion } from "@/lib/sesion";

export function Sidebar() {
  const pathname = usePathname();
  const { sesion } = useSesion();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-stone-200 bg-white print:hidden">
      <div className="px-5 py-4 border-b border-stone-100">
        <LogoEmpresa variante="panel" />
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
        {sesion ? (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate" title={sesion.user.email}>
              {sesion.user.email}
            </span>
            <button
              type="button"
              onClick={() => cerrarSesion()}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="shrink-0 rounded p-1 text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-600"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          "Panel del vendedor"
        )}
      </div>
    </aside>
  );
}
