import type { Proyecto } from "@/lib/tipos";

// Arma la lista de especificaciones que se muestra en el detalle, la ficha y
// el mensaje de WhatsApp — siempre igual en los tres lugares. Omite lo vacío
// y los valores "Sin tela" / "No aplica" (no aportan nada a la fábrica).

export function textoMedidas(medidas: Proyecto["medidas"]): string {
  const { largo, alto, profundidad } = medidas;
  if (!largo && !alto && !profundidad) return "";
  return `${largo || "?"} × ${alto || "?"} × ${profundidad || "?"} cm (largo × alto × prof.)`;
}

export function listaEspecificaciones(proyecto: Proyecto): [string, string][] {
  const pares: [string, string][] = [
    ["Tipo de mueble", proyecto.tipoMueble],
    ["Medidas", textoMedidas(proyecto.medidas)],
    ["Madera", proyecto.madera],
    ["Tela / tapizado", proyecto.tela],
    ["Color", proyecto.color],
    ["Acabado", proyecto.acabado],
    ["Vetas", proyecto.vetas],
    ["Herrajes", proyecto.herrajes.join(", ")],
  ];
  return pares.filter(
    ([, valor]) =>
      valor.trim() !== "" && valor !== "Sin tela" && valor !== "No aplica",
  );
}
