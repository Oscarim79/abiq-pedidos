import type { Proyecto } from "@/lib/tipos";
import { listaEspecificaciones } from "@/lib/especificaciones";

// ============================================================================
//  ORDEN DE FABRICACIÓN — datos y textos
// ----------------------------------------------------------------------------
//  Convierte un pedido en las líneas de la orden de fabricación (el documento
//  que recibe la fábrica): el mueble principal + los artículos adicionales,
//  cada uno con cantidad, costo, subtotal y observaciones. Lo usan la hoja
//  imprimible (proyectos/orden), el detalle y el mensaje de WhatsApp.
// ============================================================================

// 13000 → "Q13,000" (quetzales, con separador de miles).
export function formatearQ(monto: number): string {
  return `Q${monto.toLocaleString("es-GT", { maximumFractionDigits: 2 })}`;
}

// "4" → 4; vacío o raro → 1 (siempre se fabrica al menos una pieza).
function aCantidad(texto: string | undefined): number {
  const n = parseFloat(texto ?? "");
  return Number.isFinite(n) && n > 0 ? n : 1;
}

// "13000" → 13000; vacío o raro → null (costo aún sin capturar).
function aCosto(texto: string | undefined): number | null {
  const n = parseFloat(texto ?? "");
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export type LineaOrden = {
  codigo: string;
  descripcion: string;
  cantidad: number;
  costo: number | null; // null = sin costo capturado
  subtotal: number | null;
  observaciones: string;
};

// Las instrucciones de fabricación del mueble principal: todas las
// especificaciones capturadas + las características especiales, como texto.
export function observacionesPrincipal(proyecto: Proyecto): string {
  const partes = listaEspecificaciones(proyecto).map(
    ([etiqueta, valor]) => `${etiqueta}: ${valor}.`,
  );
  if (proyecto.caracteristicas.trim() !== "") {
    partes.push(proyecto.caracteristicas.trim());
  }
  return partes.join("\n");
}

export function lineasDeOrden(proyecto: Proyecto): LineaOrden[] {
  const cantidad = aCantidad(proyecto.cantidad);
  const costo = aCosto(proyecto.costo);
  const lineas: LineaOrden[] = [
    {
      codigo: (proyecto.codigoArticulo ?? "").trim(),
      descripcion: proyecto.titulo,
      cantidad,
      costo,
      subtotal: costo === null ? null : costo * cantidad,
      observaciones: observacionesPrincipal(proyecto),
    },
  ];

  for (const extra of proyecto.articulosExtra ?? []) {
    // Una fila que quedó totalmente vacía no va a la orden.
    if (
      extra.codigo.trim() === "" &&
      extra.descripcion.trim() === "" &&
      extra.observaciones.trim() === ""
    ) {
      continue;
    }
    const cant = aCantidad(extra.cantidad);
    const costoExtra = aCosto(extra.costo);
    lineas.push({
      codigo: extra.codigo.trim(),
      descripcion: extra.descripcion.trim(),
      cantidad: cant,
      costo: costoExtra,
      subtotal: costoExtra === null ? null : costoExtra * cant,
      observaciones: extra.observaciones.trim(),
    });
  }
  return lineas;
}

// Suma de los subtotales que sí tienen costo. Null si ninguno lo tiene
// (para no imprimir un "Total: Q0" engañoso).
export function totalDeOrden(lineas: LineaOrden[]): number | null {
  const conCosto = lineas.filter((l) => l.subtotal !== null);
  if (conCosto.length === 0) return null;
  return conCosto.reduce((suma, l) => suma + (l.subtotal ?? 0), 0);
}

// El texto que el cliente acepta al firmar — el mismo de las órdenes en papel.
export const CLAUSULA_CONFORMIDAD =
  "Al firmar y aceptar la presente orden de fabricación, el cliente declara " +
  "haber revisado cuidadosamente las especificaciones, medidas, colores, " +
  "materiales y demás detalles aquí descritos. Una vez firmada, esta orden " +
  "constituye aceptación definitiva y autorización para iniciar la " +
  "producción, por lo que no se admitirán cambios, modificaciones ni " +
  "cancelaciones posteriores. El cliente asume plena conformidad con lo " +
  "solicitado y reconoce que los muebles serán entregados conforme a lo " +
  "estipulado en este documento.";
