"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ProyectoForm } from "@/components/proyectos/ProyectoForm";
import { useProyecto, type ProyectoInput } from "@/lib/proyectos-store";
import { useArchivos } from "@/lib/archivos-store";

export default function EditarProyectoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { proyecto, cargado, actualizar } = useProyecto(params.id);
  const { archivos, agregar, eliminar } = useArchivos(params.id);

  function guardar(datos: ProyectoInput) {
    actualizar(datos);
    router.push(`/proyectos/${params.id}`);
  }

  if (!proyecto) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
        >
          <ChevronLeft size={16} />
          Proyectos
        </Link>
        <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-sm text-stone-500">
          {cargado ? "Este proyecto no existe." : "Cargando…"}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/proyectos/${proyecto.id}`}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
      >
        <ChevronLeft size={16} />
        {proyecto.titulo}
      </Link>

      <h1 className="mt-3 text-xl font-medium text-stone-800">
        Editar proyecto
      </h1>
      <p className="mb-6 text-sm text-stone-500">
        Corrige o completa los datos del pedido.
      </p>

      <ProyectoForm
        inicial={proyecto}
        archivos={archivos}
        agregarArchivos={agregar}
        eliminarArchivo={eliminar}
        textoBoton="Guardar cambios"
        onGuardar={guardar}
        onCancelar={() => router.push(`/proyectos/${proyecto.id}`)}
      />
    </div>
  );
}
