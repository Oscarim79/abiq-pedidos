# Fase 2: pedidos compartidos entre las 4 tiendas (Supabase)

_Iniciada: 20 de julio de 2026._

## ¿Qué vamos a lograr?

Hoy cada navegador guarda sus propios pedidos (como libretas separadas).
Al terminar esta fase, todos los pedidos de **ABIQ-Cayala, ABIQ-Oakland,
ABIQ-Pradera y ABIQ-Chiquimula** se guardarán en **una base de datos en
internet** (Supabase), y:

- Oscar verá los pedidos de todas las tiendas desde su computadora.
- Cada vendedor entrará con **su cuenta** (correo y contraseña).
- Nadie sin cuenta podrá ver nada, aunque tenga el link de la app.

## El plan, por pasos

| # | Paso | Quién | Estado |
|---|------|-------|--------|
| 1 | Preparar el código base (librería, conexión, plano de la base de datos) | Claude | ✅ Hecho |
| 2 | Crear la cuenta y el proyecto en supabase.com | **Oscar** | ⬜ Pendiente |
| 3 | Ejecutar `supabase/schema.sql` en el SQL Editor de Supabase | **Oscar** (copiar y pegar) | ⬜ Pendiente |
| 4 | Copiar las 2 claves al archivo `.env.local` | **Oscar** | ⬜ Pendiente |
| 5 | Pantalla de inicio de sesión + crear las cuentas del equipo | Claude (con Oscar) | ⬜ Pendiente |
| 6 | Conectar proyectos, fotos y firmas a la nube (adiós libretas separadas) | Claude | ⬜ Pendiente |
| 7 | Probar todo, publicar y actualizar la GUIA | Claude | ⬜ Pendiente |

## La tarea de Oscar (pasos 2 a 4, unos 10 minutos)

1. **Crear la cuenta:** entra a **https://supabase.com** → "Start your project"
   → regístrate (puedes usar tu cuenta de GitHub `Oscarim79`, es lo más fácil).
2. **Crear el proyecto:** botón "New project" →
   - Nombre: `abiq`
   - Database password: inventa una contraseña fuerte y **guárdala en tu
     gestor de contraseñas** (casi nunca se vuelve a usar, pero no se puede
     recuperar).
   - Región: `East US (North Virginia)` (la más cercana a Guatemala).
   - Plan: **Free** (gratis, más que suficiente para empezar).
3. **Crear las tablas:** menú izquierdo → **SQL Editor** → "New query" →
   abre el archivo `supabase/schema.sql` de esta carpeta, copia TODO su
   contenido, pégalo ahí y pulsa **Run**. Debe decir "Success".
4. **Copiar las claves:** menú izquierdo → **Project Settings** → **API** →
   copia estos dos valores al archivo `.env.local` de esta carpeta (ábrelo
   con el Bloc de notas; ya tiene instrucciones adentro):
   - "Project URL"
   - la llave "anon public" (en paneles nuevos se llama "publishable")

   ⚠️ **Nunca pegues claves en el chat de Claude** — van solo en `.env.local`.
   ⚠️ La llave **service_role no se copia a ningún lado**: esa sí es secreta.

5. Cuando termines, abre una sesión y di: **"listo, seguimos con Supabase"**.
   Claude conecta la app, crea la pantalla de inicio de sesión contigo y
   prueba todo antes de publicar.

## Notas técnicas (para Claude en la próxima sesión)

- `src/lib/supabase.ts` exporta `supabase` (null si `.env.local` está vacío)
  y `supabaseConfigurado`. Mientras sea null, la app sigue 100% en
  localStorage — ningún cambio de esta fase rompe la versión publicada.
- Esquema: tabla `proyectos` (id text, data jsonb = objeto `Proyecto`
  completo) y tabla `archivos` (proyecto_id, data jsonb = lista de
  `ArchivoRef`), espejo exacto de las claves de localStorage
  (`abiq.proyectos.v2` y `abiq.archivos.<id>.v1`). RLS: solo `authenticated`.
- Autenticación planeada: email+contraseña, **sin registro público**
  (desactivar signups en Authentication → Sign In / Up); Oscar crea las
  cuentas del equipo desde el panel (Authentication → Users → Add user).
- Al conectar: reemplazar internals de `proyectos-store.ts`,
  `archivos-store.ts` y `ajustes-store.ts` (el nombre del vendedor puede
  seguir siendo local por navegador; decidir con Oscar). Migrar los pedidos
  locales existentes de Oscar a la nube en el primer inicio de sesión.
- El deploy sigue igual (`npm run deploy` desde la máquina de Oscar, que ya
  tiene `.env.local`); la llave anon queda visible en el JS publicado y eso
  es correcto por diseño (la protección real es RLS).
