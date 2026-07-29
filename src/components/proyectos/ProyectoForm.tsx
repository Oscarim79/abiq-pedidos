"use client";

import { useState } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import type { ArticuloExtra, Proyecto } from "@/lib/tipos";
import type { ProyectoInput } from "@/lib/proyectos-store";
import {
  ACABADOS,
  HERRAJES,
  MADERAS,
  TELAS,
  TIENDAS,
  TIPOS_MUEBLE,
  VETAS,
} from "@/lib/catalogo";
import { Fotos } from "@/components/proyectos/Fotos";
import type { ArchivoRef } from "@/lib/archivos-store";

// ============================================================================
//  FORMULARIO DE CAPTURA DEL PEDIDO
// ----------------------------------------------------------------------------
//  Lo usa tanto "Nuevo proyecto" como "Editar". Las opciones de los botones
//  (maderas, telas, herrajes…) se editan en src/lib/catalogo.ts.
// ============================================================================

const VACIO: ProyectoInput = {
  titulo: "",
  tipoMueble: "",
  cliente: { nombre: "", telefono: "" },
  tienda: TIENDAS[0],
  medidas: { largo: "", alto: "", profundidad: "" },
  madera: "",
  tela: "",
  color: "",
  acabado: "",
  vetas: "",
  herrajes: [],
  caracteristicas: "",
  notas: "",
  codigoArticulo: "",
  cantidad: "1",
  costo: "",
  articulosExtra: [],
};

// ——— Botones de selección rápida (una sola opción) ————————————————
function SelectorChips({
  opciones,
  valor,
  onCambio,
  permitirOtro = false,
}: {
  opciones: string[];
  valor: string;
  onCambio: (valor: string) => void;
  permitirOtro?: boolean;
}) {
  // Si el valor guardado no está en el catálogo, es un "Otro" escrito a mano.
  const [otroActivo, setOtroActivo] = useState(
    () => permitirOtro && valor.trim() !== "" && !opciones.includes(valor),
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {opciones.map((op) => {
          const activo = !otroActivo && valor === op;
          return (
            <button
              key={op}
              type="button"
              onClick={() => {
                setOtroActivo(false);
                // Volver a pulsar la opción elegida la des-selecciona.
                onCambio(activo ? "" : op);
              }}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                activo
                  ? "border-marca bg-marca-suave font-medium text-marca-oscuro"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50",
              )}
            >
              {op}
            </button>
          );
        })}
        {permitirOtro && (
          <button
            type="button"
            onClick={() => {
              // Si ya está activo, no borres lo que el vendedor escribió.
              if (otroActivo) return;
              setOtroActivo(true);
              onCambio("");
            }}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              otroActivo
                ? "border-marca bg-marca-suave font-medium text-marca-oscuro"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50",
            )}
          >
            Otro…
          </button>
        )}
      </div>
      {otroActivo && (
        <input
          autoFocus
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          placeholder="Escríbelo aquí"
          className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca sm:max-w-xs"
        />
      )}
    </div>
  );
}

// ——— Botones de selección rápida (varias opciones a la vez) ——————————
function SelectorChipsMulti({
  opciones,
  valores,
  onCambio,
}: {
  opciones: string[];
  valores: string[];
  onCambio: (valores: string[]) => void;
}) {
  function alternar(op: string) {
    onCambio(
      valores.includes(op)
        ? valores.filter((v) => v !== op)
        : [...valores, op],
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((op) => {
        const activo = valores.includes(op);
        return (
          <button
            key={op}
            type="button"
            onClick={() => alternar(op)}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              activo
                ? "border-marca bg-marca-suave font-medium text-marca-oscuro"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50",
            )}
          >
            {op}
          </button>
        );
      })}
    </div>
  );
}

