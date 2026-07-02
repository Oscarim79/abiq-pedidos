// Estos "tipos" describen la forma de cada dato del sistema.
// Sirven para que el editor te avise si algo no cuadra. No necesitas tocarlos.

export type EstadoProyecto =
  | "borrador"
  | "en_diseno"
  | "en_revision_cliente"
  | "aprobado"
  | "en_produccion"
  | "enviado_proveedor"
  | "completado"
  | "cancelado";

export type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
};

export type Proyecto = {
  id: string;
  titulo: string;
  cliente: Cliente;
  tienda: string;
  estado: EstadoProyecto;
  // Especificaciones capturadas en modo "Carga directa".
  medidas: string;
  madera: string;
  tela: string;
  acabado: string;
  notas: string;
  referencias: number; // cuántas imágenes/planos se subieron
  tieneModelo3d: boolean;
  creadoEn: string;
};
