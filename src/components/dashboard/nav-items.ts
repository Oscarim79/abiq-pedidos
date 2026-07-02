import { LayoutGrid, Columns3, Users, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Elementos de navegación compartidos entre la barra lateral (escritorio) y el
// menú móvil. Manténlos en un solo lugar para que no se desincronicen.
export type NavItem = {
  href: string;
  etiqueta: string;
  icono: LucideIcon;
};

export const navItems: NavItem[] = [
  { href: "/proyectos", etiqueta: "Proyectos", icono: LayoutGrid },
  { href: "/kanban", etiqueta: "Kanban (CEDIs)", icono: Columns3 },
  { href: "/clientes", etiqueta: "Clientes", icono: Users },
  { href: "/ajustes", etiqueta: "Ajustes", icono: Settings },
];
