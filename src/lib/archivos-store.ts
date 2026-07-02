"use client";

// ============================================================================
//  ARCHIVOS POR PROYECTO (demo, sin base de datos todavía)
// ----------------------------------------------------------------------------
//  Guarda las fotos/planos que arrastras o subes en cada proyecto, dentro del
//  navegador (localStorage). Las imágenes se reducen a una miniatura pequeña
//  antes de guardarlas para no llenar el almacenamiento.
//
//  En la fase de Supabase, los archivos reales irán a Supabase Storage y este
//  archivo se podrá retirar.
// ============================================================================
import { useEffect, useState } from "react";

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
    // Si el navegador se queda sin espacio, seguimos mostrándolas en pantalla
    // aunque no se guarden. No rompemos nada.
  }
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

// Hook para usar dentro de un proyecto: lee lo guardado al montar y deja
// agregar/eliminar archivos, persistiendo en el navegador.
export function useArchivos(proyectoId: string) {
  const [archivos, setArchivos] = useState<ArchivoRef[]>([]);

  useEffect(() => {
    setArchivos(leer(proyectoId));
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
      return actualizado;
    });
  }

  function eliminar(id: string) {
    setArchivos((prev) => {
      const actualizado = prev.filter((a) => a.id !== id);
      guardar(proyectoId, actualizado);
      return actualizado;
    });
  }

  return { archivos, agregar, eliminar };
}
