import type { EstadoProyecto } from "@/lib/tipos";

// Texto y color para cada estado del proyecto.
export const estadoInfo: Record<
  EstadoProyecto,
  { etiqueta: string; clases: string }
> = {
  borrador: { etiqueta: "Borrador", clases: "bg-stone-100 text-stone-600" },
  en_diseno: { etiqueta: "En diseño", clases: "bg-blue-50 text-blue-700" },
  en_revision_cliente: {
    etiqueta: "En revisión del cliente",
    clases: "bg-amber-50 text-amber-700",
  },
  aprobado: { etiqueta: "Aprobado", clases: "bg-emerald-50 text-emerald-700" },
  en_produccion: {
    etiqueta: "En producción",
    clases: "bg-violet-50 text-violet-700",
  },
  enviado_proveedor: {
    etiqueta: "Enviado a proveedor",
    clases: "bg-indigo-50 text-indigo-700",
  },
  completado: { etiqueta: "Completado", clases: "bg-teal-50 text-teal-700" },
  cancelado: { etiqueta: "Cancelado", clases: "bg-red-50 text-red-700" },
};
