"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LogOut, Menu, X } from "lucide-react";
import { navItems as items } from "./nav-items";
import { LogoEmpresa } from "@/components/LogoEmpresa";
import { cerrarSesion, useSesion } from "@/lib/sesion";

// Barra superior + menú desplegable para pantallas angostas (< md), donde la
// barra lateral se oculta. Sin esto, no habría forma de navegar entre secciones.
export function MobileNav() {
  const pathname = usePathname();
  const { sesion } = useSesion();
  const [abierto, setAbierto] = useState(false);

  // Cierra el menú al cambiar de ruta (después de pulsar un enlace).
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  return (
    <div className="md:hidden border-b border-stone-200 bg-white print:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <LogoEmpresa variante="movil" />
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          className="grid h-9 w-9 place-items-center rounded-lg text-stone-600 transition-colors hover:bg-stone-50"
        >
          {abierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {abierto && (
        <nav className="border-t border-stone-100 px-3 py-2 space-y-1">
          {items.map((item) => {
            const activo =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icono = item.icono;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
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
          {sesion && (
            <button
              type="button"
              onClick={() => cerrarSesion()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
