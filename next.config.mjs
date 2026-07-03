// ============================================================================
//  CONFIGURACIÓN DE NEXT.JS
// ----------------------------------------------------------------------------
//  Cuando se publica en GitHub Pages (npm run deploy) la app se genera como
//  sitio estático y vive en https://oscarim79.github.io/abiq-pedidos/.
//  En desarrollo (npm run dev) nada de esto aplica.
// ============================================================================
const enGitHubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = enGitHubPages
  ? {
      output: "export",
      basePath: "/abiq-pedidos",
      trailingSlash: true,
    }
  : {};

export default nextConfig;
