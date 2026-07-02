import type { Proyecto } from "@/lib/tipos";
import { listaEspecificaciones } from "@/lib/especificaciones";

// ============================================================================
//  MENSAJE DE WHATSAPP PARA LOGÍSTICA
// ----------------------------------------------------------------------------
//  Arma el texto del pedido con todas las especificaciones y genera el enlace
//  que abre WhatsApp con el mensaje ya escrito. Si quieres cambiar el formato
//  del mensaje, edita la función construirMensaje: lo que va entre comillas
//  es texto normal, y ${...} inserta el dato del proyecto.
// ============================================================================

export function construirMensaje(
  proyecto: Proyecto,
  vendedorNombre: string,
  cantidadFotos: number,
): string {
  let msg = `📦 *NUEVO PEDIDO — ${proyecto.titulo.toUpperCase()}*`;
  msg += `\n\n*Cliente:* ${proyecto.cliente.nombre}`;
  if (proyecto.cliente.telefono.trim())
    msg += `\n*Tel. cliente:* ${proyecto.cliente.telefono}`;
  msg += `\n*Tienda:* ${proyecto.tienda}`;
  if (vendedorNombre.trim()) msg += `\n*Vendedor:* ${vendedorNombre}`;

  msg += `\n\n🪑 *ESPECIFICACIONES*`;
  for (const [etiqueta, valor] of listaEspecificaciones(proyecto)) {
    msg += `\n• ${etiqueta}: ${valor}`;
  }

  if (proyecto.caracteristicas.trim())
    msg += `\n\n📐 *CARACTERÍSTICAS*\n${proyecto.caracteristicas.trim()}`;
  if (proyecto.notas.trim())
    msg += `\n\n📝 *NOTAS*\n${proyecto.notas.trim()}`;

  if (cantidadFotos > 0)
    msg += `\n\n📷 El pedido tiene ${cantidadFotos} foto(s) de referencia. Se adjuntan en este chat junto con la ficha en PDF.`;

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
