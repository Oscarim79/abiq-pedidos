"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { Lock, Send, Rotate3d, Check, Package } from "lucide-react";
import type { EnlaceRevision, ComentarioCliente } from "@/lib/mock-enlaces";

// El visor 3D se carga solo en el navegador (no en el servidor).
const Visor3D = dynamic(() => import("./Visor3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-stone-400">
      Cargando modelo 3D…
    </div>
  ),
});

const TELAS = [
  { valor: "#6b7a52", nombre: "Verde oliva" },
  { valor: "#36546b", nombre: "Azul petróleo" },
  { valor: "#a8553a", nombre: "Terracota" },
  { valor: "#8a8780", nombre: "Gris piedra" },
  { valor: "#c39a3e", nombre: "Mostaza" },
];

export function VisorCliente({ enlace }: { enlace: EnlaceRevision }) {
  const [color, setColor] = useState(enlace.colorInicial);
  const [comentarios, setComentarios] = useState<ComentarioCliente[]>(
    enlace.comentarios,
  );
  const [texto, setTexto] = useState("");
  const [aprobado, setAprobado] = useState(false);
  const cajaComentario = useRef<HTMLTextAreaElement>(null);

  function enviarComentario() {
    const limpio = texto.trim();
    if (!limpio) return;
    setComentarios((prev) => [
      ...prev,
      {
        id: `local-${prev.length + 1}`,
        autor: "cliente",
        texto: limpio,
        cuando: "ahora",
      },
    ]);
    setTexto("");
  }

  function solicitarCambios() {
    cajaComentario.current?.focus();
    cajaComentario.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="flex min-h-screen justify-center bg-stone-100 px-4 py-6">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {/* Encabezado */}
        <div className="flex items-center gap-2 border-b border-stone-100 px-4 py-3">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-marca text-white">
            <Package size={14} />
          </div>
          <span className="text-sm font-medium text-stone-800">AbiQ</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-stone-400">
            <Lock size={12} /> Revisión privada
          </span>
        </div>

        {/* Título */}
        <div className="px-4 pb-1 pt-3">
          <h1 className="text-base font-medium text-stone-800">
            {enlace.tituloMueble}
          </h1>
          <p className="text-xs text-stone-500">
            Diseño preparado para {enlace.cliente}
          </p>
        </div>

        {/* Visor 3D */}
        <div className="relative mx-4 mt-2 h-72 overflow-hidden rounded-xl bg-[#f1efe9]">
          <Visor3D color={color} />
          <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] text-stone-500">
            <Rotate3d size={13} /> Arrastra para rotar · rueda o pellizco para zoom
          </div>
        </div>

        {/* Selector de tela (customización en vivo) */}
        <div className="px-4 pt-4">
          <div className="mb-2 text-sm font-medium text-stone-700">
            Previsualiza la tela
          </div>
          <div className="flex items-center gap-2.5">
            {TELAS.map((t) => (
              <button
                key={t.valor}
                onClick={() => setColor(t.valor)}
                aria-label={t.nombre}
                title={t.nombre}
                className={clsx(
                  "h-8 w-8 rounded-full border-2 transition-transform",
                  color === t.valor
                    ? "scale-110 border-stone-800"
                    : "border-white ring-1 ring-stone-200",
                )}
                style={{ backgroundColor: t.valor }}
              />
            ))}
          </div>
        </div>

        {/* Comentarios */}
        <div className="px-4 pt-5">
          <div className="mb-2 text-sm font-medium text-stone-700">Tu opinión</div>
          <div className="flex gap-2">
            <textarea
              ref={cajaComentario}
              rows={2}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe un comentario…"
              className="flex-1 resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
            />
            <button
              onClick={enviarComentario}
              aria-label="Enviar comentario"
              className="grid w-10 shrink-0 place-items-center rounded-lg border border-stone-200 text-stone-500 transition-colors hover:bg-stone-50"
            >
              <Send size={16} />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {comentarios.map((c) => (
              <div
                key={c.id}
                className={clsx(
                  "border-l-2 pl-3",
                  c.autor === "cliente"
                    ? "border-marca"
                    : "border-stone-300",
                )}
              >
                <div className="text-sm text-stone-700">{c.texto}</div>
                <div className="text-[11px] text-stone-400">
                  {c.autor === "cliente" ? "Tú" : "AbiQ · asesor"} · {c.cuando}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="px-4 pb-5 pt-5">
          {aprobado ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <Check size={18} />
              ¡Diseño aprobado! Tu asesor continuará con la producción.
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => setAprobado(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <Check size={18} /> Aprobar diseño
              </button>
              <button
                onClick={solicitarCambios}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50"
              >
                Solicitar cambios
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
