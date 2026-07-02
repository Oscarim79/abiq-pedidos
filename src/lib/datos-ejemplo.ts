import type { Proyecto } from "@/lib/tipos";

// Proyectos de ejemplo para que la app se vea funcionando desde el primer día.
// La primera vez que abres la app se copian a tu navegador; después puedes
// editarlos o borrarlos como cualquier proyecto real.

export const SEMILLA: Proyecto[] = [
  {
    id: "ejemplo-1",
    titulo: "Clóset de roble a medida",
    tipoMueble: "Clóset",
    cliente: { nombre: "Familia Restrepo", telefono: "573001112233" },
    tienda: "Tienda Norte",
    estado: "nuevo",
    medidas: { largo: "240", alto: "220", profundidad: "60" },
    madera: "Roble",
    tela: "Sin tela",
    color: "Tono nogal medio",
    acabado: "Natural mate",
    vetas: "Vertical",
    herrajes: ["Bisagras ocultas", "Sistema push", "Anclaje a pared"],
    caracteristicas:
      "Puerta corrediza del lado izquierdo. Interior liso, sin divisiones en el módulo central. Zapatera inclinada abajo a la derecha.",
    notas: "El cliente trae fotos de Pinterest como referencia.",
    creadoEn: "2026-06-28",
  },
  {
    id: "ejemplo-2",
    titulo: "Mesa de comedor para 8",
    tipoMueble: "Mesa de comedor",
    cliente: { nombre: "Carolina Méndez", telefono: "573004445566" },
    tienda: "Tienda Centro",
    estado: "enviado_logistica",
    medidas: { largo: "220", alto: "75", profundidad: "100" },
    madera: "Nogal",
    tela: "Sin tela",
    color: "Nogal natural",
    acabado: "Aceite natural",
    vetas: "Horizontal",
    herrajes: ["Patas niveladoras"],
    caracteristicas:
      "Bordes redondeados, pata central tipo trompo. Cubierta de una sola pieza si es posible.",
    notas: "Confirmar tiempo de entrega antes del 15 de agosto.",
    creadoEn: "2026-06-22",
    enviadoEn: "2026-06-25",
  },
  {
    id: "ejemplo-3",
    titulo: "Sofá modular sala",
    tipoMueble: "Sofá",
    cliente: { nombre: "Andrés Gómez", telefono: "573007778899" },
    tienda: "Tienda Norte",
    estado: "en_produccion",
    medidas: { largo: "300", alto: "85", profundidad: "160" },
    madera: "Pino",
    tela: "Pana",
    color: "Verde oliva",
    acabado: "Patas en latón",
    vetas: "No aplica",
    herrajes: [],
    caracteristicas:
      "Chaise longue al lado derecho. Cojines desenfundables. Estructura en pino.",
    notas: "Cliente aprobó la tela en tienda el 20 de junio.",
    creadoEn: "2026-06-15",
    enviadoEn: "2026-06-18",
  },
];
