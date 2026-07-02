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
import type { ArchivoRef } from "@/lib/archivos-store";

// Zona para subir y ver las fotos/planos del cliente. No guarda nada por sí
// misma: recibe la lista y las acciones desde la página que la usa.
export function Fotos({
  archivos,
  agregar,
  eliminar,
}: {
  archivos: ArchivoRef[];
  agregar: (files: File[]) => void;
  eliminar: (id: string) => void;
}) {
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
    <div className="space-y-3">
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
          "w-full rounded-xl border-2 border-dashed px-6 py-6 text-center transition-colors",
          arrastrando
            ? "border-marca bg-marca-suave"
            : "border-stone-300 hover:bg-stone-50",
        )}
      >
        <UploadCloud
          size={26}
          className={clsx(
            "mx-auto",
            arrastrando ? "text-marca" : "text-stone-400",
          )}
        />
        <p className="mt-2 text-sm text-stone-600">
          Arrastra las fotos, planos o bocetos del cliente
        </p>
        <p className="text-xs text-stone-400">
          o haz clic para elegir · JPG · PNG · PDF
        </p>
      </button>

      {/* Galería de referencias cargadas */}
      {archivos.length > 0 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
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
      )}
    </div>
  );
}
