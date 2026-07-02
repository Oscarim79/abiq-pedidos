import type { Proyecto } from "@/lib/tipos";

// Datos de ejemplo para que la app se vea funcionando SIN base de datos todavía.
// En la siguiente fase, estos vendrán de Supabase. Puedes editar/añadir libremente.

export const proyectos: Proyecto[] = [
  {
    id: "1",
    titulo: "Clóset de roble a medida",
    cliente: {
      id: "c1",
      nombre: "Familia Restrepo",
      email: "restrepo@email.com",
      telefono: "573001112233",
    },
    tienda: "Tienda Norte",
    estado: "en_diseno",
    medidas: "240 × 60 × 220 cm",
    madera: "Roble macizo",
    tela: "Lino gris",
    acabado: "Nogal mate",
    notas: "Herrajes ocultos, puerta corrediza del lado izquierdo.",
    referencias: 3,
    tieneModelo3d: false,
    creadoEn: "2026-06-18",
  },
  {
    id: "2",
    titulo: "Mesa de comedor para 8",
    cliente: {
      id: "c2",
      nombre: "Carolina Méndez",
      email: "caro.mendez@email.com",
      telefono: "573004445566",
    },
    tienda: "Tienda Centro",
    estado: "en_revision_cliente",
    medidas: "220 × 100 × 75 cm",
    madera: "Nogal americano",
    tela: "—",
    acabado: "Aceite natural",
    notas: "Bordes redondeados, pata central tipo trompo.",
    referencias: 5,
    tieneModelo3d: true,
    creadoEn: "2026-06-15",
  },
  {
    id: "3",
    titulo: "Sofá modular sala",
    cliente: {
      id: "c3",
      nombre: "Andrés Gómez",
      email: "andres.gomez@email.com",
      telefono: "573007778899",
    },
    tienda: "Tienda Norte",
    estado: "aprobado",
    medidas: "300 × 160 × 85 cm",
    madera: "Estructura en pino",
    tela: "Pana verde oliva",
    acabado: "Patas en latón",
    notas: "Chaise longue al lado derecho. Cojines desenfundables.",
    referencias: 4,
    tieneModelo3d: true,
    creadoEn: "2026-06-10",
  },
];

export function obtenerProyecto(id: string): Proyecto | undefined {
  return proyectos.find((p) => p.id === id);
}
