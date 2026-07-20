"use client";

// ============================================================================
//  SESIÓN DEL EQUIPO (fase 2)
// ----------------------------------------------------------------------------
//  Maneja el inicio y cierre de sesión con las cuentas del equipo (Supabase).
//  Las cuentas las crea Oscar desde el panel de Supabase; aquí solo se entra
//  con correo y contraseña. Si la nube no está configurada, nada de esto se
//  usa y la app funciona como siempre.
// ============================================================================
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Hook: ¿quién tiene la sesión iniciada en este navegador?
export function useSesion() {
  const [sesion, setSesion] = useState<Session | null>(null);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setCargado(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      setCargado(true);
    });
    const { data: escucha } = supabase.auth.onAuthStateChange((_evento, s) => {
      setSesion(s);
    });
    return () => escucha.subscription.unsubscribe();
  }, []);

  return { sesion, cargado };
}

// Intenta entrar. Devuelve null si todo salió bien, o un mensaje de error
// en español sencillo para mostrar en pantalla.
export async function iniciarSesion(
  correo: string,
  contrasena: string,
): Promise<string | null> {
  if (!supabase) return "La conexión a la nube no está configurada.";
  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });
  if (!error) return null;
  if (error.message.includes("Invalid login credentials")) {
    return "Correo o contraseña incorrectos. Revisa e intenta de nuevo.";
  }
  if (error.message.includes("Email not confirmed")) {
    return "Esta cuenta aún no está confirmada. Avísale a Oscar.";
  }
  if (error.message.toLowerCase().includes("network") || error.status === 0) {
    return "Sin conexión a internet. Revisa tu red e intenta de nuevo.";
  }
  return `No se pudo entrar: ${error.message}`;
}

export async function cerrarSesion() {
  await supabase?.auth.signOut();
}
