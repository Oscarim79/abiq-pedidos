"use client";

// ============================================================================
//  PUERTA DEL EQUIPO (fase 2)
// ----------------------------------------------------------------------------
//  Envuelve toda la app. Si la nube está configurada y nadie ha iniciado
//  sesión, muestra la pantalla de entrada en lugar del panel. Si la nube NO
//  está configurada (.env.local vacío), deja pasar directo: la app funciona
//  como antes, solo en este navegador.
// ============================================================================
import { useState } from "react";
import { LogoEmpresa } from "@/components/LogoEmpresa";
import { supabaseConfigurado } from "@/lib/supabase";
import { iniciarSesion, useSesion } from "@/lib/sesion";

export function PuertaEquipo({ children }: { children: React.ReactNode }) {
  const { sesion, cargado } = useSesion();

  if (!supabaseConfigurado) return <>{children}</>;
  if (!cargado) {
    return (
      <div className="grid min-h-screen place-items-center bg-stone-50 text-sm text-stone-400">
        Cargando…
      </div>
    );
  }
  if (sesion) return <>{children}</>;
  return <PantallaIngreso />;
}

function PantallaIngreso() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const mensaje = await iniciarSesion(correo.trim(), contrasena);
    if (mensaje) {
      setError(mensaje);
      setEnviando(false);
    }
    // Si no hubo error, la sesión cambia sola y la puerta se abre.
  }

  return (
    <div className="grid min-h-screen place-items-center bg-stone-50 p-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <LogoEmpresa variante="portada" />
        </div>

        <form
          onSubmit={entrar}
          className="space-y-4 rounded-xl border border-stone-200 bg-white p-5"
        >
          <div>
            <h1 className="text-base font-medium text-stone-800">
              Entrar al panel
            </h1>
            <p className="text-sm text-stone-500">
              Usa la cuenta del equipo que te dieron.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Correo
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ej.: cayala@aiqmuebles.com"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-marca px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-marca-oscuro disabled:opacity-60"
          >
            {enviando ? "Entrando…" : "Entrar"}
          </button>

          <p className="text-xs text-stone-400">
            ¿Sin cuenta o contraseña olvidada? Pídele a Oscar que te la cree o
            la cambie.
          </p>
        </form>
      </div>
    </div>
  );
}
