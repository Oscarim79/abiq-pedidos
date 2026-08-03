import type { Proyecto } from "@/lib/tipos";
import {
  folioTexto,
  formatearQ,
  lineasDeOrden,
  totalDeOrden,
} from "@/lib/orden";

// ============================================================================
//  MENSAJE DE WHATSAPP PARA LOGÍSTICA
// ----------------------------------------------------------------------------
//  Lo que logística recibe es la ORDEN DE FABRICACIÓN en PDF (la hoja de
//  /proyectos/orden, guardada con "Imprimir / Guardar PDF"). Este mensaje es
//  el texto que la acompaña: folio, datos rápidos, artículos y el aviso de
//  que la orden va adjunta. El detalle completo (especificaciones, tapiz,
//  firma) viaja dentro del PDF. Si quieres cambiar el formato del mensaje,
//  edita construirMensaje: lo que va entre comillas es texto normal, y
//  ${...} inserta el dato del proyecto.
// ============================================================================

export function construirMensaje(
  proyecto: Proyecto,
  vendedorNombre: string,
  cantidadFotos: number,
): string {
  const folio = folioTexto(proyecto.folio);
  let msg = `🏭 *ORDEN DE FABRICACIÓN ${folio}*`;
  msg += `\n*Pedido:* ${proyecto.titulo}`;
  msg += `\n\n*Cliente:* ${proyecto.cliente.nombre}`;
  if (proyecto.cliente.telefono.trim())
    msg += `\n*Tel. cliente:* ${proyecto.cliente.telefono}`;
  msg += `\n*Tienda:* ${proyecto.tienda}`;
  if (vendedorNombre.trim()) msg += `\n*Vendedor:* ${vendedorNombre}`;

  // El mismo aviso destacado que lleva la orden impresa.
  if (proyecto.notas.trim())
    msg += `\n\n⚠️ *IMPORTANTE:* ${proyecto.notas.trim()}`;

  // Artículos y costos (solo si se capturó algún código o costo).
  const lineas = lineasDeOrden(proyecto);
  const hayDatosDeOrden = lineas.some(
    (l) => l.codigo !== "" || l.costo !== null,
  );
  if (hayDatosDeOrden) {
    msg += `\n\n🧾 *ARTÍCULOS*`;
    for (const l of lineas) {
      msg += `\n• ${l.codigo ? `[${l.codigo}] ` : ""}${
        l.descripcion || "Artículo"
      } × ${l.cantidad}`;
      if (l.subtotal !== null) msg += ` — ${formatearQ(l.subtotal)}`;
    }
    const total = totalDeOrden(lineas);
    if (total !== null) msg += `\n*Total:* ${formatearQ(total)}`;
  }

  msg += `\n\n📎 *Adjunto la orden de fabricación ${folio} en PDF*`;
  if (cantidadFotos > 0)
    msg += ` y ${cantidadFotos} foto(s) de referencia`;
  msg += `.`;

  msg += `\n\n_Enviado desde AbiQ · ${new Date().toLocaleDateString("es-MX")}_`;
  return msg;
}

// Genera el enlace que abre WhatsApp. Si no hay número configurado, WhatsApp
// deja elegir el contacto a mano (el mensaje ya va escrito igual).
export function enlaceWhatsApp(numero: string, mensaje: string): string {
  const limpio = numero.replace(/[^\d]/g, "");
  const base = limpio ? `https://wa.me/${limpio}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(mensaje)}`;
}
