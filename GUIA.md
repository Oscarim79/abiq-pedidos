# Guía rápida de AbiQ

_Guía sencilla para usar la app. Actualizada: 2 de julio de 2026._

---

## ⚠️ Lo más importante de entender

Hoy AbiQ es una **demo que funciona de verdad**, pero **todo se guarda solo en
tu navegador** (todavía no hay base de datos en internet). Esto significa:

- Los proyectos, fotos y firmas que creas **se quedan en este equipo y este navegador**.
- Si abres la app en otra computadora, **no aparecerán ahí**.
- Si borras los datos del navegador, se pierden.

👉 El guardado **real y compartido** (en la nube, entre dispositivos, con
usuarios del equipo) llega en la siguiente fase grande: **conectar Supabase**.

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
2. Llena el formulario. Casi todo es **tocar botones**: madera, tela, acabado,
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

## 🚧 Lo que viene después (fase 2)

- **Supabase**: guardado en la nube, compartido entre el equipo, con cuentas
  @aiqmuebles.com.
- **Portal del cliente**: que el cliente vea avances, apruebe y comente.
- **IA**: escribir la descripción y que la IA devuelva las especificaciones
  técnicas ya ordenadas.

---

## 📁 Dónde se guarda cada cosa (referencia técnica)

No necesitas esto para usar la app, pero por si acaso:

- **Proyectos, fotos, firmas y ajustes:** `localStorage` del navegador.
- **Opciones de los botones (maderas, telas…):** `src/lib/catalogo.ts` —
  editable con instrucciones dentro.
- **Formato del mensaje de WhatsApp:** `src/lib/whatsapp.ts`.
