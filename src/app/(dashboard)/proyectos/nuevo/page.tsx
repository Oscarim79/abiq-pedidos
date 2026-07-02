"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ProyectoForm } from "@/components/proyectos/ProyectoForm";
import { crearProyecto, type ProyectoInput } from "@/lib/proyectos-store";
import { eliminarArchivosDe, useArchivos } from "@/lib/archivos-store";

export default function NuevoProyectoPage() {
  const router = useRouter();
  // Generamos el id desde ahora para que las fotos que se suban durante la
  // captura queden ligadas al proyecto cuando se guarde.
  const [borradorId] = useState(() => `p-${Date.now()}`);
  const { archivos, agregar, eliminar } = useArchivos(borradorId);

  function guardar(datos: ProyectoInput) {
    crearProyecto(datos, borradorId);
    router.push(`/proyectos/${borradorId}`);
  }

  function cancelar() {
    // Limpia las fotos que se subieron para este borrador que no se guardó.
    eliminarArchivosDe(borradorId);
    router.push("/proyectos");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/proyectos"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
      >
        <ChevronLeft size={16} />
        Proyectos
      </Link>

      <h1 className="mt-3 text-xl font-medium text-stone-800">
        Nuevo proyecto
      </h1>
      <p className="mb-6 text-sm text-stone-500">
        Captura todo lo que el cliente pidió: fotos, medidas, materiales y
        detalles.
      </p>

      <ProyectoForm
        archivos={archivos}
        agregarArchivos={agregar}
        eliminarArchivo={eliminar}
        textoBoton="Crear proyecto"
        onGuardar={guardar}
        onCancelar={cancelar}
      />
    </div>
  );
}
