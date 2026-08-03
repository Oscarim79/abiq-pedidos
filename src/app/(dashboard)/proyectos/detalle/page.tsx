"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ClipboardList,
  MessageCircle,
  Pencil,
  Printer,
  Trash2,
  X,
} from "lucide-react";
import clsx from "clsx";
import { estadoInfo, ORDEN_ESTADOS } from "@/lib/estados";
import {
  eliminarProyecto,
  useProyecto,
} from "@/lib/proyectos-store";
import { useArchivos } from "@/lib/archivos-store";
import { useAjustes } from "@/lib/ajustes-store";
import { construirMensaje, enlaceWhatsApp } from "@/lib/whatsapp";
import { listaEspecificaciones } from "@/lib/especificaciones";
import { formatearQ, lineasDeOrden, totalDeOrden } from "@/lib/orden";
import { Fotos } from "@/components/proyectos/Fotos";
import { FirmaPad } from "@/components/proyectos/FirmaPad";

function Tarjeta({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="mb-3 font-medium text-stone-800">{titulo}</h2>
      {children}
    </section>
  );
}

// El proyecto se identifica con "?id=..." en la dirección (y no con una ruta
// tipo /proyectos/abc) porque GitHub Pages solo sirve páginas fijas. Next.js
// pide envolver en Suspense a los componentes que leen la dirección.
export default function ProyectoPage() {
  return (
    <Suspense>
      <DetalleProyecto />
    </Suspense>
  );
}

