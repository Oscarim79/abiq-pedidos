"use client";

// ============================================================================
//  ALMACÉN DE PROYECTOS (navegador + nube)
// ----------------------------------------------------------------------------
//  Cómo funciona desde la fase 2:
//   - El navegador (localStorage) sigue siendo la copia rápida local: la
//     lista aparece al instante aunque el internet esté lento.
//   - Si la nube está configurada (Supabase), cada cambio se guarda TAMBIÉN
//     allá, y al abrir la app se trae lo capturado en las demás tiendas.
//   - Si la nube NO está configurada (.env.local vacío), todo funciona igual
//     que antes: solo en este navegador, con los proyectos de ejemplo.
//
//  La primera vez que alguien entra con la nube activa, sus pedidos reales
//  guardados en ese navegador se suben solos (los 3 de ejemplo no).
// ============================================================================
import { useEffect, useState } from "react";
import { SEMILLA } from "@/lib/datos-ejemplo";
import { eliminarArchivosDe, empujarArchivosDe } from "@/lib/archivos-store";
import { avisarSinEspacio } from "@/lib/aviso-espacio";
import { avisarSinNube } from "@/lib/aviso-nube";
import { supabase } from "@/lib/supabase";
import type { EstadoProyecto, Proyecto } from "@/lib/tipos";

const CLAVE = "abiq.proyectos.v2";

// Los ids de los proyectos de ejemplo: nunca se suben a la nube.
const IDS_EJEMPLO = new Set(SEMILLA.map((p) => p.id));

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

// Más nuevo primero (las fechas YYYY-MM-DD se comparan como texto).
function ordenar(lista: Proyecto[]): Proyecto[] {
  return [...lista].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
}

// ——— Copia local (navegador) ———————————————————————————————————————————

// Lee la lista completa. Sin nube, la primera vez copia los ejemplos para
// que la demo se vea viva; con nube se empieza limpio (pedidos reales).
function leerTodos(): Proyecto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (!raw) {
      if (supabase) return [];
      window.localStorage.setItem(CLAVE, JSON.stringify(SEMILLA));
      return SEMILLA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Proyecto[]) : [];
  } catch {
    return [];
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

// ——— Sincronización con la nube ————————————————————————————————————————

// Sube (o actualiza) UN proyecto en la nube. Devuelve true si quedó.
async function empujarProyecto(p: Proyecto): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("proyectos").upsert({
    id: p.id,
    data: p,
    actualizado_en: new Date().toISOString(),
  });
  if (error) {
    avisarSinNube();
    return false;
  }
  return true;
}

// Trae TODOS los proyectos de la nube, sube los locales que falten allá
// (migración automática la primera vez) y deja la lista unificada en el
// navegador. Devuelve null si no hay nube o falló la conexión.
async function jalarTodos(): Promise<Proyecto[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("proyectos").select("data");
  if (error) {
    avisarSinNube();
    return null;
  }
  const nube = (data ?? []).map((fila) => fila.data as Proyecto);
  const enNube = new Set(nube.map((p) => p.id));
  const pendientes = leerTodos().filter(
    (p) => !enNube.has(p.id) && !IDS_EJEMPLO.has(p.id),
  );
  for (const p of pendientes) {
    if (await empujarProyecto(p)) void empujarArchivosDe(p.id);
  }
  const unificada = ordenar([...nube, ...pendientes]);
  guardarTodos(unificada);
  return unificada;
}

// Trae UN proyecto de la nube (por si otra tienda lo cambió) y actualiza la
// copia local. Devuelve null si no hay nube, no existe allá o falló la red.
async function jalarUno(id: string): Promise<Proyecto | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("proyectos")
    .select("data")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    avisarSinNube();
    return null;
  }
  if (!data) return null; // Puede ser un pedido recién creado aún subiéndose.
  const proyecto = data.data as Proyecto;
  const lista = leerTodos();
  const idx = lista.findIndex((p) => p.id === id);
  if (idx === -1) lista.unshift(proyecto);
  else lista[idx] = proyecto;
  guardarTodos(lista);
  return proyecto;
}

// ——— Operaciones que usan las pantallas ————————————————————————————————

export function crearProyecto(datos: ProyectoInput, id?: string): Proyecto {
  const nuevo: Proyecto = {
    ...datos,
    id: id ?? `p-${Date.now()}`,
    estado: "nuevo",
    creadoEn: hoy(),
  };
  guardarTodos([nuevo, ...leerTodos()]);
  // A la nube en segundo plano; cuando el proyecto queda, suben sus fotos
  // (las de un borrador no pueden subir antes que el proyecto exista).
  void empujarProyecto(nuevo).then((quedo) => {
    if (quedo) void empujarArchivosDe(nuevo.id);
  });
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
  void empujarProyecto(actualizado);
  return actualizado;
}

export function eliminarProyecto(id: string) {
  guardarTodos(leerTodos().filter((p) => p.id !== id));
  // También sus fotos, para no dejar basura ocupando espacio.
  eliminarArchivosDe(id);
  if (supabase) {
    void supabase
      .from("proyectos")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) avisarSinNube();
      });
  }
}

export function obtenerProyecto(id: string): Proyecto | undefined {
  return leerTodos().find((p) => p.id === id);
}

// ——— Hook para la LISTA de proyectos ——————————————————————————————————
// Muestra al instante lo del navegador y, si hay nube, la lista completa
// del equipo en cuanto llega.
export function useProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[] | null>(null);

  useEffect(() => {
    setProyectos(leerTodos());
    let activo = true;
    void jalarTodos().then((lista) => {
      if (activo && lista) setProyectos(lista);
    });
    return () => {
      activo = false;
    };
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
    let activo = true;
    void jalarUno(id).then((p) => {
      if (activo && p) setProyecto(p);
    });
    return () => {
      activo = false;
    };
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
