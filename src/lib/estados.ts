import type { EstadoProyecto } from "@/lib/tipos";

// Texto y color para cada estado del proyecto.
export const estadoInfo: Record<
  EstadoProyecto,
  { etiqueta: string; clases: string }
> = {
  nuevo: { etiqueta: "Nuevo", clases: "bg-blue-50 text-blue-700" },
  enviado_logistica: {
    etiqueta: "Enviado a logística",
    clases: "bg-amber-50 text-amber-700",
  },
  en_produccion: {
    etiqueta: "En producción",
    clases: "bg-violet-50 text-violet-700",
  },
  entregado: { etiqueta: "Entregado", clases: "bg-emerald-50 text-emerald-700" },
  cancelado: { etiqueta: "Cancelado", clases: "bg-red-50 text-red-700" },
};

// Orden en que se muestran los estados en los filtros y el selector.
export const ORDEN_ESTADOS: EstadoProyecto[] = [
  "nuevo",
  "enviado_logistica",
  "en_produccion",
  "entregado",
  "cancelado",
];