function DetalleProyecto() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const { proyecto, cargado, actualizar, cambiarEstado } = useProyecto(id);
  const { archivos, agregar, eliminar } = useArchivos(id);
  const { ajustes } = useAjustes();

  if (!proyecto) {
    return (
      <div className="mx-auto max-w-5xl">
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

  const info = estadoInfo[proyecto.estado];

  function enviarWhatsApp() {
    if (!proyecto) return;
    const mensaje = construirMensaje(
      proyecto,
      ajustes.vendedorNombre,
      archivos.length,
    );
    window.open(
      enlaceWhatsApp(ajustes.logisticaNumero, mensaje),
      "_blank",
      "noopener",
    );
    // El primer envío marca el proyecto como "Enviado a logística".
    if (proyecto.estado === "nuevo") cambiarEstado("enviado_logistica");
  }

  function borrarProyecto() {
    if (
      !window.confirm(
        "¿Eliminar este proyecto? Esta acción no se puede deshacer.",
      )
    )
      return;
    eliminarProyecto(id);
    router.push("/proyectos");
  }

  // Especificaciones a mostrar (solo las que aportan algo).
  const especificaciones = listaEspecificaciones(proyecto);

  // Las líneas de la orden de fabricación (mueble principal + artículos).
  const lineas = lineasDeOrden(proyecto);
  const total = totalDeOrden(lineas);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/proyectos"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
      >
        <ChevronLeft size={16} />
        Proyectos
      </Link>

      {/* Encabezado */}
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-stone-800">
            {proyecto.titulo}
          </h1>
          <p className="text-sm text-stone-500">
            {proyecto.cliente.nombre}
            {proyecto.cliente.telefono && ` · ${proyecto.cliente.telefono}`} ·{" "}
            {proyecto.tienda}
            {proyecto.vendedor && ` · Vendedor: ${proyecto.vendedor}`} · creado
            el {proyecto.creadoEn}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${info.clases}`}
        >
          {info.etiqueta}
        </span>
      </div>

      {/* Acciones principales */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={enviarWhatsApp}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          <MessageCircle size={16} />
          Enviar a logística por WhatsApp
        </button>
        <Link
          href={`/proyectos/orden?id=${proyecto.id}`}
          className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-50"
        >
          <ClipboardList size={16} />
          Orden de fabricación
        </Link>
        <Link
          href={`/proyectos/ficha?id=${proyecto.id}`}
          className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-50"
        >
          <Printer size={16} />
          Ficha para imprimir
        </Link>
        <Link
          href={`/proyectos/editar?id=${proyecto.id}`}
          className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-50"
        >
          <Pencil size={16} />
          Editar
        </Link>
        <button
          type="button"
          onClick={borrarProyecto}
          className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
        >
          <Trash2 size={15} />
          Eliminar
        </button>
      </div>
      <p className="mt-2 text-xs text-stone-400">
        Lo que logística recibe es la <b>orden de fabricación en PDF</b>: se
        guarda con “Orden de fabricación” → “Imprimir / Guardar PDF” y se
        adjunta en el chat que abre el botón verde (junto con las fotos).
      </p>
      {ajustes.logisticaNumero === "" && (
        <p className="mt-1 text-xs text-stone-400">
          Consejo: guarda el número de logística en{" "}
          <Link href="/ajustes" className="underline">
            Ajustes
          </Link>{" "}
          para que el chat se abra directo con ese contacto.
        </p>
      )}

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          {/* Estado */}
          <Tarjeta titulo="Estado del pedido">
            <div className="flex flex-wrap gap-2">
              {ORDEN_ESTADOS.map((estado) => {
                const activo = proyecto.estado === estado;
                return (
                  <button
                    key={estado}
                    type="button"
                    onClick={() => cambiarEstado(estado)}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      activo
                        ? `border-transparent font-medium ${estadoInfo[estado].clases}`
                        : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                    )}
                  >
                    {estadoInfo[estado].etiqueta}
                  </button>
                );
              })}
            </div>
            {proyecto.enviadoEn && (
              <p className="mt-3 text-xs text-stone-400">
                Enviado a logística el {proyecto.enviadoEn}.
              </p>
            )}
          </Tarjeta>

          {/* Especificaciones */}
          <Tarjeta titulo="Especificaciones">
            {especificaciones.length > 0 ? (
              <dl className="divide-y divide-stone-100">
                {especificaciones.map(([etiqueta, valor]) => (
                  <div key={etiqueta} className="flex gap-4 py-2 text-sm">
                    <dt className="w-32 shrink-0 text-stone-500">{etiqueta}</dt>
                    <dd className="text-stone-800">{valor}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-stone-400">
                Aún no hay especificaciones. Usa “Editar” para completarlas.
              </p>
            )}
            {proyecto.caracteristicas.trim() !== "" && (
              <div className="mt-3 border-t border-stone-100 pt-3">
                <h3 className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  Características especiales
                </h3>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-stone-700">
                  {proyecto.caracteristicas}
                </p>
              </div>
            )}
            {proyecto.notas.trim() !== "" && (
              <div className="mt-3 border-t border-stone-100 pt-3">
                <h3 className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  Notas
                </h3>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-stone-700">
                  {proyecto.notas}
                </p>
              </div>
            )}
          </Tarjeta>

          {/* Resumen de la orden de fabricación */}
          <Tarjeta titulo="Orden de fabricación">
            <p className="text-sm text-stone-600">
              El número de orden (OC) <b>lo asigna logística</b>: el documento
              sale con esa línea en blanco para que ellos escriban su
              correlativo.
            </p>
            <ul className="mt-2 divide-y divide-stone-100">
              {lineas.map((linea, i) => (
                <li
                  key={i}
                  className="flex items-baseline justify-between gap-4 py-2 text-sm"
                >
                  <span className="text-stone-700">
                    {linea.codigo && (
                      <span className="text-stone-400">[{linea.codigo}] </span>
                    )}
                    {linea.descripcion || "Artículo"} × {linea.cantidad}
                  </span>
                  <span className="shrink-0 font-medium text-stone-800">
                    {linea.subtotal !== null
                      ? formatearQ(linea.subtotal)
                      : "sin costo"}
                  </span>
                </li>
              ))}
            </ul>
            {total !== null && (
              <p className="mt-1 border-t border-stone-200 pt-2 text-right text-sm font-semibold text-stone-800">
                Total: {formatearQ(total)}
              </p>
            )}
            <p className="mt-2 text-xs text-stone-400">
              El código, la cantidad y el costo se capturan con “Editar”. El
              documento para la fábrica sale con el botón “Orden de
              fabricación” de arriba.
            </p>
          </Tarjeta>
        </div>

        <div className="space-y-5">
          {/* Fotos */}
          <Tarjeta titulo="Fotos y referencias">
            <Fotos archivos={archivos} agregar={agregar} eliminar={eliminar} />
          </Tarjeta>

          {/* Visto bueno */}
          <Tarjeta titulo="Visto bueno (firma)">
            {proyecto.firma ? (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proyecto.firma}
                  alt="Firma de visto bueno"
                  className="h-28 w-full rounded-lg border border-stone-200 bg-white object-contain"
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-stone-600">
                    Firmado por{" "}
                    <span className="font-medium">
                      {proyecto.firmadoPor || "—"}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("¿Quitar la firma guardada?"))
                        actualizar({ firma: undefined, firmadoPor: undefined });
                    }}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500"
                  >
                    <X size={13} />
                    Quitar firma
                  </button>
                </div>
              </div>
            ) : (
              <FirmaPad
                onGuardar={(firma, firmadoPor) =>
                  actualizar({ firma, firmadoPor })
                }
              />
            )}
          </Tarjeta>
        </div>
      </div>
    </div>
  );
}
