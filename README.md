# AbiQ — Webapp de pedidos de muebles a la medida

Plataforma interna para que el equipo de AbiQ capture requerimientos, gestione
modelos 3D con el cliente y coordine producción.

> **Fase actual: 3 — Frontend del Vendedor.** Por ahora la app funciona con
> datos de ejemplo (no necesita base de datos todavía). Conectaremos Supabase
> en la siguiente fase.

> 📖 **¿Solo quieres usar la app?** Lee la [**Guía rápida (GUIA.md)**](GUIA.md):
> cómo encenderla, crear proyectos, subir fotos y modelos 3D, y qué se guarda dónde.

---

## Cómo ver la app en tu computadora (paso a paso)

No necesitas saber programar. Solo copia y pega estos comandos.

### 1. Abre una terminal en la carpeta del proyecto

En el Explorador de Windows, entra a la carpeta `Webapp-abiq`, haz clic en la
barra de dirección, escribe `powershell` y presiona Enter.

### 2. Instala las librerías (solo la primera vez)

```powershell
npm install
```

Espera 1–2 minutos. Es normal que aparezcan muchos mensajes.

### 3. Enciende la app

```powershell
npm run dev
```

Cuando veas un mensaje como `Local: http://localhost:3000`, abre tu navegador
y entra a esa dirección: **http://localhost:3000**

### 4. Para apagar la app

En la terminal, presiona las teclas `Ctrl` + `C`.

---

## Qué puedes probar ahora

- **Listado de proyectos** (página de inicio): tres pedidos de ejemplo.
- Haz clic en un proyecto para abrir la **Captura de Requerimientos**.
- Cambia entre las dos pestañas: **Carga directa** y **Wizard consultivo**.
- En el wizard, avanza por los pasos, elige opciones y pulsa **Finalizar**
  para ver el resumen.

## Si quieres editar las preguntas del wizard

Abre el archivo `src/lib/wizard-config.ts`. Ahí están todas las preguntas y
opciones, con instrucciones dentro. No necesitas tocar nada más.

---

## Estructura (para referencia)

```
src/
  app/
    (dashboard)/        Panel interno del staff (con barra lateral)
      proyectos/        Listado y captura de requerimientos
      kanban/           Tablero CEDIs (próxima fase)
      clientes/         Directorio (próxima fase)
      ajustes/          Configuración (próxima fase)
  components/           Piezas reutilizables de la interfaz
  lib/                  Datos de ejemplo, tipos y configuración del wizard
```
