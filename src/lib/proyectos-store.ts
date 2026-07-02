"use client";

// ============================================================================
//  ALMACÉN LOCAL DE PROYECTOS (demo, sin base de datos todavía)
// ----------------------------------------------------------------------------
//  Guarda los proyectos que creas con "Nuevo proyecto" en el navegador
//  (localStorage). Así puedes ver el flujo funcionando: aparecen en la lista y
//  tienen su página de detalle, y NO se borran al recargar.
//
//  Importante: solo viven en ESTE navegador. Cuando conectemos Supabase en la
//  siguiente fase, los proyectos se guardarán de verdad en la nube y se
//  compartirán entre dispositivos. Este archivo se podrá retirar entonces.
// ============================================================================
import { useEffect, useState } from "react";
import { proyectos as SEMILLA } from "@/lib/mock-data";
import type { Proyecto } from "@/lib/tipos";

const CLAVE = "abiq.proyectos.creados.v1";

// Datos mínimos que pide el formulario de "Nuevo proyecto".
export type NuevoProyectoInput = {
  titulo: string;
  clienteNombre: string;
  tienda: string;
};

function leerCreados(): Proyecto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Proyecto[]) : [];
  } catch {
    return [];
  }
}

function guardarCreados(lista: Proyecto[]) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // Si el navegador bloquea localStorage, seguimos en memoria sin romper nada.
  }
}

// Lista completa: primero los que tú creaste, luego los de ejemplo.
export function cargarProyectos(): Proyecto[] {
  return [...leerCreados(), ...SEMILLA];
}

export function obtenerProyectoLocal(id: string): Proyecto | undefined {
  return cargarProyectos().find((p) => p.id === id);
}

// Construye y guarda un proyecto nuevo a partir de lo que escribió el usuario.
export function crearProyecto(input: NuevoProyectoInput): Proyecto {
  const id = `local-${Date.now()}`;
  const hoy = new Date().toISOString().slice(0, 10);
  const nuevo: Proyecto = {
    id,
    titulo: input.titulo.trim(),
    cliente: {
      id: `c-${id}`,
      nombre: input.clienteNombre.trim(),
      email: "",
      telefono: "",
    },
    tienda: input.tienda,
    estado: "borrador",
    medidas: "",
    madera: "",
    tela: "",
    acabado: "",
    notas: "",
    referencias: 0,
    tieneModelo3d: false,
    creadoEn: hoy,
  };
  guardarCreados([nuevo, ...leerCreados()]);
  return nuevo;
}

// Hook para la lista: arranca con la semilla (igual en servidor y cliente, sin
// parpadeos de hidratación) y carga lo guardado en cuanto monta en el navegador.
export function useProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>(SEMILLA);

  useEffect(() => {
    setProyectos(cargarProyectos());
  }, []);

  function agregar(input: NuevoProyectoInput): Proyecto {
    const nuevo = crearProyecto(input);
    setProyectos((prev) => [nuevo, ...prev]);
    return nuevo;
  }

  return { proyectos, agregar };
}
