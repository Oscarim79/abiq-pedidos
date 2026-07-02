"use client";

// ============================================================================
//  AJUSTES DE LA APP (se guardan en el navegador)
// ----------------------------------------------------------------------------
//  Por ahora solo dos cosas:
//   - El número de WhatsApp del departamento de logística (a dónde se envían
//     los pedidos con el botón verde).
//   - El nombre del vendedor, para que salga en la ficha y en el mensaje.
// ============================================================================
import { useEffect, useState } from "react";

export type Ajustes = {
  logisticaNumero: string; // con código de país, ej. "5215512345678"
  vendedorNombre: string;
};

const CLAVE = "abiq.ajustes.v1";

const POR_DEFECTO: Ajustes = {
  logisticaNumero: "",
  vendedorNombre: "",
};

export function leerAjustes(): Ajustes {
  if (typeof window === "undefined") return POR_DEFECTO;
  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (!raw) return POR_DEFECTO;
    return { ...POR_DEFECTO, ...JSON.parse(raw) };
  } catch {
    return POR_DEFECTO;
  }
}

export function useAjustes() {
  const [ajustes, setAjustes] = useState<Ajustes>(POR_DEFECTO);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setAjustes(leerAjustes());
    setCargado(true);
  }, []);

  function guardar(nuevos: Ajustes) {
    setAjustes(nuevos);
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(nuevos));
    } catch {
      // Si el navegador bloquea localStorage, seguimos en memoria.
    }
  }

  return { ajustes, cargado, guardar };
}
