# Guía rápida de AbiQ

_Guía sencilla para usar la app. Actualizada: 20 de julio de 2026 (fase 2)._

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
2. **Tu nombre**: sale en el mensaje y en la ficha, para que logística sepa a
   quién preguntarle.

---

## 🗂️ Capturar un pedido

1. Entra a **Proyectos** y pulsa **"Nuevo proyecto"**.
2. Llena el formulario. Primero elige tu **tienda** (ABIQ-Cayala, ABIQ-Oakland,
   ABIQ-Pradera o ABIQ-Chiquimula). Casi todo lo demás es **tocar botones**: madera, tela, acabado,
   dirección de vetas, herrajes… Si el cliente pide algo que no está en la
   lista, toca **"Otro…"** y escríbelo.
3. Escribe las **medidas exactas** en centímetros (largo, alto, profundidad).
4. En **Características especiales** describe lo que la fábrica necesita saber:
   curvas, puertas laterales, interiores lisos, divisiones…
5. **Arrastra las fotos** que trajo el cliente (o toca el recuadro para
   elegirlas). Acepta JPG, PNG y PDF.
6. Pulsa **"Crear proyecto"**.

---

## 📲 Enviar el pedido a logística

Dentro del proyecto, pulsa el botón verde **"Enviar a logística por WhatsApp"**:

- Se abre WhatsApp con el mensaje **ya escrito** con todas las especificaciones.
- Solo revisa y pulsa enviar.
- El proyecto pasa solo al estado **"Enviado a logística"**.

> 📷 **Las fotos no viajan solas**: WhatsApp no permite adjuntarlas
> automáticamente. Adjúntalas en el mismo chat, o mejor: imprime la **ficha**
> como PDF (ver abajo) y mándala en el chat — ahí van las fotos incluidas.

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
- **Logo de la empresa**: la app ya está preparada (desde el 21 de julio).
  Solo falta el archivo: guarda el logo como `logo.png` dentro de la carpeta
  `public` del proyecto (`Webapp-abiq\public\logo.png`) y publica con
  `npm run deploy`. Aparecerá solo en la pantalla de entrada, la barra
  lateral, el menú del celular y la ficha imprimible. Si el archivo es JPG
  u otro formato, pásaselo a Claude y él lo convierte. Mientras no exista
  el archivo, se sigue viendo la marca provisional de siempre.
- **Nuevos roles del equipo**: cuentas para la **diseñadora de interiores**
  y la **supervisora**. La supervisora debe tener visibilidad de TODOS los
  proyectos — importante si algún día se limita la vista de los vendedores
  a su propia tienda. (Nota: hoy cualquier cuenta ya ve todos los proyectos,
  así que sus cuentas se pueden crear desde ya — ver "Cuentas del equipo".)
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
