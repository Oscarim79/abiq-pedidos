# Guía rápida de AbiQ

_Guía sencilla para usar la app. Actualizada: 23 de junio de 2026._

---

## ⚠️ Lo más importante de entender

Hoy AbiQ es una **demo que funciona de verdad**, pero **todo se guarda solo en tu
navegador** (todavía no hay base de datos en internet). Esto significa:

- Los proyectos, fotos y modelos 3D que creas **se quedan en este equipo y este navegador**.
- Si abres la app en otra computadora, **no aparecerán ahí**.
- Si borras los datos del navegador, se pierden.

👉 El guardado **real y compartido** (en la nube, entre dispositivos, con usuarios)
llega en la siguiente fase grande: **conectar Supabase**.

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

## 🧭 Moverte por la app

- En pantalla **ancha**: la barra lateral izquierda (Proyectos, Kanban, Clientes, Ajustes).
- En pantalla **angosta** o con zoom alto: usa el botón **☰** arriba a la derecha.

---

## 🗂️ Crear un proyecto

1. Entra a **Proyectos** y pulsa **"Nuevo proyecto"**.
2. Escribe el título del mueble, el cliente y elige la tienda.
3. Pulsa **"Crear proyecto"**. Aparece en la lista y se abre su página.

---

## 🖼️ Subir fotos del cliente

Dentro de un proyecto, en la pestaña **"Carga directa"**:

- **Arrastra** las fotos sobre el recuadro punteado, **o** haz clic en él (o en el botón **+**)
  para elegirlas.
- Acepta **JPG, PNG y PDF**.
- Pasa el cursor sobre una foto y pulsa la **✕** para quitarla.

---

## 🛋️ Subir el modelo 3D

- El botón **"Subir modelo 3D"** acepta **solo archivos `.glb` o `.gltf`**
  (los formatos 3D de la web).
- Para probar al instante, pulsa **"Ver modelo de ejemplo"**: carga una silla de muestra
  que puedes **rotar** (arrastrando) y acercar (rueda del ratón).

### Sobre archivos `.max` (3ds Max)
Un `.max` **no se puede usar en la web** — es un archivo del programa 3ds Max.
Hay que **exportarlo a `.glb`** primero (en 3ds Max: _Archivo → Exportar → glTF Binary (.glb)_).
Ese `.glb` sí lo puedes subir.

---

## 🚧 Lo que todavía falta

- El botón **"Guardar borrador"** aún no guarda los datos editados (medidas, madera, notas…).
- **Siguiente fase grande — Supabase:** guardado real en la nube, inicio de sesión del equipo,
  y que los enlaces de revisión del cliente funcionen de verdad.

---

## 📁 Dónde se guarda cada cosa (referencia técnica)

No necesitas esto para usar la app, pero por si acaso:

- **Proyectos y fotos:** `localStorage` del navegador.
- **Modelos 3D:** `IndexedDB` del navegador (aguanta archivos grandes).
- **Modelo de ejemplo:** `public/silla-ejemplo.glb`.

Cuando conectemos Supabase, todo esto pasará a guardarse en la nube.
