"use client";

import { useState } from "react";
import clsx from "clsx";
import { Package } from "lucide-react";

// ============================================================================
//  LOGO DE LA EMPRESA
// ----------------------------------------------------------------------------
//  Muestra el logo real si existe el archivo public/logo.png. Mientras no
//  exista (o mientras carga), muestra la marca provisional de siempre: el
//  cuadrito café con el paquete y el nombre "AbiQ". Para estrenar el logo
//  basta con copiar el archivo a public/logo.png y publicar — sin tocar código.
// ============================================================================

const RUTA_LOGO = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo.png`;

// Cada lugar de la app usa un tamaño distinto (los mismos que ya tenía).
const variantes = {
  movil: {
    caja: "h-7 w-7 rounded-lg",
    icono: 16,
    texto: "font-medium text-stone-800",
    logo: "h-7",
  },
  panel: {
    caja: "h-8 w-8 rounded-lg",
    icono: 18,
    texto: "font-medium text-stone-800",
    logo: "h-8",
  },
  ficha: {
    caja: "h-9 w-9 rounded-lg",
    icono: 20,
    texto: "font-semibold text-stone-800",
    logo: "h-9",
  },
  portada: {
    caja: "h-10 w-10 rounded-xl",
    icono: 22,
    texto: "text-lg font-medium text-stone-800",
    logo: "h-10",
  },
} as const;

type Props = {
  variante: keyof typeof variantes;
  /** Texto pequeño bajo el nombre (solo lo usa la ficha imprimible). */
  subtitulo?: string;
};

export function LogoEmpresa({ variante, subtitulo }: Props) {
  const v = variantes[variante];
  // "cargando": aún no sabemos si hay logo; "ok": sí hay; "falta": no hay.
  const [estado, setEstado] = useState<"cargando" | "ok" | "falta">("cargando");

  return (
    <div className="flex items-center gap-2">
      {estado !== "ok" && (
        <>
          <div
            className={clsx(
              "grid place-items-center bg-marca text-white",
              v.caja,
            )}
          >
            <Package size={v.icono} />
          </div>
          <div>
            <div className={v.texto}>AbiQ</div>
            {subtitulo && (
              <div className="text-xs text-stone-500">{subtitulo}</div>
            )}
          </div>
        </>
      )}
      {estado !== "falta" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={RUTA_LOGO}
          alt="AbiQ"
          className={clsx("w-auto", v.logo, estado !== "ok" && "hidden")}
          onLoad={() => setEstado("ok")}
          onError={() => setEstado("falta")}
        />
      )}
    </div>
  );
}
