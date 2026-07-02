"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, Check } from "lucide-react";

// Recuadro para dibujar la firma de "visto bueno" con el dedo o el mouse.
// Al guardar, la firma se convierte en una imagen y queda en el proyecto.
export function FirmaPad({
  onGuardar,
}: {
  onGuardar: (firma: string, firmadoPor: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dibujando = useRef(false);
  const [hayTrazo, setHayTrazo] = useState(false);
  const [nombre, setNombre] = useState("");

  // Ajusta el tamaño real del lienzo al espacio disponible (nítido en
  // pantallas de alta densidad) y lo re-ajusta si la ventana cambia o la
  // tableta se rota, conservando lo ya dibujado.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function ajustar() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const ratio = window.devicePixelRatio || 1;
      if (
        canvas.width === Math.round(rect.width * ratio) &&
        canvas.height === Math.round(rect.height * ratio)
      )
        return;

      // Copia lo dibujado hasta ahora para no perder la firma a medias.
      const previo = document.createElement("canvas");
      previo.width = canvas.width;
      previo.height = canvas.height;
      previo.getContext("2d")?.drawImage(canvas, 0, 0);

      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#1c1917";
      if (previo.width > 0 && previo.height > 0) {
        ctx.drawImage(previo, 0, 0, rect.width, rect.height);
      }
    }

    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(canvas);
    return () => observador.disconnect();
  }, []);

  function posicion(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function empezar(e: React.PointerEvent) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    try {
      canvasRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // Algunos navegadores no lo permiten; se puede firmar igual.
    }
    dibujando.current = true;
    const { x, y } = posicion(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function mover(e: React.PointerEvent) {
    if (!dibujando.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = posicion(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHayTrazo(true);
  }

  function terminar() {
    dibujando.current = false;
  }

  function limpiar() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHayTrazo(false);
  }

  function guardar() {
    const canvas = canvasRef.current;
    if (!canvas || !hayTrazo) return;
    onGuardar(canvas.toDataURL("image/png"), nombre.trim());
  }

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        onPointerDown={empezar}
        onPointerMove={mover}
        onPointerUp={terminar}
        onPointerLeave={terminar}
        className="h-36 w-full cursor-crosshair touch-none rounded-lg border border-stone-300 bg-white"
      />
      <p className="-mt-1 text-xs text-stone-400">
        Firma aquí con el dedo (en tableta/celular) o con el mouse.
      </p>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de quien firma (cliente o responsable)"
        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={limpiar}
          className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
        >
          <Eraser size={15} />
          Borrar
        </button>
        <button
          type="button"
          onClick={guardar}
          disabled={!hayTrazo || nombre.trim() === ""}
          className="flex items-center gap-2 rounded-lg bg-marca px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-marca-oscuro disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={15} />
          Guardar visto bueno
        </button>
      </div>
    </div>
  );
}
