# AbiQ — Control de pedidos de muebles a la medida

Webapp para que el **vendedor de la tienda** capture los proyectos de sus
clientes (fotos, medidas, materiales, detalles), lleve el control de cada
pedido y lo **envíe por WhatsApp al departamento de logística** con un botón.

> **Fase actual: herramienta del vendedor (demo funcional).** Todo se guarda
> en el navegador; no necesita base de datos todavía. La siguiente fase
> (portal del cliente con avances, aprobaciones y comentarios) se construirá
> sobre esta misma base conectando Supabase.

> 📖 **¿Solo quieres usar la app?** Lee la [**Guía rápida (GUIA.md)**](GUIA.md).

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

## Qué hace la app

1. **Proyectos**: la lista de todos los pedidos, con buscador y filtros por
   estado (Nuevo → Enviado a logística → En producción → Entregado).
2. **Nuevo proyecto**: formulario de captura con botones de selección rápida
   (maderas, telas, acabados, herrajes), medidas exactas, características
   especiales, notas y fotos del cliente.
3. **Enviar a logística por WhatsApp**: arma el mensaje con todas las
   especificaciones y abre WhatsApp listo para enviar.
4. **Ficha para imprimir**: todo el pedido —fotos incluidas— en **una sola
   hoja**, lista para imprimir o guardar como PDF para la fábrica.
5. **Visto bueno**: firma del cliente o del responsable, dibujada en pantalla,
   que queda guardada en el proyecto y sale en la ficha.
6. **Ajustes**: el número de WhatsApp de logística y el nombre del vendedor.

## Si quieres editar las opciones de selección rápida

Abre el archivo `src/lib/catalogo.ts`. Ahí están las maderas, telas, acabados,
herrajes y tiendas, con instrucciones dentro. No necesitas tocar nada más.

---

## Estructura (para referencia)

```
src/
  app/
    (dashboard)/            Panel del vendedor (con barra lateral)
      proyectos/            Lista de pedidos
        nuevo/              Formulario de captura
        [id]/               Detalle del pedido (WhatsApp, estado, firma)
          editar/           Editar el pedido
          ficha/            Ficha imprimible de una sola hoja
      ajustes/              Número de logística y nombre del vendedor
  components/               Piezas reutilizables de la interfaz
  lib/                      Catálogo de opciones, almacenes y mensaje de WhatsApp
```

## Lo que viene después (fase 2)

- **Supabase**: guardado real en la nube, compartido entre computadoras, con
  cuentas del equipo (@aiqmuebles.com). El código ya está preparado
  (`src/lib/supabase/client.ts`).
- **Portal del cliente**: que el cliente vea avances, apruebe y comente.
- **IA**: escribir la descripción del mueble y que la IA devuelva la lista de
  especificaciones técnicas ya estructurada.
