import { Settings } from "lucide-react";

export default function AjustesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-medium text-stone-800">Ajustes</h1>
      <div className="mt-6 grid place-items-center rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <Settings size={28} className="text-stone-300" />
        <p className="mt-3 text-sm text-stone-500">
          Configuración del equipo y la tienda — fase posterior.
        </p>
      </div>
    </div>
  );
}
