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
| 2 | Crear la cuenta y el proyecto en supabase.com | Oscar | ✅ Hecho (2026-07-20) |
| 3 | Ejecutar `supabase/schema.sql` en el SQL Editor de Supabase | Oscar | ✅ Hecho (verificado: tablas y RLS funcionan) |
| 4 | Copiar las 2 claves al archivo `.env.local` | Oscar | ✅ Hecho (conexión probada) |
| 5 | Pantalla de inicio de sesión + sincronización con la nube (código) | Claude | ✅ Hecho (2026-07-20) |
| 6 | Cerrar el registro público + crear las cuentas del equipo en el panel | Oscar | ✅ Hecho (registro verificado cerrado) |
| 7 | Prueba completa con cuenta real (entrar, crear pedido, verlo en la nube) | Claude | ✅ Hecho (2026-07-20, todas las pruebas pasaron) |
| 8 | Publicar y actualizar la GUIA | Claude | ✅ Hecho — **fase 2 EN VIVO** (verificado en la URL pública) |

## ✅ Fase 2 terminada (2026-07-20)

Pruebas realizadas y superadas: entrar con cuenta / rechazo sin cuenta o con
contraseña mala / crear pedido → aparece en la nube / abrir en "equipo
limpio" → el pedido baja de la nube / cambio de estado sincronizado /
eliminar → se borra también de la nube (con sus fotos) / cerrar sesión /
registro público cerrado (verificado con intento real de alta).

**Pendiente menor para Oscar:** borrar en Authentication → Users la cuenta
de prueba `prueba@abiqmuebles.com` (ya no se necesita; el archivo local con
su contraseña ya fue eliminado). Y si no lo hizo antes: borrar también
`prueba.abiq.borrar.2026@gmail.com`.

## Cómo quedó funcionando la app (fase 2)

- **Con nube configurada:** al abrir pide iniciar sesión. El navegador
  sigue siendo la copia rápida (la lista aparece al instante) y la nube es
  el registro compartido: al abrir la app se trae lo de las demás tiendas.
  La primera vez, los pedidos reales que ya estaban en ese navegador se
  suben solos (los 3 de ejemplo no se suben).
- **Sin nube configurada** (`.env.local` vacío): la app funciona como la
  fase 1, solo en ese navegador, con los ejemplos de demostración.
- Si falla el internet al guardar: el cambio queda en el dispositivo y la
  app avisa una sola vez (aviso-nube.ts).

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
