"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Check, RotateCcw } from "lucide-react";
import {
  wizardConfig,
  type CampoWizard,
} from "@/lib/wizard-config";

type Respuestas = Record<string, string | string[]>;

export function WizardConsultivo() {
  const [paso, setPaso] = useState(0);
  const [completado, setCompletado] = useState(false);
  const [respuestas, setRespuestas] = useState<Respuestas>({});

  const total = wizardConfig.length;
  const pasoActual = wizardConfig[paso];
  const progreso = Math.round(((paso + 1) / total) * 100);

  function setValor(campoId: string, valor: string | string[]) {
    setRespuestas((prev) => ({ ...prev, [campoId]: valor }));
  }

  function alternarMultiple(campoId: string, valor: string) {
    setRespuestas((prev) => {
      const actuales = Array.isArray(prev[campoId])
        ? (prev[campoId] as string[])
        : [];
      const nuevos = actuales.includes(valor)
        ? actuales.filter((v) => v !== valor)
        : [...actuales, valor];
      return { ...prev, [campoId]: nuevos };
    });
  }

  function reiniciar() {
    setPaso(0);
    setCompletado(false);
    setRespuestas({});
  }

  if (completado) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <Check size={24} />
        </div>
        <h3 className="mt-3 font-medium text-stone-800">
          Requerimientos capturados
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Estas respuestas quedarían guardadas en el proyecto (se conectará a la
          base de datos en la siguiente fase).
        </p>
        <pre className="mt-4 overflow-auto rounded-lg bg-stone-50 p-3 text-left text-xs text-stone-600">
          {JSON.stringify(respuestas, null, 2)}
        </pre>
        <button
          onClick={reiniciar}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-stone-200 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50"
        >
          <RotateCcw size={15} />
          Empezar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      {/* Progreso */}
      <div className="mb-1 flex items-center justify-between text-xs text-stone-500">
        <span>
          Paso {paso + 1} de {total}
        </span>
        <span>{progreso}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full bg-marca transition-all"
          style={{ width: `${progreso}%` }}
        />
      </div>

      {/* Encabezado del paso */}
      <div className="mt-4">
        <h3 className="font-medium text-stone-800">{pasoActual.titulo}</h3>
        <p className="text-sm text-stone-500">{pasoActual.descripcion}</p>
      </div>

      {/* Campos del paso */}
      <div className="mt-4 space-y-5">
        {pasoActual.campos.map((campo) => (
          <Campo
            key={campo.id}
            campo={campo}
            valor={respuestas[campo.id]}
            onUnica={(v) => setValor(campo.id, v)}
            onMultiple={(v) => alternarMultiple(campo.id, v)}
            onTexto={(v) => setValor(campo.id, v)}
          />
        ))}
      </div>

      {/* Navegación */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setPaso((p) => Math.max(0, p - 1))}
          disabled={paso === 0}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-stone-600 disabled:opacity-40 enabled:hover:bg-stone-50"
        >
          <ChevronLeft size={16} />
          Atrás
        </button>

        {paso < total - 1 ? (
          <button
            onClick={() => setPaso((p) => Math.min(total - 1, p + 1))}
            className="inline-flex items-center gap-1 rounded-lg bg-marca px-4 py-2 text-sm font-medium text-white hover:bg-marca-oscuro"
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => setCompletado(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Check size={16} />
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
}

function Campo({
  campo,
  valor,
  onUnica,
  onMultiple,
  onTexto,
}: {
  campo: CampoWizard;
  valor: string | string[] | undefined;
  onUnica: (valor: string) => void;
  onMultiple: (valor: string) => void;
  onTexto: (valor: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">
        {campo.etiqueta}
      </label>
      {campo.ayuda && (
        <p className="mb-2 text-xs text-stone-400">{campo.ayuda}</p>
      )}

      {campo.tipo === "opcion-unica" && (
        <div className="flex flex-wrap gap-2">
          {campo.opciones?.map((op) => (
            <button
              key={op.valor}
              onClick={() => onUnica(op.valor)}
              className={clsx(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                valor === op.valor
                  ? "border-marca bg-marca-suave text-marca-oscuro"
                  : "border-stone-200 text-stone-600 hover:bg-stone-50",
              )}
            >
              {op.etiqueta}
            </button>
          ))}
        </div>
      )}

      {campo.tipo === "opcion-multiple" && (
        <div className="flex flex-wrap gap-2">
          {campo.opciones?.map((op) => {
            const activo = Array.isArray(valor) && valor.includes(op.valor);
            return (
              <button
                key={op.valor}
                onClick={() => onMultiple(op.valor)}
                className={clsx(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  activo
                    ? "border-marca bg-marca-suave text-marca-oscuro"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50",
                )}
              >
                {op.etiqueta}
              </button>
            );
          })}
        </div>
      )}

      {campo.tipo === "texto" && (
        <textarea
          rows={2}
          placeholder={campo.placeholder}
          value={typeof valor === "string" ? valor : ""}
          onChange={(e) => onTexto(e.target.value)}
          className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
        />
      )}

      {campo.tipo === "numero" && (
        <input
          type="number"
          placeholder={campo.placeholder}
          value={typeof valor === "string" ? valor : ""}
          onChange={(e) => onTexto(e.target.value)}
          className="w-40 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-marca focus:ring-1 focus:ring-marca"
        />
      )}

      {campo.tipo === "color" && (
        <input
          type="color"
          value={typeof valor === "string" ? valor : "#1f6f5c"}
          onChange={(e) => onTexto(e.target.value)}
          className="h-10 w-16 cursor-pointer rounded-lg border border-stone-200"
        />
      )}
    </div>
  );
}
