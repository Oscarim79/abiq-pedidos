import { Columns3 } from "lucide-react";

export default function KanbanPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-medium text-stone-800">Kanban (CEDIs)</h1>
      <div className="mt-6 grid place-items-center rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <Columns3 size={28} className="text-stone-300" />
        <p className="mt-3 text-sm text-stone-500">
          El tablero del Gerente de Operación llegará en una fase posterior.
        </p>
      </div>
    </div>
  );
}
