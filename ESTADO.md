# Estado del proyecto AbiQ

_Última sesión: 3 de agosto de 2026._

## Qué se hizo hoy (3 de agosto)

1. **ORDEN DE FABRICACIÓN PUBLICADA** 🎉 — se resolvió el pendiente de la
   sesión pasada y la app pública ya tiene todo lo del 29 de julio.
2. **`.env.local` recuperado sin molestar a Oscar**: las 2 claves de la nube
   son las "públicas" (viajan dentro de la propia página), así que Claude las
   extrajo del JS de la página publicada, recreó el archivo y comprobó contra
   Supabase que siguen vigentes (respuesta 200 del servicio de cuentas).
   El archivo NO se sube a GitHub (`.gitignore` lo excluye).
3. Publicado con `npm run deploy` y verificado en la URL pública: pantalla de
   "Entrar al panel" activa (conexión a la nube OK) y la hoja
   `/proyectos/orden` ya existe en línea.
4. **Nada pendiente en Supabase**: no hubo que tocar el panel de Supabase.
5. **WhatsApp = la orden de fabricación** (aclaración de Oscar): lo que
   logística recibe por WhatsApp es la orden en PDF, no un resumen del
   pedido. Cambios (publicados y verificados en la página pública):
   - El mensaje ahora es el acompañante de la orden: "ORDEN DE FABRICACIÓN
     OC____" + cliente/tienda/vendedor, aviso IMPORTANTE, artículos con
     total y "📎 Adjunto la orden de fabricación … en PDF" (ya no dice
     "ficha", y el detalle fino viaja dentro del PDF).
   - La hoja de la orden tiene botón verde "Enviar por WhatsApp" junto a
     "Imprimir / Guardar PDF" — flujo: guardar PDF → abrir chat → adjuntar.
     También marca el pedido como "Enviado a logística" al primer envío.
   - El botón verde del detalle sigue, con recordatorio de adjuntar el PDF;
     si el pedido no tenía folio, se le asigna al enviar.
   - GUIA.md al día (sección "Enviar el pedido a logística" reescrita).
   - Para probar sin cuenta: nueva config `abiq-local` en
     `.claude/launch.json` (corre la app sin claves de nube → modo local
     con ejemplos). Probado ahí: mensaje sin costos y con costos
     (Q13,000 + 2×Q900 = Q14,800 ✔) y cambio de estado automático.
6. **El vendedor ahora se guarda EN el pedido** (pedido por Oscar: no salía
   en la orden). Antes el "Asesor" de la orden tomaba el nombre de los
   Ajustes del aparato que la imprimía (vacío o equivocado). Ahora:
   - Campo "Vendedor (quien atiende el pedido)" en el formulario, que se
     rellena solo con el nombre de Ajustes al capturar un pedido nuevo
     (editable si atendió otra persona).
   - Ese nombre sale como "Asesor" en la orden, como "Vendedor" en la
     ficha, en el detalle y en el mensaje de WhatsApp. Los pedidos viejos
     (sin el dato) siguen usando el nombre de Ajustes como respaldo.
   - Probado en modo local (prioridad correcta: pedido gana a Ajustes) y
     publicado + verificado en la página pública.

## Sesión anterior (29 de julio)

1. **ORDEN DE FABRICACIÓN AUTOMÁTICA** 🏭 — el gerente de logística pidió
   que la app genere la orden de fabricación con los datos capturados.
   Se analizó una orden real (`OC3029 CARLOS ANTONIO CALDERON LOPEZ.pdf`,
   que queda solo en la carpeta local — los PDF ya no suben a GitHub porque
   el repo es público y traen datos de clientes reales) y se replicó su
   formato:
   - Formulario: nueva sección "Orden de fabricación" (código del artículo,
     cantidad, costo por unidad en Q, y artículos adicionales con sus
     propias observaciones — ej. las 4 sillas que acompañan un sofá).
   - **Folio automático**: consecutivo OC3030, OC3031… asignado al crear el
     pedido (los pedidos viejos lo reciben al abrir el documento). Arranca
     en `FOLIO_INICIO = 3030` (editable en `src/lib/catalogo.ts` si el
     papel ya va más adelante).
   - Nueva hoja imprimible `/proyectos/orden`: encabezado con folio, fecha,
     tienda, cliente y asesor; aviso IMPORTANTE (las notas del pedido);
     tabla código/descripción/cantidad/costo/subtotal/tapiz-observaciones/
     foto (las observaciones del mueble principal se arman solas con las
     especificaciones + características); total; cláusula de conformidad
     (texto de las órdenes en papel) y nombre + firma del cliente.
   - Detalle del pedido: botón "Orden de fabricación", folio en el
     encabezado y tarjeta resumen con artículos y total.
   - WhatsApp: el mensaje ahora lleva folio, artículos y total.
   - Verificado en el navegador de punta a punta (captura → detalle →
     orden → WhatsApp) reproduciendo la OC3029: Q13,000 + 4×Q900 = Q16,600 ✔.
2. ⚠️ NO SE PUBLICÓ ese día por falta de `.env.local` — **resuelto el 3 de
   agosto** (ver arriba).

## Sesión anterior (21 de julio)

1. **LOGO OFICIAL PUBLICADO** 🎉 — Oscar pasó las 2 variantes del logo
   ABI·Q; se usó la negra (fondo transparente, recortada) porque las
   pantallas son claras. Aparece en la pantalla de entrada, la barra
   lateral, el menú del celular y la ficha imprimible. Publicado con
   `npm run deploy` y verificado en la URL pública en vivo. El archivo
   queda en `public\logo.png` (la variante blanca, por si se necesita
   sobre fondo oscuro, quedó guardada en `images\logo-blanco-fondo-negro.jpeg`).
2. **Cuentas al día**: Oscar borró las cuentas de prueba en Supabase.
   Decisión: por ahora solo usa la app el **jefe de tienda** que recibe
   los pedidos (ya tiene su cuenta). Las cuentas de vendedores,
   diseñadora y supervisora se crearán cuando se necesiten.
3. **Contraseña de Oscar renovada**: el correo de "resetear contraseña"
   de Supabase no sirve (lleva a localhost y la app no tiene pantalla
   para eso) — se resolvió borrando y recreando su cuenta, y quedó
   advertido en GUIA.md. Si algún día se quiere el reseteo por correo,
   es una mini-mejora que puede hacer Claude.

## Sesión anterior (20 de julio)

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

1. **Cuentas nuevas cuando se necesiten** (vendedores, diseñadora,
   supervisora): las crea Oscar en Supabase — pasos en GUIA.md, sección
   "Cuentas del equipo".
2. **Fase 3 grande:** portal del cliente (ver avances, aprobar, comentar) y
   luego IA para sintetizar especificaciones. Oscar la retomará **cuando
   tenga tiempo para enfocarse en ella** — antes de programar hay que
   decidir juntos cómo entra el cliente a ver su pedido.

## Cómo retomar

Abrir sesión en `C:\Proyectos\abiq-pedidos` y decir "¿en qué nos quedamos?".
La app pública: https://oscarim79.github.io/abiq-pedidos/ (publicar cambios:
`npm run deploy`). Detalle de la fase 2 en `FASE2.md`; guía de uso en
`GUIA.md`.
