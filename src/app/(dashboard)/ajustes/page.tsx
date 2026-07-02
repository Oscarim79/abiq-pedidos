"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useAjustes, type Ajustes } from "@/lib/ajustes-store";

export default function AjustesPage() {
  const { ajustes, cargado, guardar } = useAjustes();
  const [borrador, setBorrador] = useState<Ajustes>(ajustes);
  const [guardado, setGuardado] = useState(false);

  // Cuando terminan de cargar los ajustes del navegador, los mostramos.
  useEffect(() => {
    if (cargado) setBorrador(ajustes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargado]);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    guardar({
      logisticaNumero: borrador.logisticaNumero.trim(),
      vendedorNombre: borrador.vendedorNombre.trim(),
    });
    setGuardado(true);
    window.setTimeout(() => setGuardado(false), 2500);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-medium text-stone-800">Ajustes</h1>
      <p className="text-sm text-stone-500">
        Configuración básica para el envío de pedidos.
      </p>

      <form
        onSubmit={enviar}
        className="mt-6 space-y-5 rounded-xl border border-stone-200 bg-white p-5"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">
            WhatsApp del departamento de logística
          </label>
          <input
            value={borrador.logisticaNumero}
            onChange={(e) =>
              setBorrador({ ...borrador, logisticaNumero: e.target.value })
            }
            placeholder="Ej.: 5215512345678"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
          />
          <p className="mt-1.5 text-xs text-stone-400">
            Escríbelo con el código de país y sin espacios ni signos. Ejemplo
            para México: 52 + 1 + número de 10 dígitos. Si lo dejas vacío,
            WhatsApp te dejará elegir el contacto a mano cada vez.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">
            Tu nombre (vendedor)
          </label>
          <input
            value={borrador.vendedorNombre}
            onChange={(e) =>
              setBorrador({ ...borrador, vendedorNombre: e.target.value })
            }
            placeholder="Ej.: María López"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
          />
          <p className="mt-1.5 text-xs text-stone-400">
            Aparece en el mensaje de WhatsApp y en la ficha impresa, para que
            logística sepa a quién preguntarle.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          {guardado && (
            <span className="flex items-center gap-1 text-sm text-marca">
              <Check size={15} />
              Guardado
            </span>
          )}
          <button
            type="submit"
            className="rounded-lg bg-marca px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-marca-oscuro"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
