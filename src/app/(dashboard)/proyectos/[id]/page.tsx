"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { estadoInfo } from "@/lib/estados";
import { CapturaTabs } from "@/components/captura/CapturaTabs";
import { obtenerProyecto } from "@/lib/mock-data";
import { obtenerProyectoLocal } from "@/lib/proyectos-store";
import type { Proyecto } from "@/lib/tipos";

export default function ProyectoPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  // Arranca con el proyecto de ejemplo si lo hay (render estable en servidor y
  // cliente); si es uno que tú creaste, se carga del navegador al montar.
  const [proyecto, setProyecto] = useState<Proyecto | undefined>(() =>
    obtenerProyecto(id),
  );
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setProyecto(obtenerProyectoLocal(id));
    setCargado(true);
  }, [id]);

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

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/proyectos"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
      >
        <ChevronLeft size={16} />
        Proyectos
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-stone-800">
            {proyecto.titulo}
          </h1>
          <p className="text-sm text-stone-500">
            {proyecto.cliente.nombre} · {proyecto.tienda}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${info.clases}`}
        >
          {info.etiqueta}
        </span>
      </div>

      <div className="mt-6">
        <CapturaTabs proyecto={proyecto} />
      </div>
    </div>
  );
}
