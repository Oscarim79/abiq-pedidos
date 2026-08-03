# Guía rápida de AbiQ

_Guía sencilla para usar la app. Actualizada: 29 de julio de 2026 (orden de
fabricación)._

---

## 🌐 Ver la app en internet (para compartir)

La app está publicada aquí — este es el enlace para mandarle a los vendedores:

**https://oscarim79.github.io/abiq-pedidos/**

- Funciona en celular y computadora, sin instalar nada.
- **Desde la fase 2, los pedidos son compartidos:** todos los que entran con
  una cuenta del equipo ven **el mismo registro** — los pedidos de
  ABIQ-Cayala, ABIQ-Oakland, ABIQ-Pradera y ABIQ-Chiquimula juntos.
- Para entrar hace falta **una cuenta del equipo** (correo y contraseña).
  Las cuentas las creas tú (ver "Cuentas del equipo" abajo). Sin cuenta,
  nadie puede ver nada, aunque tenga el enlace.
- El código del proyecto en GitHub es público (necesario para que la página
  gratuita funcione). No contiene contraseñas ni datos de clientes.

## 👤 Cuentas del equipo (las creas tú)

Las cuentas se manejan en **supabase.com** → tu proyecto `abiq` →
**Authentication** → **Users**:

- **Crear una cuenta:** botón **Add user** → **Create new user** → escribe
  correo y contraseña → **marca la casilla "Auto Confirm User"** (sin eso no
  podrán entrar) → Create.
- **Borrar una cuenta** (ej. si alguien deja el equipo): en la lista de
  Users, menú de tres puntos → **Delete user**. Deja de poder entrar al
  instante.
- **Contraseña olvidada:** lo más simple es borrar esa cuenta y crearla de
  nuevo con una contraseña nueva (los pedidos no se pierden: no pertenecen
  a la cuenta, son del equipo).
- ⚠️ **NO uses "Send password recovery"** (el correo de resetear
  contraseña): ese enlace lleva a `localhost:3000` (no funciona) y además
  la app aún no tiene pantalla para escribir la contraseña nueva. Usa el
  método de arriba (borrar y crear de nuevo). Si algún día se quiere el
  reseteo por correo, hay que pedirle a Claude esa pantalla y cambiar la
  "Site URL" en Supabase → Authentication → URL Configuration.
- ⚠️ La opción **"Allow new users to sign up"** (en Sign In / Providers)
  debe quedarse **APAGADA** siempre: es lo que impide que extraños se creen
  cuentas.

### Publicar cambios nuevos en la página

Cuando la app cambie y quieras que el enlace muestre la versión nueva, en la
terminal (dentro de la carpeta `Webapp-abiq`) escribe:

```
npm run deploy
```

O simplemente pídele a Claude: "publica la página".

---

## ⚠️ Lo más importante de entender

Desde la fase 2, **los pedidos se guardan en la nube** (Supabase) y se
comparten entre todas las tiendas:

- Cada pedido, foto y firma se guarda en la base de datos en internet **y**
  en el navegador (copia rápida, para que la lista abra al instante).
- Si se va el internet en la tienda, el pedido **no se pierde**: queda en el
  dispositivo y la app avisa; al volver a abrir y guardar con internet, sube.
- Al abrir la app se traen los pedidos de las demás tiendas. Si estás con la
  app abierta y otra tienda captura algo, **recarga la página** para verlo.
- Los cambios de estado (nuevo → enviado → en producción → entregado)
  también se comparten: todos ven lo mismo.

---

## ▶️ Cómo encender la app

1. Abre el Explorador de Windows en la carpeta `Webapp-abiq`.
2. Haz clic en la barra de dirección, escribe `powershell` y presiona Enter.
3. Escribe esto y presiona Enter:

   ```
   npm run dev
   ```

4. Cuando veas `Local: http://localhost:3000`, abre el navegador en
   **http://localhost:3000**.