// ——— Piezas pequeñas para no repetir estilos ———————————————————————
function Seccion({
  titulo,
  descripcion,
  children,
}: {
  titulo: string;
  descripcion?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="font-medium text-stone-800">{titulo}</h2>
      {descripcion && (
        <p className="mt-0.5 text-sm text-stone-500">{descripcion}</p>
      )}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Campo({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm text-stone-600">{etiqueta}</span>
      {children}
    </div>
  );
}

const claseInput =
  "w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca";

// ——— El formulario completo ————————————————————————————————————————
export function ProyectoForm({
  inicial,
  archivos,
  agregarArchivos,
  eliminarArchivo,
  textoBoton,
  onGuardar,
  onCancelar,
}: {
  inicial?: Proyecto;
  archivos: ArchivoRef[];
  agregarArchivos: (files: File[]) => void;
  eliminarArchivo: (id: string) => void;
  textoBoton: string;
  onGuardar: (datos: ProyectoInput) => void;
  onCancelar: () => void;
}) {
  const [datos, setDatos] = useState<ProyectoInput>(() =>
    inicial
      ? {
          titulo: inicial.titulo,
          tipoMueble: inicial.tipoMueble,
          cliente: { ...inicial.cliente },
          tienda: inicial.tienda,
          medidas: { ...inicial.medidas },
          madera: inicial.madera,
          tela: inicial.tela,
          color: inicial.color,
          acabado: inicial.acabado,
          vetas: inicial.vetas,
          herrajes: [...inicial.herrajes],
          caracteristicas: inicial.caracteristicas,
          notas: inicial.notas,
          // Los pedidos guardados antes de la orden de fabricación no traen
          // estos campos; se rellenan vacíos.
          codigoArticulo: inicial.codigoArticulo ?? "",
          cantidad: inicial.cantidad ?? "1",
          costo: inicial.costo ?? "",
          articulosExtra: (inicial.articulosExtra ?? []).map((a) => ({ ...a })),
        }
      : VACIO,
  );

  function set<K extends keyof ProyectoInput>(
    campo: K,
    valor: ProyectoInput[K],
  ) {
    setDatos((d) => ({ ...d, [campo]: valor }));
  }

  // ——— Artículos adicionales de la orden de fabricación ———
  const articulos = datos.articulosExtra ?? [];

  function cambiarArticulo(i: number, cambios: Partial<ArticuloExtra>) {
    const lista = articulos.map((a, j) => (j === i ? { ...a, ...cambios } : a));
    set("articulosExtra", lista);
  }

  function agregarArticulo() {
    set("articulosExtra", [
      ...articulos,
      {
        id: `a-${Date.now()}`,
        codigo: "",
        descripcion: "",
        cantidad: "1",
        costo: "",
        observaciones: "",
      },
    ]);
  }

  function quitarArticulo(i: number) {
    set(
      "articulosExtra",
      articulos.filter((_, j) => j !== i),
    );
  }

  const valido =
    datos.titulo.trim() !== "" && datos.cliente.nombre.trim() !== "";

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;
    onGuardar(datos);
  }

  // Enter dentro de un campo de texto NO debe guardar el pedido a medias;
  // para guardar está el botón de abajo.
  function evitarEnter(e: React.KeyboardEvent<HTMLFormElement>) {
    const objetivo = e.target as HTMLElement;
    if (e.key === "Enter" && objetivo.tagName === "INPUT") e.preventDefault();
  }

  return (
    <form onSubmit={enviar} onKeyDown={evitarEnter} className="space-y-5">
      <Seccion titulo="Cliente y pedido">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo etiqueta="Título del pedido *">
            <input
              autoFocus={!inicial}
              value={datos.titulo}
              onChange={(e) => set("titulo", e.target.value)}
              placeholder="Ej.: Clóset de roble a medida"
              className={claseInput}
            />
          </Campo>
          <Campo etiqueta="Tienda">
            <select
              value={datos.tienda}
              onChange={(e) => set("tienda", e.target.value)}
              className={clsx(claseInput, "bg-white")}
            >
              {TIENDAS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Campo>
          <Campo etiqueta="Nombre del cliente *">
            <input
              value={datos.cliente.nombre}
              onChange={(e) =>
                set("cliente", { ...datos.cliente, nombre: e.target.value })
              }
              placeholder="Ej.: Familia Restrepo"
              className={claseInput}
            />
          </Campo>
          <Campo etiqueta="Teléfono del cliente">
            <input
              value={datos.cliente.telefono}
              onChange={(e) =>
                set("cliente", { ...datos.cliente, telefono: e.target.value })
              }
              placeholder="Ej.: 55 1234 5678"
              className={claseInput}
            />
          </Campo>
        </div>
      </Seccion>

      <Seccion
        titulo="El mueble"
        descripcion="Tipo y medidas exactas en centímetros."
      >
        <Campo etiqueta="Tipo de mueble">
          <SelectorChips
            opciones={TIPOS_MUEBLE}
            valor={datos.tipoMueble}
            onCambio={(v) => set("tipoMueble", v)}
            permitirOtro
          />
        </Campo>
        <div className="grid grid-cols-3 gap-3 sm:max-w-md">
          {(
            [
              ["largo", "Largo (cm)"],
              ["alto", "Alto (cm)"],
              ["profundidad", "Profundidad (cm)"],
            ] as const
          ).map(([campo, etiqueta]) => (
            <Campo key={campo} etiqueta={etiqueta}>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={datos.medidas[campo]}
                onChange={(e) =>
                  set("medidas", { ...datos.medidas, [campo]: e.target.value })
                }
                placeholder="0"
                className={claseInput}
              />
            </Campo>
          ))}
        </div>
      </Seccion>

      <Seccion
        titulo="Materiales y acabados"
        descripcion="Toca una opción para elegirla; tócala otra vez para quitarla."
      >
        <Campo etiqueta="Madera">
          <SelectorChips
            opciones={MADERAS}
            valor={datos.madera}
            onCambio={(v) => set("madera", v)}
            permitirOtro
          />
        </Campo>
        <Campo etiqueta="Tela / tapizado">
          <SelectorChips
            opciones={TELAS}
            valor={datos.tela}
            onCambio={(v) => set("tela", v)}
            permitirOtro
          />
        </Campo>
        <Campo etiqueta="Acabado">
          <SelectorChips
            opciones={ACABADOS}
            valor={datos.acabado}
            onCambio={(v) => set("acabado", v)}
            permitirOtro
          />
        </Campo>
        <Campo etiqueta="Dirección de las vetas">
          <SelectorChips
            opciones={VETAS}
            valor={datos.vetas}
            onCambio={(v) => set("vetas", v)}
          />
        </Campo>
        <Campo etiqueta="Color principal">
          <input
            value={datos.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="Ej.: verde oliva, tono nogal medio…"
            className={clsx(claseInput, "sm:max-w-md")}
          />
        </Campo>
      </Seccion>

      <Seccion
        titulo="Herrajes y sistemas"
        descripcion="Puedes elegir varios."
      >
        <SelectorChipsMulti
          opciones={HERRAJES}
          valores={datos.herrajes}
          onCambio={(v) => set("herrajes", v)}
        />
      </Seccion>

      <Seccion
        titulo="Características especiales"
        descripcion="Curvas, puertas laterales, interiores lisos, divisiones…"
      >
        <textarea
          value={datos.caracteristicas}
          onChange={(e) => set("caracteristicas", e.target.value)}
          rows={3}
          placeholder="Describe todo lo que la fábrica necesita saber del diseño."
          className={clsx(claseInput, "resize-none")}
        />
        <Campo etiqueta="Notas adicionales">
          <textarea
            value={datos.notas}
            onChange={(e) => set("notas", e.target.value)}
            rows={2}
            placeholder="Fechas, presupuesto, cualquier otro detalle del cliente."
            className={clsx(claseInput, "resize-none")}
          />
        </Campo>
      </Seccion>

      <Seccion
        titulo="Orden de fabricación"
        descripcion="Código, cantidad y costo por unidad. Con esto la app arma sola la orden que se imprime para la fábrica."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Campo etiqueta="Código del artículo">
            <input
              value={datos.codigoArticulo ?? ""}
              onChange={(e) => set("codigoArticulo", e.target.value)}
              placeholder="Ej.: 220835-1"
              className={claseInput}
            />
          </Campo>
          <Campo etiqueta="Cantidad">
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={datos.cantidad ?? "1"}
              onChange={(e) => set("cantidad", e.target.value)}
              placeholder="1"
              className={claseInput}
            />
          </Campo>
          <Campo etiqueta="Costo por unidad (Q)">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={datos.costo ?? ""}
              onChange={(e) => set("costo", e.target.value)}
              placeholder="0"
              className={claseInput}
            />
          </Campo>
        </div>

        <div>
          <span className="mb-1.5 block text-sm text-stone-600">
            ¿El pedido lleva más artículos? (sillas, bancos, cojines…)
          </span>
          <div className="space-y-3">
            {articulos.map((art, i) => (
              <div
                key={art.id}
                className="rounded-lg border border-stone-200 bg-stone-50/50 p-3"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={art.codigo}
                    onChange={(e) =>
                      cambiarArticulo(i, { codigo: e.target.value })
                    }
                    placeholder="Código (ej.: 220264)"
                    className={claseInput}
                  />
                  <input
                    value={art.descripcion}
                    onChange={(e) =>
                      cambiarArticulo(i, { descripcion: e.target.value })
                    }
                    placeholder="Descripción (ej.: Silla Modern Rabat)"
                    className={claseInput}
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={art.cantidad}
                    onChange={(e) =>
                      cambiarArticulo(i, { cantidad: e.target.value })
                    }
                    placeholder="Cantidad"
                    className={claseInput}
                  />
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={art.costo}
                    onChange={(e) =>
                      cambiarArticulo(i, { costo: e.target.value })
                    }
                    placeholder="Costo por unidad (Q)"
                    className={claseInput}
                  />
                </div>
                <textarea
                  value={art.observaciones}
                  onChange={(e) =>
                    cambiarArticulo(i, { observaciones: e.target.value })
                  }
                  rows={2}
                  placeholder="Observaciones para la fábrica: tela, medidas, color…"
                  className={clsx(claseInput, "mt-3 resize-none")}
                />
                <button
                  type="button"
                  onClick={() => quitarArticulo(i)}
                  className="mt-2 flex items-center gap-1 text-xs text-stone-400 transition-colors hover:text-red-500"
                >
                  <X size={13} />
                  Quitar este artículo
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={agregarArticulo}
              className="w-full rounded-lg border border-dashed border-stone-300 px-4 py-2 text-sm text-stone-500 transition-colors hover:border-marca hover:text-marca-oscuro"
            >
              + Agregar otro artículo
            </button>
          </div>
        </div>
      </Seccion>

      <Seccion
        titulo="Fotos y referencias"
        descripcion="Las fotos que trajo el cliente, planos o bocetos. Se guardan al instante (no dependen del botón de abajo)."
      >
        <Fotos
          archivos={archivos}
          agregar={agregarArchivos}
          eliminar={eliminarArchivo}
        />
      </Seccion>

      <div className="flex items-center justify-end gap-3 pb-8">
        {!valido && (
          <p className="text-xs text-stone-400">
            Falta el título del pedido o el nombre del cliente.
          </p>
        )}
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!valido}
          className="rounded-lg bg-marca px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-marca-oscuro disabled:cursor-not-allowed disabled:opacity-50"
        >
          {textoBoton}
        </button>
      </div>
    </form>
  );
}
