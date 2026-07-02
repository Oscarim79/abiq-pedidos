"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  FileText,
  Plus,
  X,
} from "lucide-react";
import clsx from "clsx";
import type { Proyecto } from "@/lib/tipos";
import { useArchivos } from "@/lib/archivos-store";

const campos = [
  { id: "medidas", etiqueta: "Medidas (cm)" },
  { id: "madera", etiqueta: "Madera" },
  { id: "tela", etiqueta: "Tela / tapizado" },
  { id: "acabado", etiqueta: "Color / acabado" },
] as const;

export function CargaDirecta({ proyecto }: { proyecto: Proyecto }) {
  const { archivos, agregar, eliminar } = useArchivos(proyecto.id);
  const [arrastrando, setArrastrando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function abrirSelector() {
    inputRef.current?.click();
  }

  function onSeleccion(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) agregar(Array.from(e.target.files));
    // Limpiamos para poder volver a elegir el mismo archivo si hace falta.
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setArrastrando(false);
    if (e.dataTransfer.files) agregar(Array.from(e.dataTransfer.files));
  }

  return (
    <div className="space-y-5">
      {/* Selector de archivos oculto, compartido por la zona y el botón "+". */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={onSeleccion}
        className="hidden"
      />

      {/* Zona de subida: arrastra archivos aquí o haz clic para elegir. */}
      <button
        type="button"
        onClick={abrirSelector}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={onDrop}
        className={clsx(
          "w-full rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          arrastrando
            ? "border-marca bg-marca-suave"
            : "border-stone-300 hover:bg-stone-50",
        )}
      >
        <UploadCloud
          size={28}
          className={clsx(
            "mx-auto",
            arrastrando ? "text-marca" : "text-stone-400",
          )}
        />
        <p className="mt-2 text-sm text-stone-600">
          Arrastra fotos del cliente, planos o bocetos
        </p>
        <p className="text-xs text-stone-400">
          o haz clic para elegir · JPG · PNG · PDF
        </p>
      </button>

      {/* Galería de referencias cargadas */}
      <div className="grid grid-cols-4 gap-2">
        {archivos.map((a) => (
          <div
            key={a.id}
            className="group relative h-16 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
          >
            {a.tipo === "imagen" && a.miniatura ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.miniatura}
                alt={a.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center px-1 text-center text-stone-400">
                {a.tipo === "imagen" ? (
                  <ImageIcon size={18} />
                ) : (
                  <FileText size={18} />
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => eliminar(a.id)}
              aria-label={`Quitar ${a.nombre}`}
              title={a.nombre}
              className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-stone-900/60 text-white opacity-0 transition-opacity hover:bg-stone-900/80 group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={abrirSelector}
          aria-label="Añadir archivos"
          className="grid h-16 place-items-center rounded-lg border border-dashed border-stone-300 text-stone-400 transition-colors hover:bg-stone-50"
        >
          <Plus size={18} />
        </button>
      </div>

      {archivos.length === 0 && (
        <p className="-mt-2 text-xs text-stone-400">
          Aún no hay archivos. Arrastra fotos o usa el botón +.
        </p>
      )}

      {/* Especificaciones */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-stone-700">
          Especificaciones
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {campos.map((c) => (
            <label key={c.id} className="block">
              <span className="mb-1 block text-xs text-stone-500">
                {c.etiqueta}
              </span>
              <input
                type="text"
                defaultValue={proyecto[c.id]}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
              />
            </label>
          ))}
        </div>

        <label className="mt-3 block">
          <span className="mb-1 block text-xs text-stone-500">Notas</span>
          <textarea
            defaultValue={proyecto.notas}
            rows={3}
            className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
          />
        </label>
      </div>
    </div>
  );
}
