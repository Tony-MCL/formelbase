/* ==== [BLOCK: Imports] BEGIN ==== */
import type { Formula } from "@/core/types"
import { useMemo, useState } from "react"
/* ==== [BLOCK: Imports] END ==== */

const empty: Formula = {
  id: "",
  title: "",
  category: "Elkraft",
  section: "Egendefinerte",
  formula: "X = a * b",
  variables: {
    X: { symbol: "X", name: "Resultat", unit: "-" },
    a: { symbol: "a", name: "Parameter a", unit: "-" },
    b: { symbol: "b", name: "Parameter b", unit: "-" }
  },
  description: "",
  tags: []
}

export function FormulaEditor({ onSave }: { onSave: (f: Formula) => void }) {
  const [data, setData] = useState<Formula>(empty)
  const valid = useMemo(() => !!data.id && !!data.title && data.formula.includes("="), [data])

  return (
    <div className="panel p-4 space-y-3">
      <div className="text-lg font-semibold">Ny formel</div>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-sm">ID (unik)</span>
          <input className="input" placeholder="f.eks. my-formula-1"
            value={data.id} onChange={e => setData({ ...data, id: e.target.value.trim() })}/>
        </label>

        <label className="space-y-1">
          <span className="text-sm">Tittel</span>
          <input className="input" placeholder="Navn på formelen"
            value={data.title} onChange={e => setData({ ...data, title: e.target.value })}/>
        </label>

        <label className="space-y-1">
          <span className="text-sm">Kategori</span>
          <input className="input" value={data.category}
            onChange={e => setData({ ...data, category: e.target.value })}/>
        </label>

        <label className="space-y-1">
          <span className="text-sm">Seksjon</span>
          <input className="input" value={data.section}
            onChange={e => setData({ ...data, section: e.target.value })}/>
        </label>
      </div>

      <label className="space-y-1 block">
        <span className="text-sm">Formel (LaTeX/tekst – må inneholde ‘=’)</span>
        <input className="input" value={data.formula}
          onChange={e => setData({ ...data, formula: e.target.value })}/>
      </label>

      <label className="space-y-1 block">
        <span className="text-sm">Beskrivelse (valgfritt)</span>
        <textarea className="input min-h-24" value={data.description ?? ""}
          onChange={e => setData({ ...data, description: e.target.value })}/>
      </label>

      <div className="flex items-center gap-2">
        <button
          className="btn"
          disabled={!valid}
          onClick={() => valid && onSave(data)}
        >Lagre formel</button>
        {!valid && <span className="text-xs text-slate-500">Fyll inn ID, tittel og en likning med ‘=’</span>}
      </div>
    </div>
  )
}
