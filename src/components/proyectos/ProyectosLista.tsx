"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import { estadoInfo } from "@/lib/estados";
import { useProyectos, type NuevoProyectoInput } from "@/lib/proyectos-store";
import { NuevoProyectoModal } from "@/components/proyectos/NuevoProyectoModal";

export function ProyectosLista() {
  const router = useRouter();
  const { proyectos, agregar } = useProyectos();
  const [modalAbierto, setModalAbierto] = useState(false);

  function crear(datos: NuevoProyectoInput) {
    const nuevo = agregar(datos);
    setModalAbierto(false);
    // Abrimos el proyecto recién creado para que se vea el resultado.
    router.push(`/proyectos/${nuevo.id}`);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-stone-800">Proyectos</h1>
          <p className="text-sm text-stone-500">
            Pedidos de muebles a la medida
          </p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 rounded-lg bg-marca px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-marca-oscuro"
        >
          <Plus size={16} />
          Nuevo proyecto
        </button>
      </div>

      <div className="mt-6 divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white">
        {proyectos.map((p) => {
          const info = estadoInfo[p.estado];
          return (
            <Link
              key={p.id}
              href={`/proyectos/${p.id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-stone-50"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-stone-800">
                  {p.titulo}
                </div>
                <div className="truncate text-sm text-stone-500">
                  {p.cliente.nombre} · {p.tienda}
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
      </div>

      {modalAbierto && (
        <NuevoProyectoModal
          onCerrar={() => setModalAbierto(false)}
          onCrear={crear}
        />
      )}
    </div>
  );
}
