import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { PuertaEquipo } from "@/components/auth/PuertaEquipo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PuertaEquipo>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0">
          {/* Barra superior con menú, solo en móvil (la lateral se oculta ahí) */}
          <MobileNav />
          <main className="p-5 md:p-8 print:p-0">{children}</main>
        </div>
      </div>
    </PuertaEquipo>
  );
}
