"use client";

// Si el navegador se queda sin espacio para guardar (localStorage lleno),
// avisamos UNA vez en lugar de fallar en silencio: así el vendedor sabe que
// debe borrar proyectos o fotos viejas antes de seguir capturando.

let yaAvisado = false;

export function avisarSinEspacio() {
  if (yaAvisado || typeof window === "undefined") return;
  yaAvisado = true;
  window.alert(
    "Atención: el navegador se quedó sin espacio para guardar.\n\n" +
      "Los últimos cambios podrían perderse al recargar la página. " +
      "Borra proyectos entregados o fotos que ya no necesites y vuelve a intentarlo.",
  );
}
