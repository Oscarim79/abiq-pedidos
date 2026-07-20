// ============================================================================
//  CONEXIÓN A SUPABASE (fase 2)
// ----------------------------------------------------------------------------
//  Lee la dirección y la llave del proyecto desde el archivo `.env.local`
//  (que NO se sube a GitHub). Mientras ese archivo esté vacío, `supabase`
//  vale null y la app sigue funcionando como hasta ahora (localStorage).
//
//  Nota: la llave "anon/publishable" está DISEÑADA para ser pública — la
//  seguridad real la ponen las reglas RLS de `supabase/schema.sql`, que solo
//  dejan entrar a quien inició sesión con una cuenta del equipo.
// ============================================================================
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

// ¿Ya está configurada la conexión? (la usan las pantallas para decidir
// si trabajan en la nube o en el navegador)
export const supabaseConfigurado = supabase !== null;
