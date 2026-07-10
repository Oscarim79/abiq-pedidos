# AbiQ — captura de pedidos de muebles a medida

Webapp para que el **vendedor** capture pedidos de muebles a medida en tienda: formulario con chips, ficha imprimible de una página, firma del cliente y botón de WhatsApp a logística. La versión actual es el "reset" del 2026-07-02, basado en la reunión real con el vendedor (la v1 con vista 3D y wizard se descartó por decisión del CEO).

- **Stack:** Next.js 14. **Datos SOLO en localStorage** — cada navegador ve sus propios pedidos; el vendedor NO ve los datos que Oscar cargó. Tenerlo presente antes de "compartir" datos o prometer sincronización.
- **Publicado en GitHub Pages:** https://oscarim79.github.io/abiq-pedidos/ (repo público `Oscarim79/abiq-pedidos`). Para publicar cambios: `npm run deploy` (export estático + gh-pages), o la skill `publicar-pages`. El export usa rutas con query params (`?id=`) y `basePath` bajo `GITHUB_PAGES=true`.
- **`GUIA.md`** es la guía de uso para Oscar en español sencillo — actualízala cuando cambie algo que él opera.
- Oscar no es técnico: explica en sencillo y verifica los cambios en el navegador antes de darlos por hechos.

## Comandos

```bash
npm install
npm run dev      # desarrollo local
npm run deploy   # publicar a GitHub Pages
```
