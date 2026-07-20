-- ============================================================================
--  BASE DE DATOS DE ABIQ EN SUPABASE (fase 2)
-- ----------------------------------------------------------------------------
--  Cómo usar este archivo (una sola vez):
--    1. Entra a tu proyecto en supabase.com
--    2. Menú izquierdo → "SQL Editor" → "New query"
--    3. Pega TODO este archivo y pulsa "Run"
--  Se puede ejecutar más de una vez sin romper nada.
-- ============================================================================

-- ——— Tabla de proyectos ————————————————————————————————————————————————
-- Cada fila es un pedido completo. La columna "data" guarda el mismo objeto
-- que la app guardaba antes en el navegador (título, cliente, medidas, firma…).
create table if not exists public.proyectos (
  id text primary key,
  data jsonb not null,
  actualizado_en timestamptz not null default now()
);

-- ——— Tabla de archivos (fotos/planos en miniatura) ————————————————————
-- Una fila por proyecto, con la lista de sus miniaturas. Si se borra el
-- proyecto, sus archivos se borran solos ("on delete cascade").
create table if not exists public.archivos (
  proyecto_id text primary key
    references public.proyectos (id) on delete cascade,
  data jsonb not null default '[]'::jsonb,
  actualizado_en timestamptz not null default now()
);

-- ——— Seguridad (Row Level Security) ————————————————————————————————————
-- Regla de la casa: SOLO quien inició sesión con una cuenta del equipo puede
-- leer o escribir. Cualquiera sin cuenta, aunque tenga el link de la app,
-- no puede ver absolutamente nada.
alter table public.proyectos enable row level security;
alter table public.archivos enable row level security;

drop policy if exists "equipo: leer proyectos" on public.proyectos;
create policy "equipo: leer proyectos"
  on public.proyectos for select to authenticated using (true);

drop policy if exists "equipo: crear proyectos" on public.proyectos;
create policy "equipo: crear proyectos"
  on public.proyectos for insert to authenticated with check (true);

drop policy if exists "equipo: editar proyectos" on public.proyectos;
create policy "equipo: editar proyectos"
  on public.proyectos for update to authenticated using (true) with check (true);

drop policy if exists "equipo: borrar proyectos" on public.proyectos;
create policy "equipo: borrar proyectos"
  on public.proyectos for delete to authenticated using (true);

drop policy if exists "equipo: leer archivos" on public.archivos;
create policy "equipo: leer archivos"
  on public.archivos for select to authenticated using (true);

drop policy if exists "equipo: crear archivos" on public.archivos;
create policy "equipo: crear archivos"
  on public.archivos for insert to authenticated with check (true);

drop policy if exists "equipo: editar archivos" on public.archivos;
create policy "equipo: editar archivos"
  on public.archivos for update to authenticated using (true) with check (true);

drop policy if exists "equipo: borrar archivos" on public.archivos;
create policy "equipo: borrar archivos"
  on public.archivos for delete to authenticated using (true);
