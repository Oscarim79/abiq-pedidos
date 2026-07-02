// ============================================================================
//  CONFIGURACIÓN DEL WIZARD CONSULTIVO  (propuesta inicial, 100% editable)
// ----------------------------------------------------------------------------
//  Todo el cuestionario vive AQUÍ, no en el código de las pantallas.
//  Para cambiar el wizard NO necesitas saber programar: edita este archivo.
//    - Cambiar una pregunta: edita su "etiqueta".
//    - Añadir una opción: agrega { valor, etiqueta } dentro de "opciones".
//    - Añadir un paso entero: copia un bloque { id, titulo, ... } y modifícalo.
//    - Reordenar pasos: cambia el orden de los bloques en la lista de abajo.
//  Tipos de campo disponibles: "opcion-unica" | "opcion-multiple" | "texto" |
//  "numero" | "color".
// ============================================================================

export type TipoCampo =
  | "opcion-unica"
  | "opcion-multiple"
  | "texto"
  | "numero"
  | "color";

export type CampoWizard = {
  id: string;
  etiqueta: string;
  tipo: TipoCampo;
  ayuda?: string;
  opciones?: { valor: string; etiqueta: string }[];
  placeholder?: string;
};

export type PasoWizard = {
  id: string;
  titulo: string;
  descripcion: string;
  campos: CampoWizard[];
};

export const wizardConfig: PasoWizard[] = [
  {
    id: "estilo",
    titulo: "Estilo del mueble",
    descripcion: "¿Qué ambiente busca el cliente?",
    campos: [
      {
        id: "estilo_general",
        etiqueta: "Estilo general",
        tipo: "opcion-unica",
        opciones: [
          { valor: "moderno", etiqueta: "Moderno / minimalista" },
          { valor: "clasico", etiqueta: "Clásico" },
          { valor: "rustico", etiqueta: "Rústico / campestre" },
          { valor: "industrial", etiqueta: "Industrial" },
          { valor: "escandinavo", etiqueta: "Escandinavo" },
        ],
      },
      {
        id: "referencias_visuales",
        etiqueta: "¿El cliente trajo fotos de referencia?",
        tipo: "opcion-unica",
        opciones: [
          { valor: "si", etiqueta: "Sí, ya las subí" },
          { valor: "no", etiqueta: "No, partimos de cero" },
        ],
      },
    ],
  },
  {
    id: "dimensiones",
    titulo: "Dimensiones del espacio",
    descripcion: "Medidas disponibles donde irá el mueble.",
    campos: [
      {
        id: "ancho",
        etiqueta: "Ancho del espacio (cm)",
        tipo: "numero",
        placeholder: "Ej. 240",
      },
      {
        id: "alto",
        etiqueta: "Alto disponible (cm)",
        tipo: "numero",
        placeholder: "Ej. 220",
      },
      {
        id: "profundidad",
        etiqueta: "Profundidad (cm)",
        tipo: "numero",
        placeholder: "Ej. 60",
      },
      {
        id: "restricciones",
        etiqueta: "¿Hay obstáculos? (ventanas, tomas, tuberías)",
        tipo: "texto",
        placeholder: "Describe cualquier limitación del espacio",
      },
    ],
  },
  {
    id: "colores",
    titulo: "Paleta de colores",
    descripcion: "Preferencias de color y acabado.",
    campos: [
      {
        id: "color_principal",
        etiqueta: "Color principal preferido",
        tipo: "color",
      },
      {
        id: "tono_madera",
        etiqueta: "Tono de madera",
        tipo: "opcion-unica",
        opciones: [
          { valor: "claro", etiqueta: "Claro (roble, pino)" },
          { valor: "medio", etiqueta: "Medio (nogal, cerezo)" },
          { valor: "oscuro", etiqueta: "Oscuro (wengué, ébano)" },
        ],
      },
      {
        id: "acabado",
        etiqueta: "Acabado",
        tipo: "opcion-unica",
        opciones: [
          { valor: "mate", etiqueta: "Mate" },
          { valor: "satinado", etiqueta: "Satinado" },
          { valor: "brillante", etiqueta: "Brillante" },
        ],
      },
    ],
  },
  {
    id: "uso",
    titulo: "Necesidades de uso",
    descripcion: "Cómo se usará el mueble en el día a día.",
    campos: [
      {
        id: "funciones",
        etiqueta: "¿Qué debe resolver el mueble? (puedes elegir varias)",
        tipo: "opcion-multiple",
        opciones: [
          { valor: "almacenaje", etiqueta: "Mucho almacenaje" },
          { valor: "exhibicion", etiqueta: "Exhibir objetos" },
          { valor: "multiuso", etiqueta: "Multiuso / convertible" },
          { valor: "ninos", etiqueta: "Resistente para niños/mascotas" },
        ],
      },
      {
        id: "presupuesto",
        etiqueta: "Rango de presupuesto aproximado",
        tipo: "opcion-unica",
        opciones: [
          { valor: "economico", etiqueta: "Económico" },
          { valor: "medio", etiqueta: "Intermedio" },
          { valor: "premium", etiqueta: "Premium" },
        ],
      },
      {
        id: "comentarios",
        etiqueta: "Comentarios adicionales del cliente",
        tipo: "texto",
        placeholder: "Cualquier detalle que el cliente mencione",
      },
    ],
  },
];
