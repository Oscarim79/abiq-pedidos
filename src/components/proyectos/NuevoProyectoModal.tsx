"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { NuevoProyectoInput } from "@/lib/proyectos-store";

const TIENDAS = ["Tienda Norte", "Tienda Centro"];

export function NuevoProyectoModal({
  onCerrar,
  onCrear,
}: {
  onCerrar: () => void;
  onCrear: (datos: NuevoProyectoInput) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [tienda, setTienda] = useState(TIENDAS[0]);

  const valido = titulo.trim() !== "" && clienteNombre.trim() !== "";

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;
    onCrear({ titulo, clienteNombre, tienda });
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-stone-900/40 p-4"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-stone-800">Nuevo proyecto</h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Título del mueble
            </label>
            <input
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej.: Clóset de roble a medida"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition-colors focus:border-marca focus:ring-1 focus:ring-marca"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Cliente
            </label>
            <input
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              placeholder="Ej.: Familia Restrepo"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition-colors focus:border-marca focus:ring-1 focus:ring-marca"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Tienda
            </label>
            <select
              value={tienda}
              onChange={(e) => setTienda(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-marca focus:ring-1 focus:ring-marca"
            >
              {TIENDAS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!valido}
              className="rounded-lg bg-marca px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-marca-oscuro disabled:cursor-not-allowed disabled:opacity-50"
            >
              Crear proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
