"use client";

// ============================================================================
//  ARCHIVOS POR PROYECTO (navegador + nube)
// ----------------------------------------------------------------------------
//  Guarda las fotos/planos que arrastras o subes en cada proyecto. Las
//  imágenes se reducen a una miniatura pequeña antes de guardarlas.
//
//  Desde la fase 2: el navegador (localStorage) es la copia rápida local y,
//  si la nube está configurada, cada cambio se sube también a Supabase para
//  que las demás tiendas vean las mismas fotos.
// ============================================================================
import { useEffect, useState } from "react";
import { avisarSinEspacio } from "@/lib/aviso-espacio";
import { avisarSinNube } from "@/lib/aviso-nube";
import { supabase } from "@/lib/supabase";

export type ArchivoRef = {
  id: string;
  nombre: string;
  tipo: "imagen" | "documento";
  miniatura?: string; // data URL reducida (solo imágenes)
};

const MAX_LADO = 480; // px de la miniatura guardada

function clave(proyectoId: string) {
  return `abiq.archivos.${proyectoId}.v1`;
}

function leer(proyectoId: string): ArchivoRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(clave(proyectoId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ArchivoRef[]) : [];
  } catch {
    return [];
  }
}

function guardar(proyectoId: string, lista: ArchivoRef[]) {
  try {
    window.localStorage.setItem(clave(proyectoId), JSON.stringify(lista));
  } catch {
    // El navegador bloqueó el guardado (casi siempre: espacio lleno).
    avisarSinEspacio();
  }
}

// Borra TODAS las fotos de un proyecto (se usa al eliminar el proyecto o al
// cancelar uno nuevo, para no dejar basura ocupando espacio).
export function eliminarArchivosDe(proyectoId: string) {
  try {
    window.localStorage.removeItem(clave(proyectoId));
  } catch {
    // Sin permiso de localStorage no hay nada que borrar.
  }
  // En la nube: si el proyecto se borra, sus archivos caen solos (cascade);
  // esto cubre el caso del borrador cancelado. Ignoramos errores a propósito.
  void supabase?.from("archivos").delete().eq("proyecto_id", proyectoId);
}

// ——— Sincronización con la nube ————————————————————————————————————————
// Sube la lista local de archivos de un proyecto. Si el proyecto todavía no
// existe en la nube (fotos de un borrador sin guardar), falla en silencio:
// `empujarProyecto` la vuelve a subir en cuanto el proyecto se crea.
export async function empujarArchivosDe(proyectoId: string) {
  if (!supabase) return;
  const { error } = await supabase.from("archivos").upsert({
    proyecto_id: proyectoId,
    data: leer(proyectoId),
    actualizado_en: new Date().toISOString(),
  });
  // 23503 = el proyecto aún no existe en la nube (borrador). Es esperado.
  if (error && error.code !== "23503") avisarSinNube();
}

// Trae de la nube la lista de archivos de un proyecto (si existe allá) y la
// deja también en el navegador. Devuelve null si no hay nube o no hay fila.
async function jalarArchivosDe(proyectoId: string): Promise<ArchivoRef[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("archivos")
    .select("data")
    .eq("proyecto_id", proyectoId)
    .maybeSingle();
  if (error) {
    avisarSinNube();
    return null;
  }
  if (!data) return null;
  const lista = Array.isArray(data.data) ? (data.data as ArchivoRef[]) : [];
  guardar(proyectoId, lista);
  return lista;
}

// Reduce una imagen a una miniatura JPEG pequeña usando un canvas.
function miniaturaDeImagen(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > MAX_LADO) {
        height = Math.round((height * MAX_LADO) / width);
        width = MAX_LADO;
      } else if (height > MAX_LADO) {
        width = Math.round((width * MAX_LADO) / height);
        height = MAX_LADO;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      URL.revokeObjectURL(url);
      if (!ctx) return reject(new Error("sin canvas"));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("no se pudo leer la imagen"));
    };
    img.src = url;
  });
}

async function refsDesdeArchivos(files: File[]): Promise<ArchivoRef[]> {
  const salida: ArchivoRef[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const id = `a-${Date.now()}-${i}`;
    if (file.type.startsWith("image/")) {
      try {
        const miniatura = await miniaturaDeImagen(file);
        salida.push({ id, nombre: file.name, tipo: "imagen", miniatura });
      } catch {
        salida.push({ id, nombre: file.name, tipo: "imagen" });
      }
    } else {
      salida.push({ id, nombre: file.name, tipo: "documento" });
    }
  }
  return salida;
}

// Hook para usar dentro de un proyecto: muestra al instante lo del navegador
// y, si hay nube, trae la versión compartida en cuanto llega.
export function useArchivos(proyectoId: string) {
  const [archivos, setArchivos] = useState<ArchivoRef[]>([]);

  useEffect(() => {
    setArchivos(leer(proyectoId));
    let activo = true;
    void jalarArchivosDe(proyectoId).then((lista) => {
      if (activo && lista) setArchivos(lista);
    });
    return () => {
      activo = false;
    };
  }, [proyectoId]);

  async function agregar(files: File[]) {
    const validos = files.filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );
    if (validos.length === 0) return;
    const nuevos = await refsDesdeArchivos(validos);
    setArchivos((prev) => {
      const actualizado = [...prev, ...nuevos];
      guardar(proyectoId, actualizado);
      void empujarArchivosDe(proyectoId);
      return actualizado;
    });
  }

  function eliminar(id: string) {
    setArchivos((prev) => {
      const actualizado = prev.filter((a) => a.id !== id);
      guardar(proyectoId, actualizado);
      void empujarArchivosDe(proyectoId);
      return actualizado;
    });
  }

  return { archivos, agregar, eliminar };
}
