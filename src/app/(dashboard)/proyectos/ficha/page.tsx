"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Printer } from "lucide-react";
import { LogoEmpresa } from "@/components/LogoEmpresa";
import { estadoInfo } from "@/lib/estados";
import { useProyecto } from "@/lib/proyectos-store";
import { useArchivos } from "@/lib/archivos-store";
import { useAjustes } from "@/lib/ajustes-store";
import { listaEspecificaciones } from "@/lib/especificaciones";

// ============================================================================
//  FICHA DE PEDIDO — UNA SOLA HOJA
// ----------------------------------------------------------------------------
//  El documento final para la fábrica: todas las especificaciones y las fotos
//  en una sola página. El botón "Imprimir" también sirve para guardar como
//  PDF (en el diálogo de impresión elige "Guardar como PDF").
// ============================================================================

// El proyecto llega como "?id=..." en la dirección (ver detalle/page.tsx).
export default function FichaPage() {
  return (
    <Suspense>
      <Ficha />
    </Suspense>
  );
}

function Ficha() {
  const id = useSearchParams().get("id") ?? "";
  const { proyecto, cargado } = useProyecto(id);
  const { archivos } = useArchivos(id);
  const { ajustes } = useAjustes();

  if (!proyecto) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
        >
          <ChevronLeft size={16} />
          Proyectos
        </Link>
        <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-sm text-stone-500">
          {cargado ? "Este proyecto no existe." : "Cargando…"}
        </div>
      </div>
    );
  }

  // En la hoja solo caben las primeras 6 imágenes.
  const imagenes = archivos.filter((a) => a.tipo === "imagen").slice(0, 6);

  const especificaciones = listaEspecificaciones(proyecto);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Barra superior — no sale en la impresión */}
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link
          href={`/proyectos/detalle?id=${proyecto.id}`}
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
        >
          <ChevronLeft size={16} />
          {proyecto.titulo}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-marca px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-marca-oscuro"
        >
          <Printer size={16} />
          Imprimir / Guardar PDF
        </button>
      </div>

      {/* ——— LA HOJA ——— */}
      <div className="rounded-xl border border-stone-200 bg-white p-8 print:rounded-none print:border-0 print:p-0">
        {/* Encabezado */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <LogoEmpresa variante="ficha" subtitulo="Muebles a la medida" />
          <div className="text-right">
            <div className="text-sm font-semibold uppercase tracking-wide text-stone-800">
              Ficha de pedido
            </div>
            <div className="text-xs text-stone-500">
              {proyecto.tienda} · {proyecto.creadoEn}
            </div>
            <div className="text-xs text-stone-500">
              Estado: {estadoInfo[proyecto.estado].etiqueta}
            </div>
          </div>
        </div>

        {/* Título y cliente */}
        <div className="mt-4">
          <h1 className="text-lg font-semibold text-stone-900">
            {proyecto.titulo}
          </h1>
          <p className="text-sm text-stone-600">
            Cliente: {proyecto.cliente.nombre}
            {proyecto.cliente.telefono && ` · Tel. ${proyecto.cliente.telefono}`}
            {ajustes.vendedorNombre && ` · Vendedor: ${ajustes.vendedorNombre}`}
          </p>
        </div>

        {/* Especificaciones + fotos, lado a lado para que quepa todo */}
        <div className="mt-4 grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Especificaciones
            </h2>
            <dl className="mt-1 divide-y divide-stone-100">
              {especificaciones.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="flex gap-3 py-1.5 text-sm">
                  <dt className="w-28 shrink-0 text-stone-500">{etiqueta}</dt>
                  <dd className="font-medium text-stone-800">{valor}</dd>
                </div>
              ))}
              {especificaciones.length === 0 && (
                <p className="py-1.5 text-sm text-stone-400">
                  Sin especificaciones capturadas.
                </p>
              )}
            </dl>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Referencias visuales
            </h2>
            {imagenes.length > 0 ? (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {imagenes.map((img) =>
                  img.miniatura ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={img.id}
                      src={img.miniatura}
                      alt={img.nombre}
                      className="h-24 w-full rounded-md border border-stone-200 object-cover"
                    />
                  ) : (
                    <div
                      key={img.id}
                      className="grid h-24 w-full place-items-center overflow-hidden rounded-md border border-stone-200 px-1 text-center text-[10px] text-stone-400"
                    >
                      {img.nombre}
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-400">
                Sin fotos de referencia.
              </p>
            )}
          </div>
        </div>

        {/* Características y notas */}
        {proyecto.caracteristicas.trim() !== "" && (
          <div className="mt-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Características especiales
            </h2>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-stone-800">
              {proyecto.caracteristicas}
            </p>
          </div>
        )}
        {proyecto.notas.trim() !== "" && (
          <div className="mt-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Notas
            </h2>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-stone-800">
              {proyecto.notas}
            </p>
          </div>
        )}

        {/* Firma */}
        <div className="mt-6 flex items-end justify-between border-t border-stone-200 pt-4">
          <p className="text-xs text-stone-400">
            Generado con AbiQ · {proyecto.creadoEn}
            {proyecto.enviadoEn &&
              ` · Enviado a logística el ${proyecto.enviadoEn}`}
          </p>
          <div className="text-center">
            {proyecto.firma ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={proyecto.firma}
                alt="Firma de visto bueno"
                className="mx-auto h-16 object-contain"
              />
            ) : (
              <div className="h-16 w-48" />
            )}
            <div className="border-t border-stone-400 px-6 pt-1 text-xs text-stone-600">
              Visto bueno{proyecto.firmadoPor ? ` · ${proyecto.firmadoPor}` : ""}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-stone-400 print:hidden">
        Consejo: en el diálogo de impresión elige “Guardar como PDF” para
        adjuntar la ficha en el chat de WhatsApp.
      </p>
    </div>
  );
}
