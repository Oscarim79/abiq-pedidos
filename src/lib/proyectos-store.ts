"use client";

// ============================================================================
//  ALMACÉN DE PROYECTOS (demo, sin base de datos todavía)
// ----------------------------------------------------------------------------
//  Guarda todos los proyectos en el navegador (localStorage): los que creas,
//  los que editas y sus cambios de estado. No se borran al recargar.
//
//  Importante: solo viven en ESTE navegador. Cuando conectemos Supabase
//  (fase del portal del cliente), los proyectos se guardarán en la nube y se
//  compartirán entre dispositivos. Solo habrá que reemplazar este archivo.
// ============================================================================
import { useEffect, useState } from "react";
import { SEMILLA } from "@/lib/datos-ejemplo";
import { eliminarArchivosDe } from "@/lib/archivos-store";
import { avisarSinEspacio } from "@/lib/aviso-espacio";
import type { EstadoProyecto, Proyecto } from "@/lib/tipos";

const CLAVE = "abiq.proyectos.v2";

// Lo que llena el vendedor en el formulario (todo menos id, estado y fechas).
export type ProyectoInput = Omit<
  Proyecto,
  "id" | "estado" | "creadoEn" | "enviadoEn" | "firma" | "firmadoPor"
>;

// Fecha local (no UTC): un pedido capturado a las 8 pm debe quedar con la
// fecha de hoy, no la de mañana.
function hoy(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Lee la lista completa. La primera vez copia los ejemplos al navegador.
function leerTodos(): Proyecto[] {
  if (typeof window === "undefined") return SEMILLA;
  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (!raw) {
      window.localStorage.setItem(CLAVE, JSON.stringify(SEMILLA));
      return SEMILLA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Proyecto[]) : SEMILLA;
  } catch {
    return SEMILLA;
  }
}

function guardarTodos(lista: Proyecto[]) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // El navegador bloqueó el guardado (casi siempre: espacio lleno).
    avisarSinEspacio();
  }
}

export function crearProyecto(datos: ProyectoInput, id?: string): Proyecto {
  const nuevo: Proyecto = {
    ...datos,
    id: id ?? `p-${Date.now()}`,
    estado: "nuevo",
    creadoEn: hoy(),
  };
  guardarTodos([nuevo, ...leerTodos()]);
  return nuevo;
}

export function actualizarProyecto(
  id: string,
  cambios: Partial<Proyecto>,
): Proyecto | undefined {
  const lista = leerTodos();
  const idx = lista.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const actualizado = { ...lista[idx], ...cambios, id };
  lista[idx] = actualizado;
  guardarTodos(lista);
  return actualizado;
}

export function eliminarProyecto(id: string) {
  guardarTodos(leerTodos().filter((p) => p.id !== id));
  // También sus fotos, para no dejar basura ocupando espacio.
  eliminarArchivosDe(id);
}

export function obtenerProyecto(id: string): Proyecto | undefined {
  return leerTodos().find((p) => p.id === id);
}

// ——— Hook para la LISTA de proyectos ———————————————————————————————
// Arranca vacío y carga lo guardado en cuanto monta. Así un proyecto de
// ejemplo que borraste no "reaparece" ni un instante en la lista.
export function useProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[] | null>(null);

  useEffect(() => {
    setProyectos(leerTodos());
  }, []);

  return { proyectos: proyectos ?? [], cargado: proyectos !== null };
}

// ——— Hook para UN proyecto (página de detalle, ficha, editar) ————————
export function useProyecto(id: string) {
  const [proyecto, setProyecto] = useState<Proyecto | undefined>(undefined);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setProyecto(obtenerProyecto(id));
    setCargado(true);
  }, [id]);

  function actualizar(cambios: Partial<Proyecto>) {
    const nuevo = actualizarProyecto(id, cambios);
    if (nuevo) setProyecto(nuevo);
  }

  function cambiarEstado(estado: EstadoProyecto) {
    // Al enviar a logística guardamos también la fecha del PRIMER envío
    // (volver a pulsar el botón no la cambia).
    if (estado === "enviado_logistica") {
      actualizar({ estado, enviadoEn: proyecto?.enviadoEn ?? hoy() });
    } else {
      actualizar({ estado });
    }
  }

  return { proyecto, cargado, actualizar, cambiarEstado };
}
