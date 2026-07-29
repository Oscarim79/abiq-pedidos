"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Printer } from "lucide-react";
import { LogoEmpresa } from "@/components/LogoEmpresa";
import { siguienteFolio, useProyecto } from "@/lib/proyectos-store";
import { useArchivos } from "@/lib/archivos-store";
import { useAjustes } from "@/lib/ajustes-store";
import {
  CLAUSULA_CONFORMIDAD,
  folioTexto,
  formatearQ,
  lineasDeOrden,
  totalDeOrden,
} from "@/lib/orden";

// ============================================================================
//  ORDEN DE FABRICACIÓN — UNA SOLA HOJA
// ----------------------------------------------------------------------------
//  El documento que recibe la fábrica, con el mismo contenido que las órdenes
//  en papel: número de orden, datos generales, tabla de artículos con costos
//  y observaciones, cláusula de conformidad y firma del cliente. Se llena
//  solo con lo capturado en el pedido. "Imprimir" también guarda como PDF.
// ============================================================================

export default function OrdenPage() {
  return (
    <Suspense>
      <Orden />
    </Suspense>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
        {etiqueta}
      </div>
      <div className="text-sm font-medium text-stone-800">{valor || "—"}</div>
    </div>
  );
}

function Orden() {
  const id = useSearchParams().get("id") ?? "";
  const { proyecto, cargado, actualizar } = useProyecto(id);
  const { archivos } = useArchivos(id);
  const { ajustes } = useAjustes();

  // Los pedidos guardados antes de esta mejora no tienen número de orden:
  // se les asigna el siguiente disponible la primera vez que se abre esta
  // hoja, y queda guardado.
  useEffect(() => {
    if (proyecto && !proyecto.folio) actualizar({ folio: siguienteFolio() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyecto?.id, proyecto?.folio]);

  if (!proyecto) {
    return (
      <div className="mx-auto max-w-4xl">
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

  const lineas = lineasDeOrden(proyecto);
  const total = totalDeOrden(lineas);
  // En la columna FOTO caben las primeras 2 imágenes de referencia.
  const imagenes = archivos.filter((a) => a.tipo === "imagen").slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl">
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
        <div className="flex items-start justify-between border-b-2 border-stone-800 pb-3">
          <LogoEmpresa variante="ficha" subtitulo="Muebles a la medida" />
          <div className="text-right">
            <div className="text-sm font-bold uppercase tracking-wide text-stone-900">
              Orden de fabricación
            </div>
            <div className="text-xl font-bold text-stone-900">
              {folioTexto(proyecto.folio)}
            </div>
          </div>
        </div>

        {/* Datos generales */}
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          <Dato etiqueta="Fecha" valor={proyecto.creadoEn} />
          <Dato etiqueta="Tienda" valor={proyecto.tienda} />
          <Dato etiqueta="Cliente" valor={proyecto.cliente.nombre} />
          <Dato etiqueta="Asesor" valor={ajustes.vendedorNombre} />
        </div>

        {/* Aviso importante (las notas del pedido) */}
        {proyecto.notas.trim() !== "" && (
          <div className="mt-3 rounded-md border border-amber-600 bg-amber-50 px-3 py-2 text-xs font-semibold uppercase leading-snug text-amber-900 print:bg-white">
            Importante: {proyecto.notas}
          </div>
        )}

        {/* Tabla de artículos */}
        <table className="mt-4 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-stone-800 text-left text-[10px] uppercase tracking-wide text-stone-500">
              <th className="py-1.5 pr-2 font-semibold">Código</th>
              <th className="py-1.5 pr-2 font-semibold">Descripción</th>
              <th className="py-1.5 pr-2 text-center font-semibold">Cant.</th>
              <th className="py-1.5 pr-2 text-right font-semibold">Costo</th>
              <th className="py-1.5 pr-2 text-right font-semibold">Subtotal</th>
              <th className="w-2/5 py-1.5 pr-2 font-semibold">
                Tapiz / Observaciones
              </th>
              <th className="py-1.5 font-semibold">Foto</th>
            </tr>
          </thead>
          <tbody className="align-top">
            {lineas.map((linea, i) => (
              <tr key={i} className="border-b border-stone-200 text-xs">
                <td className="py-2 pr-2 font-medium text-stone-800">
                  {linea.codigo || "—"}
                </td>
                <td className="py-2 pr-2 text-stone-800">
                  {linea.descripcion || "—"}
                </td>
                <td className="py-2 pr-2 text-center text-stone-800">
                  {linea.cantidad}
                </td>
                <td className="py-2 pr-2 text-right text-stone-800">
                  {linea.costo !== null ? formatearQ(linea.costo) : "—"}
                </td>
                <td className="py-2 pr-2 text-right font-medium text-stone-800">
                  {linea.subtotal !== null ? formatearQ(linea.subtotal) : "—"}
                </td>
                <td className="whitespace-pre-wrap break-words py-2 pr-2 text-[11px] leading-snug text-stone-700">
                  {linea.observaciones || "—"}
                </td>
                <td className="py-2">
                  {i === 0 &&
                    imagenes.map((img) =>
                      img.miniatura ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={img.id}
                          src={img.miniatura}
                          alt={img.nombre}
                          className="mb-1 h-16 w-16 rounded border border-stone-200 object-cover"
                        />
                      ) : null,
                    )}
                </td>
              </tr>
            ))}
          </tbody>
          {total !== null && (
            <tfoot>
              <tr>
                <td
                  colSpan={4}
                  className="py-2 pr-2 text-right text-sm font-semibold text-stone-800"
                >
                  Total
                </td>
                <td className="py-2 pr-2 text-right text-sm font-bold text-stone-900">
                  {formatearQ(total)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>

        {/* Cláusula de conformidad */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-stone-800">
            Cláusula de conformidad
          </h2>
          <p className="mt-1 text-justify text-[10px] leading-snug text-stone-600">
            {CLAUSULA_CONFORMIDAD}
          </p>
        </div>

        {/* Nombre y firma del cliente */}
        <div className="mt-8 grid grid-cols-2 gap-10">
          <div className="text-center">
            <div className="flex h-16 items-end justify-center pb-1 text-sm font-medium text-stone-800">
              {proyecto.cliente.nombre}
            </div>
            <div className="border-t border-stone-400 pt-1 text-xs text-stone-500">
              Nombre del cliente
            </div>
          </div>
          <div className="text-center">
            {proyecto.firma ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={proyecto.firma}
                alt="Firma del cliente"
                className="mx-auto h-16 object-contain"
              />
            ) : (
              <div className="h-16" />
            )}
            <div className="border-t border-stone-400 pt-1 text-xs text-stone-500">
              Firma del cliente
            </div>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-stone-400">
          Generado con AbiQ · {proyecto.creadoEn}
          {proyecto.enviadoEn &&
            ` · Enviado a logística el ${proyecto.enviadoEn}`}
        </p>
      </div>

      <p className="mt-3 text-center text-xs text-stone-400 print:hidden">
        Si falta la firma, el cliente firma en la pantalla del pedido (tarjeta
        “Visto bueno”) y aquí aparece sola. En el diálogo de impresión elige
        “Guardar como PDF” para mandar la orden por WhatsApp.
      </p>
    </div>
  );
}
