// ============================================================================
//  CONEXIÓN A SUPABASE (lado navegador) — listo para la siguiente fase.
// ----------------------------------------------------------------------------
//  Por ahora la app guarda todo en el navegador (src/lib/proyectos-store.ts) y
//  este archivo NO se utiliza todavía. En la fase del portal del cliente
//  crearemos el proyecto en Supabase, pondremos las claves en ".env.local" y
//  empezaremos a usar esta función.
// ============================================================================
import { createClient } from "@supabase/supabase-js";

export function crearClienteSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan las claves de Supabase. Copia .env.local.example a .env.local y complétalas.",
    );
  }

  return createClient(url, anonKey);
}
