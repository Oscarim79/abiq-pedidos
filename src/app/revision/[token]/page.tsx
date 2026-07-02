import { Lock } from "lucide-react";
import { obtenerEnlace, enlaceVigente } from "@/lib/mock-enlaces";
import { VisorCliente } from "@/components/visor/VisorCliente";

export default function RevisionPage({
  params,
}: {
  params: { token: string };
}) {
  const enlace = obtenerEnlace(params.token);

  if (!enlace || !enlaceVigente(enlace)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-stone-100 text-stone-400">
            <Lock size={22} />
          </div>
          <h1 className="mt-4 font-medium text-stone-800">
            Enlace no disponible
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Este enlace de revisión no existe o ya caducó. Por favor, contacta a
            tu asesor de AbiQ para que te envíe uno nuevo.
          </p>
        </div>
      </div>
    );
  }

  return <VisorCliente enlace={enlace} />;
}
