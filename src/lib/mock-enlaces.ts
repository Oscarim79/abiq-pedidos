// Datos de ejemplo de los "Enlaces de Revisión Privados" que el vendedor envía
// al cliente. Cada enlace se identifica por un token en la URL:
//   /revision/<token>
// En la siguiente fase esto vendrá de Supabase (tabla enlaces_revision) y el
// token se validará con Row Level Security. Por ahora es de ejemplo.

export type ComentarioCliente = {
  id: string;
  autor: "cliente" | "vendedor";
  texto: string;
  cuando: string;
};

export type EnlaceRevision = {
  token: string;
  proyectoId: string;
  tituloMueble: string;
  cliente: string;
  // Tipo de modelo de ejemplo a renderizar. Hoy solo "sofa".
  modelo: "sofa";
  // Color de tela inicial (hex). El cliente puede previsualizar otros.
  colorInicial: string;
  // Si la fecha ya pasó, el enlace se considera caducado.
  expira: string;
  comentarios: ComentarioCliente[];
};

const enlaces: Record<string, EnlaceRevision> = {
  "demo-sofa-123": {
    token: "demo-sofa-123",
    proyectoId: "3",
    tituloMueble: "Sofá modular a la medida",
    cliente: "Andrés Gómez",
    modelo: "sofa",
    colorInicial: "#6b7a52", // pana verde oliva
    expira: "2026-12-31T23:59:59",
    comentarios: [
      {
        id: "c1",
        autor: "vendedor",
        texto:
          "Hola Andrés, aquí está la primera propuesta. Puedes girarlo y probar otras telas. ¡Cuéntame qué te parece!",
        cuando: "hace 1 hora",
      },
    ],
  },
};

export function obtenerEnlace(token: string): EnlaceRevision | undefined {
  return enlaces[token];
}

export function enlaceVigente(enlace: EnlaceRevision): boolean {
  return new Date(enlace.expira).getTime() > Date.now();
}
