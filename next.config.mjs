// ============================================================================
//  CONFIGURACIÓN DE NEXT.JS
// ----------------------------------------------------------------------------
//  Cuando se publica en GitHub Pages (npm run deploy) la app se genera como
//  sitio estático y vive en https://oscarim79.github.io/abiq-pedidos/.
//  En desarrollo (npm run dev) nada de esto aplica.
// ============================================================================
const enGitHubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prefijo para archivos de la carpeta public/ (ej. el logo). En GitHub
  // Pages la app no vive en la raíz del dominio, así que las imágenes
  // necesitan llevar "/abiq-pedidos" por delante.
  env: {
    NEXT_PUBLIC_BASE_PATH: enGitHubPages ? "/abiq-pedidos" : "",
  },
  ...(enGitHubPages
    ? {
        output: "export",
        basePath: "/abiq-pedidos",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
