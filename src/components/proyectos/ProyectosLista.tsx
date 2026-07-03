"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Search } from "lucide-react";
import clsx from "clsx";
import { estadoInfo, ORDEN_ESTADOS } from "@/lib/estados";
import { useProyectos } from "@/lib/proyectos-store";
import type { EstadoProyecto } from "@/lib/tipos";

// Panel principal del vendedor: todos los proyectos, con buscador y filtros.
export function ProyectosLista() {
  const { proyectos, cargado } = useProyectos();
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<EstadoProyecto | "todos">("todos");

  const texto = busqueda.trim().toLowerCase();
  const filtrados = proyectos.filter((p) => {
    const coincideTexto =
      texto === "" ||
      p.titulo.toLowerCase().includes(texto) ||
      p.cliente.nombre.toLowerCase().includes(texto);
    const coincideEstado = filtro === "todos" || p.estado === filtro;
    return coincideTexto && coincideEstado;
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-stone-800">Proyectos</h1>
          <p className="text-sm text-stone-500">
            Pedidos de muebles a la medida
          </p>
        </div>
        <Link
          href="/proyectos/nuevo"
          className="flex items-center gap-2 rounded-lg bg-marca px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-marca-oscuro"
        >
          <Plus size={16} />
          Nuevo proyecto
        </Link>
      </div>

      {/* Buscador */}
      <div className="relative mt-5">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
        />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por mueble o cliente…"
          className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
        />
      </div>

      {/* Filtros por estado */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltro("todos")}
          className={clsx(
            "rounded-full border px-3 py-1 text-xs transition-colors",
            filtro === "todos"
              ? "border-marca bg-marca-suave font-medium text-marca-oscuro"
              : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
          )}
        >
          Todos ({proyectos.length})
        </button>
        {ORDEN_ESTADOS.map((estado) => {
          const cantidad = proyectos.filter((p) => p.estado === estado).length;
          if (cantidad === 0) return null;
          return (
            <button
              key={estado}
              type="button"
              onClick={() => setFiltro(filtro === estado ? "todos" : estado)}
              className={clsx(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                filtro === estado
                  ? "border-marca bg-marca-suave font-medium text-marca-oscuro"
                  : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
              )}
            >
              {estadoInfo[estado].etiqueta} ({cantidad})
            </button>
          );
        })}
      </div>

      {/* Lista */}
      <div className="mt-4 divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white">
        {filtrados.map((p) => {
          const info = estadoInfo[p.estado];
          return (
            <Link
              key={p.id}
              href={`/proyectos/detalle?id=${p.id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-stone-50"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-stone-800">
                  {p.titulo}
                </div>
                <div className="truncate text-sm text-stone-500">
                  {p.cliente.nombre} · {p.tienda} · {p.creadoEn}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${info.clases}`}
              >
                {info.etiqueta}
              </span>
              <ChevronRight size={18} className="shrink-0 text-stone-400" />
            </Link>
          );
        })}

        {filtrados.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-stone-500">
            {!cargado
              ? "Cargando…"
              : proyectos.length === 0
                ? "Aún no hay proyectos. Crea el primero con el botón verde."
                : "Ningún proyecto coincide con la búsqueda o el filtro."}
          </div>
        )}
      </div>
    </div>
  );
}
