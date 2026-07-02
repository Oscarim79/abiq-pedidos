"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import clsx from "clsx";
import {
  Image as ImageIcon,
  Ruler,
  Box,
  Send,
  ExternalLink,
  Rotate3d,
  X,
} from "lucide-react";
import type { Proyecto } from "@/lib/tipos";
import { CargaDirecta } from "@/components/captura/CargaDirecta";
import { WizardConsultivo } from "@/components/captura/WizardConsultivo";
import { useModelo3d } from "@/lib/modelo3d-store";

type Modo = "directa" | "wizard";

// El visor 3D se carga solo en el navegador (no en el servidor).
const VisorModelo = dynamic(() => import("@/components/visor/VisorModelo"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-stone-400">
      Cargando modelo 3D…
    </div>
  ),
});

export function CapturaTabs({ proyecto }: { proyecto: Proyecto }) {
  const [modo, setModo] = useState<Modo>("directa");
  const modelo = useModelo3d(proyecto.id);
  const inputModelo = useRef<HTMLInputElement>(null);

  function elegirModelo() {
    inputModelo.current?.click();
  }

  function onModeloSeleccionado(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) modelo.subir(file);
    e.target.value = "";
  }

  // Carga un .glb de muestra (una silla) servido desde /public, para probar.
  async function cargarEjemplo() {
    try {
      const res = await fetch("/silla-ejemplo.glb");
      if (!res.ok) return;
      const buf = await res.arrayBuffer();
      modelo.subir(
        new File([buf], "silla-ejemplo.glb", { type: "model/gltf-binary" }),
      );
    } catch {
      // sin conexión al archivo de ejemplo; no rompemos nada
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Columna principal: captura */}
        <div className="min-w-0 flex-1">
          {/* Selector segmentado entre las dos herramientas de captura */}
          <div className="mb-5 inline-flex rounded-full border border-stone-200 bg-stone-50 p-1">
            <button
              onClick={() => setModo("directa")}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                modo === "directa"
                  ? "bg-white font-medium text-stone-800 shadow-sm"
                  : "text-stone-500",
              )}
            >
              Carga directa
            </button>
            <button
              onClick={() => setModo("wizard")}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                modo === "wizard"
                  ? "bg-white font-medium text-stone-800 shadow-sm"
                  : "text-stone-500",
              )}
            >
              Wizard consultivo
            </button>
          </div>

          {modo === "directa" ? (
            <CargaDirecta proyecto={proyecto} />
          ) : (
            <WizardConsultivo />
          )}
        </div>

        {/* Columna derecha: resumen y acción principal */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="mb-3 text-sm font-medium text-stone-800">
              Resumen
            </div>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li className="flex items-center gap-2">
                <ImageIcon size={16} className="text-stone-400" />
                {proyecto.referencias} referencias
              </li>
              <li className="flex items-center gap-2">
                <Ruler size={16} className="text-stone-400" />
                {proyecto.medidas ? "Medidas completas" : "Medidas pendientes"}
              </li>
              <li className="flex items-center gap-2">
                <Box size={16} className="text-stone-400" />
                Modelo 3D: {modelo.tiene ? "cargado" : "pendiente"}
              </li>
            </ul>
            <div className="my-3 h-px bg-stone-100" />

            {/* Selector de archivo .glb oculto */}
            <input
              ref={inputModelo}
              type="file"
              accept=".glb,.gltf,model/gltf-binary"
              onChange={onModeloSeleccionado}
              className="hidden"
            />
            <button
              onClick={elegirModelo}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-marca px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-marca-oscuro"
            >
              <Send size={15} />
              {modelo.tiene ? "Reemplazar modelo 3D" : "Subir modelo 3D"}
            </button>

            {modelo.tiene ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                <span className="truncate" title={modelo.nombre ?? undefined}>
                  {modelo.nombre}
                </span>
                <button
                  onClick={modelo.quitar}
                  className="ml-auto inline-flex shrink-0 items-center gap-1 text-stone-400 hover:text-stone-600"
                >
                  <X size={12} /> Quitar
                </button>
              </div>
            ) : (
              <button
                onClick={cargarEjemplo}
                className="mt-2 w-full text-center text-xs text-marca hover:underline"
              >
                Ver modelo de ejemplo
              </button>
            )}

            <button className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50">
              Guardar borrador
            </button>
            <Link
              href="/revision/demo-sofa-123"
              target="_blank"
              className="mt-3 flex items-center justify-center gap-1.5 text-xs text-marca hover:underline"
            >
              <ExternalLink size={13} />
              Abrir vista del cliente (demo)
            </Link>
          </div>
        </aside>
      </div>

      {/* Vista previa del modelo 3D subido */}
      {modelo.url && (
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-sm font-medium text-stone-800">
              Vista previa 3D
            </div>
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <Rotate3d size={13} /> Arrastra para rotar · rueda para zoom
            </span>
          </div>
          <div className="relative h-80 overflow-hidden rounded-lg bg-[#f1efe9]">
            <VisorModelo url={modelo.url} />
          </div>
        </div>
      )}
    </div>
  );
}
