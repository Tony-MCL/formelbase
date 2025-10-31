/* ==== [BLOCK: Imports] BEGIN ==== */
import "katex/dist/katex.min.css"
import { BlockMath } from "react-katex"
import { VariableTable } from "./VariableTable"
import type { Formula } from "@/core/types"
import { solveFor } from "@/core/useCalculator"
import { useEffect, useMemo, useState } from "react"
/* ==== [BLOCK: Imports] END ==== */

type KV = Record<string, number>

export function FormulaViewer({
  formula,
  onToggleFavorite,
  onSaveNote
}: {
  formula: Formula
  onToggleFavorite: () => void
  onSaveNote: (txt: string) => void
}) {
  const [inputs, setInputs] = useState<KV>({})
  const [target, setTarget] = useState<string>(() => {
    // default: venstresiden
    const lhs = formula.formula.split("=")[0]?.trim() ?? ""
    return lhs
  })
  const [result, setResult] = useState<string>("")

  const symbols = useMemo(() => Object.keys(formula.variables), [formula])

  useEffect(() => {
    setInputs({})
    const lhs = formula.formula.split("=")[0]?.trim() ?? ""
    setTarget(lhs)
    setResult("")
  }, [formula.id])

  useEffect(() => {
    const knowns: KV = {}
    for (const k of Object.keys(inputs)) {
      const v = inputs[k]
      if (Number.isFinite(v)) knowns[k] = v
    }
    const r = solveFor(formula.formula, target, knowns)
    if (r.ok) {
      const unit = formula.variables[target]?.unit ?? ""
      setResult(`${r.value.toPrecision(6)} ${unit}`.trim())
    } else {
      setResult("")
    }
  }, [inputs, target, formula.formula])

  return (
    <div className="panel p-4 space-y-4">
      {/* ==== [BLOCK: Header] BEGIN ==== */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{formula.title}</h2>
          <div className="text-xs text-slate-500">{formula.category} • {formula.section}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={onToggleFavorite}>
            {formula.isFavorite ? "★ Favoritt" : "☆ Favoritt"}
          </button>
        </div>
      </div>
      {/* ==== [BLOCK: Header] END ==== */}

      {/* ==== [BLOCK: Formula] BEGIN ==== */}
      <div className="px-2">
        <BlockMath math={formula.formula.replaceAll("*", "\\cdot ").replace("√3", "\\sqrt{3}")} />
      </div>
      {/* ==== [BLOCK: Formula] END ==== */}

      {/* ==== [BLOCK: Variables] BEGIN ==== */}
      <VariableTable f={formula} />
      {/* ==== [BLOCK: Variables] END ==== */}

      {/* ==== [BLOCK: Calculator] BEGIN ==== */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Input</div>
          {symbols.map(k => (
            <div key={k} className="flex items-center gap-2">
              <label className="w-24 text-sm">{k}</label>
              <input
                className="input"
                type="number"
                inputMode="decimal"
                placeholder={`Skriv verdi for ${k}`}
                value={Number.isFinite(inputs[k]) ? inputs[k] : ""}
                onChange={e => {
                  const v = e.target.value
                  setInputs(p => ({ ...p, [k]: v === "" ? NaN : Number(v) }))
                }}
              />
              <span className="text-sm text-slate-500">{formula.variables[k]?.unit ?? ""}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">Snu formel (løs for):</div>
          <select
            className="input"
            value={target}
            onChange={e => setTarget(e.target.value)}
          >
            {symbols.map(s => <option key={s} value={s}>{s}</option>)}
            {/* venstresiden kan være et navn som ikke er i variables (f.eks. P_loss) – vi inkluderer alle */}
          </select>

          <div className="panel p-3">
            <div className="text-sm text-slate-500 mb-1">Resultat</div>
            <div className="text-2xl font-semibold min-h-8">{result || "—"}</div>
            <div className="text-xs text-slate-500 mt-1">
              Automatisk kalkulasjon når nok verdier er satt. Enhetskontroll er enkel i V1 (advarsler kommer i V2).
            </div>
          </div>
        </div>
      </div>
      {/* ==== [BLOCK: Calculator] END ==== */}

      {/* ==== [BLOCK: Note] BEGIN ==== */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Notat</div>
        <textarea
          className="input min-h-24"
          placeholder="Ditt eget notat for denne formelen…"
          defaultValue={formula.userNote ?? ""}
          onBlur={e => onSaveNote(e.target.value)}
        />
      </div>
      {/* ==== [BLOCK: Note] END ==== */}

      {/* ==== [BLOCK: Examples] BEGIN ==== */}
      {formula.examples?.length ? (
        <div className="space-y-2">
          <div className="text-sm font-medium">Eksempler</div>
          <ul className="list-disc ml-6 text-sm text-slate-700 dark:text-slate-200">
            {formula.examples.map((ex, i) => (
              <li key={i}>
                <span className="font-semibold">Input:</span> {Object.entries(ex.input).map(([k,v]) => `${k}=${v}`).join(", ")} •{" "}
                <span className="font-semibold">Output:</span> {Object.entries(ex.output).map(([k,v]) => `${k}=${v}`).join(", ")}
                {ex.note ? <> • <em>{ex.note}</em></> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {/* ==== [BLOCK: Examples] END ==== */}
    </div>
  )
}
