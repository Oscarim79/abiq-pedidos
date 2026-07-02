"use client";

// ============================================================================
//  MODELO 3D POR PROYECTO (demo, sin base de datos todavía)
// ----------------------------------------------------------------------------
//  Guarda el archivo .glb que subes en cada proyecto dentro del navegador,
//  usando IndexedDB (aguanta archivos grandes, a diferencia de localStorage).
//  Así puedes subirlo, verlo girando y que NO se borre al recargar.
//
//  En la fase de Supabase, el .glb irá a Supabase Storage y este archivo se
//  podrá retirar.
// ============================================================================
import { useEffect, useState } from "react";

const DB = "abiq-modelos-3d";
const STORE = "modelos";

type Registro = { nombre: string; blob: Blob };

function abrirDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGuardar(clave: string, valor: Registro): Promise<void> {
  const db = await abrirDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(valor, clave);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function idbLeer(clave: string): Promise<Registro | undefined> {
  const db = await abrirDB();
  const valor = await new Promise<Registro | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const r = tx.objectStore(STORE).get(clave);
    r.onsuccess = () => resolve(r.result as Registro | undefined);
    r.onerror = () => reject(r.error);
  });
  db.close();
  return valor;
}

async function idbBorrar(clave: string): Promise<void> {
  const db = await abrirDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(clave);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

// Hook para usar dentro de un proyecto: carga el modelo guardado al montar y
// deja subir/quitar. `url` es un enlace temporal del navegador para el visor.
export function useModelo3d(proyectoId: string) {
  const [nombre, setNombre] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    let urlActual: string | null = null;
    setCargando(true);
    idbLeer(proyectoId)
      .then((reg) => {
        if (!vivo) return;
        if (reg?.blob) {
          urlActual = URL.createObjectURL(reg.blob);
          setUrl(urlActual);
          setNombre(reg.nombre);
        } else {
          setUrl(null);
          setNombre(null);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
      if (urlActual) URL.revokeObjectURL(urlActual);
    };
  }, [proyectoId]);

  async function subir(file: File) {
    await idbGuardar(proyectoId, { nombre: file.name, blob: file });
    setUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setNombre(file.name);
  }

  async function quitar() {
    await idbBorrar(proyectoId);
    setUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setNombre(null);
  }

  return { nombre, url, tiene: nombre !== null, cargando, subir, quitar };
}
