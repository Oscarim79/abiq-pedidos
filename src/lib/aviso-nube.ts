"use client";

// Si falla el guardado o la lectura en la nube (casi siempre: se fue el
// internet), avisamos UNA vez en lugar de fallar en silencio. Los cambios
// nunca se pierden: quedan guardados en este dispositivo.

let yaAvisado = false;

export function avisarSinNube() {
  if (yaAvisado || typeof window === "undefined") return;
  yaAvisado = true;
  window.alert(
    "Atención: no se pudo conectar con la nube.\n\n" +
      "Revisa tu internet. Tus cambios quedaron guardados en este " +
      "dispositivo, pero las demás tiendas no los verán hasta que " +
      "vuelvas a abrir y guardar el pedido con internet.",
  );
}
