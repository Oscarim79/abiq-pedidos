# Estado del proyecto AbiQ

_Última sesión: 20 de julio de 2026._

## Qué se hizo hoy

1. **Tiendas reales**: el formulario ahora ofrece ABIQ-Cayala, ABIQ-Oakland,
   ABIQ-Pradera y ABIQ-Chiquimula (antes eran nombres de relleno).
2. **FASE 2 COMPLETA Y PUBLICADA** 🎉 — los pedidos de las 4 tiendas ahora
   viven en un registro compartido en la nube (Supabase):
   - Pantalla de "Entrar al panel": solo entra quien tenga cuenta del equipo.
   - Cada pedido/foto/firma se guarda en la nube y en el navegador (copia
     rápida); al abrir la app bajan los pedidos de las demás tiendas.
   - Botón "Cerrar sesión" en la barra lateral y el menú móvil.
   - Probado de punta a punta y verificado en la URL pública.
3. **Seguridad verificada**: sin cuenta no se ve nada; el registro público
   de cuentas quedó cerrado (comprobado con un intento real).
4. Next.js actualizado por avisos de seguridad (sesión paralela).
5. Plan de **fase 3** ampliado a pedido de Oscar: logo de la empresa +
   cuentas/roles de diseñadora de interiores y supervisora (ella con vista
   de TODOS los proyectos).

## Decisiones tomadas

- Arquitectura "local primero": el navegador es la copia rápida, la nube el
  registro compartido. Sin internet no se pierde nada (la app avisa).
- Los 3 proyectos de ejemplo NO se suben a la nube; solo aparecen si la app
  corre sin claves de nube (`.env.local` vacío).
- Las cuentas del equipo las crea Oscar a mano en el panel de Supabase
  (registro público apagado). Los Ajustes (nº de logística, nombre del
  vendedor) siguen siendo por dispositivo.

## Qué sigue (en orden)

1. **Pendiente chico de Oscar:** borrar en Supabase → Authentication → Users
   la cuenta `prueba@abiqmuebles.com` (y `prueba.abiq.borrar.2026@gmail.com`
   si sigue ahí). Crear las cuentas reales de los vendedores si aún faltan.
2. **Logo de la empresa** en la app — falta que Oscar copie el archivo del
   logo (PNG/JPG) a esta carpeta; ponerlo es rápido.
3. **Cuentas de la diseñadora de interiores y la supervisora** — se pueden
   crear ya (hoy toda cuenta ve todos los proyectos).
4. **Fase 3 grande:** portal del cliente (ver avances, aprobar, comentar) y
   luego IA para sintetizar especificaciones.

## Cómo retomar

Abrir sesión en `D:\Proyectos\Webapp-abiq` y decir "¿en qué nos quedamos?".
La app pública: https://oscarim79.github.io/abiq-pedidos/ (publicar cambios:
`npm run deploy`). Detalle de la fase 2 en `FASE2.md`; guía de uso en
`GUIA.md`.
