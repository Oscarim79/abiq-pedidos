import { redirect } from "next/navigation";

// La página de inicio simplemente lleva al listado de proyectos.
export default function Home() {
  redirect("/proyectos");
}
