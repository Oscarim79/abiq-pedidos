// Estos "tipos" describen la forma de cada dato del sistema.
// Sirven para que el editor te avise si algo no cuadra. No necesitas tocarlos.

// El proyecto avanza por estos estados, en este orden (o se cancela):
// nuevo → enviado_logistica → en_produccion → entregado
export type EstadoProyecto =
  | "nuevo"
  | "enviado_logistica"
  | "en_produccion"
  | "entregado"
  | "cancelado";

export type Cliente = {
  nombre: string;
  telefono: string;
};

// Un artículo adicional del mismo pedido (además del mueble principal):
// las sillas que acompañan un comedor, un banco, cojines extra…
export type ArticuloExtra = {
  id: string;
  codigo: string; // código del artículo, ej. "220264"
  descripcion: string; // ej. "Silla Modern Rabat"
  cantidad: string; // como texto para permitir el campo vacío al escribir
  costo: string; // costo por unidad, en quetzales
  observaciones: string; // instrucciones de fabricación de ese artículo
};

// Medidas exactas del mueble, en centímetros. Se guardan como texto para
// permitir cosas como "240" o "240.5".
export type Medidas = {
  largo: string;
  alto: string;
  profundidad: string;
};

export type Proyecto = {
  id: string;
  titulo: string; // Ej. "Clóset de roble a medida"
  tipoMueble: string; // Ej. "Clóset", "Mesa de comedor"…
  cliente: Cliente;
  tienda: string;
  estado: EstadoProyecto;

  // ——— Especificaciones que captura el vendedor ———
  medidas: Medidas;
  madera: string;
  tela: string; // tela / tapizado (puede quedar vacío)
  color: string; // color principal que pidió el cliente
  acabado: string; // Ej. "Natural mate"
  vetas: string; // dirección de la veta: "Horizontal", "Vertical" o vacío
  herrajes: string[]; // Ej. ["Bisagras ocultas", "Sistema push"]
  caracteristicas: string; // curvas, puertas laterales, interiores, divisiones…
  notas: string; // cualquier otro detalle que mencione el cliente

  // ——— Orden de fabricación (el documento que recibe la fábrica) ———
  // Estos campos son opcionales porque los pedidos guardados antes de esta
  // mejora no los tienen; la app los trata como vacíos.
  folio?: number; // consecutivo de la orden: 3030, 3031… (se imprime "OC3030")
  codigoArticulo?: string; // código del mueble principal, ej. "220835-1"
  cantidad?: string; // cuántas piezas del mueble principal (normalmente "1")
  costo?: string; // costo por unidad del mueble principal, en quetzales
  articulosExtra?: ArticuloExtra[]; // más artículos del mismo pedido

  // ——— Visto bueno (firma de responsabilidad) ———
  firma?: string; // la firma dibujada, guardada como imagen
  firmadoPor?: string; // quién firmó (cliente o responsable)

  // ——— Fechas ———
  creadoEn: string; // "2026-07-02"
  enviadoEn?: string; // cuándo se envió a logística por WhatsApp

  // Fase 2 (portal del cliente): aquí se sumarán comentarios del cliente,
  // aprobaciones y avances. El diseño ya lo contempla.
};