5. **Deja esa ventana abierta** mientras uses la app.

### Para apagarla
En esa ventana, presiona `Ctrl` + `C`.

### ❗ Si te sale "ERR_CONNECTION_REFUSED"
Significa que el servidor está **apagado** (se cerró la ventana o el equipo).
No se pierde nada: solo vuelve a abrir la terminal y escribe `npm run dev`.

---

## 🧭 Primer paso: configura los Ajustes

Entra a **Ajustes** (barra lateral) y guarda:

1. **El WhatsApp de logística**: con código de país, sin espacios ni signos
   (ejemplo para México: `5215512345678`). Así el botón verde abre el chat
   directo con ese contacto.
2. **Tu nombre**: con él se rellena solo el campo **Vendedor** de cada pedido
   nuevo que captures en este aparato (y se puede cambiar en el formulario si
   atendió otra persona).

---

## 🗂️ Capturar un pedido

1. Entra a **Proyectos** y pulsa **"Nuevo proyecto"**.
2. Llena el formulario. Primero elige tu **tienda** (ABIQ-Cayala, ABIQ-Oakland,
   ABIQ-Pradera o ABIQ-Chiquimula) y revisa el campo **Vendedor** (se rellena
   solo con el nombre de Ajustes; cámbialo si atendió otra persona — ese
   nombre sale como **Asesor** en la orden de fabricación). Casi todo lo
   demás es **tocar botones**: madera, tela, acabado,
   dirección de vetas, herrajes… Si el cliente pide algo que no está en la
   lista, toca **"Otro…"** y escríbelo.
3. Escribe las **medidas exactas** en centímetros (largo, alto, profundidad).
4. En **Características especiales** describe lo que la fábrica necesita saber:
   curvas, puertas laterales, interiores lisos, divisiones…
5. En **Orden de fabricación** escribe el **código del artículo**, la
   **cantidad** y el **costo por unidad** (en quetzales). Si el pedido lleva
   más piezas (sillas, bancos, cojines…), pulsa **"+ Agregar otro artículo"**
   y captura cada una con su código, cantidad, costo y observaciones.
6. **Arrastra las fotos** que trajo el cliente (o toca el recuadro para
   elegirlas). Acepta JPG, PNG y PDF.
7. Pulsa **"Crear proyecto"**.

---

## 📲 Enviar el pedido a logística

**Lo que logística recibe por WhatsApp es la orden de fabricación en PDF.**
El camino, dentro del proyecto:

1. Pulsa **"Orden de fabricación"** y revisa la hoja.
2. Pulsa **"Imprimir / Guardar PDF"** y en el diálogo elige **"Guardar como
   PDF"**.
3. Pulsa **"Enviar por WhatsApp"** (ahí mismo, junto al de imprimir): se abre
   el chat con el mensaje ya escrito — cliente, artículos, total y el
   aviso de que la orden va adjunta.
4. **Adjunta en el chat el PDF** que acabas de guardar (y las fotos de
   referencia) y pulsa enviar.

- El proyecto pasa solo al estado **"Enviado a logística"**.
- El botón verde de la pantalla del pedido abre el mismo chat con el mismo
  mensaje, por si ya tienes el PDF guardado de antes.

> 📎 **El PDF y las fotos se adjuntan a mano**: WhatsApp no deja que la app
> los adjunte automáticamente. El mensaje te lo recuerda ("Adjunto la orden…")
> para que no se te pase.

---

## 🏭 La orden de fabricación (nueva, julio 2026)

Dentro del proyecto, pulsa **"Orden de fabricación"**. La app arma **sola** el
documento que usa la fábrica — igual al formato en papel (como la OC3029):

- **El número de orden (OC) va en blanco a propósito**: es el correlativo que
  lleva logística, así que la hoja sale con la línea "OC ____" vacía para que
  ellos escriban su número. La app no inventa el suyo.
- **Tabla de artículos** con código, cantidad, costo, subtotal y total.
- **Tapiz / Observaciones se llena solo** con todo lo capturado: medidas,
  madera, tela, color, acabado, vetas, herrajes y características especiales.
- Las **Notas** del pedido salen arriba como aviso **IMPORTANTE** (ej. "este
  sofá se va para El Salvador…").
- La **cláusula de conformidad** y la **firma del cliente** (la del "Visto
  bueno") van al pie, con su nombre.
- Pulsa **"Imprimir / Guardar PDF"** para imprimirla o guardarla, y **"Enviar
  por WhatsApp"** para mandarla a logística (pasos en la sección de arriba).

---

## 🖨️ La ficha de una sola hoja

Dentro del proyecto, pulsa **"Ficha para imprimir"**:

- Es el documento final para la fábrica: **todo el pedido en una sola hoja**,
  con especificaciones, fotos y firma.
- Pulsa **"Imprimir / Guardar PDF"**. En el diálogo elige tu impresora, o
  **"Guardar como PDF"** para mandarla por WhatsApp o correo.

---

## ✍️ El visto bueno (firma)

Dentro del proyecto, en la tarjeta **"Visto bueno"**:

1. El cliente (o el responsable) **firma con el dedo** en la tableta/celular,
   o con el mouse en la computadora.
2. Escribe el nombre de quien firma y pulsa **"Guardar visto bueno"**.
3. La firma queda guardada y **sale en la ficha impresa** — protege la orden.

---

## 🔄 El estado de cada pedido

En la tarjeta **"Estado del pedido"** puedes cambiarlo tocando un botón:

**Nuevo → Enviado a logística → En producción → Entregado** (o Cancelado)

En la lista de Proyectos puedes **filtrar por estado** y **buscar** por nombre
del mueble o del cliente.

---

## 🚧 Lo que viene después (fase 3)

- ✅ ~~Supabase: guardado en la nube compartido entre el equipo~~ — **hecho**
  (fase 2, julio 2026).
- ✅ ~~Logo de la empresa~~ — **hecho** (21 de julio de 2026): el logo
  ABI·Q aparece en la pantalla de entrada, la barra lateral, el menú del
  celular y la ficha imprimible. El archivo vive en `public\logo.png`;
  para cambiarlo algún día, basta reemplazar ese archivo y publicar.
- **Nuevos roles del equipo**: por ahora solo usa la app el **jefe de
  tienda** que recibe los pedidos (ya tiene su cuenta). Cuando se sumen
  vendedores, la **diseñadora de interiores** o la **supervisora**, sus
  cuentas se crean en un minuto — ver "Cuentas del equipo" arriba. La
  supervisora debe tener visibilidad de TODOS los proyectos — importante
  si algún día se limita la vista de los vendedores a su propia tienda
  (hoy cualquier cuenta ya ve todos los proyectos).
- **Portal del cliente**: que el cliente vea avances, apruebe y comente.
- **IA**: escribir la descripción y que la IA devuelva las especificaciones
  técnicas ya ordenadas.

---

## 📁 Dónde se guarda cada cosa (referencia técnica)

No necesitas esto para usar la app, pero por si acaso:

- **Proyectos, fotos y firmas:** en la nube (Supabase, proyecto `abiq`) y
  copia rápida en el `localStorage` del navegador.
- **Ajustes (número de logística y nombre del vendedor):** solo en el
  navegador de cada dispositivo — cada vendedor configura el suyo una vez.
- **Claves de conexión a la nube:** archivo `.env.local` (solo en tu
  computadora; no sube a GitHub). Sin él, `npm run deploy` publicaría la
  app desconectada de la nube.
- **Plano de la base de datos:** `supabase/schema.sql`.
- **Opciones de los botones (maderas, telas…):** `src/lib/catalogo.ts` —
  editable con instrucciones dentro.
- **Formato del mensaje de WhatsApp:** `src/lib/whatsapp.ts`.
- **Estado de la fase 2:** `FASE2.md`.
