/* ==== [BLOCK: Imports] BEGIN ==== */
import { useEffect, useMemo, useState } from "react"
import bundled from "./formulas.json"
import type { Formula } from "./types"
import { db } from "./db"
/* ==== [BLOCK: Imports] END ==== */

/* ==== [BLOCK: Types] BEGIN ==== */
export type Filter = {
  q?: string
  category?: string
  section?: string
  tags?: string[]
}
/* ==== [BLOCK: Types] END ==== */

const normalize = (s: string) => s.normalize("NFKC").toLowerCase()

/* ==== [BLOCK: Hook] BEGIN ==== */
export function useFormulaStore() {
  const [base, setBase] = useState<Formula[]>([])
  const [userFormulas, setUserFormulas] = useState<Formula[]>([])
  const [metas, setMetas] = useState<Record<string, { isFavorite?: boolean; userNote?: string }>>({})

  // last base fra bundle
  useEffect(() => { setBase(bundled as Formula[]) }, [])

  // last brukerdata fra IndexedDB
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const u = await db.userFormulas.toArray()
      const m = await db.metas.toArray()
      if (!mounted) return
      setUserFormulas(u)
      setMetas(Object.fromEntries(m.map(x => [x.id, { isFavorite: x.isFavorite, userNote: x.userNote }])))
    })()
    return () => { mounted = false }
  }, [])

  const all: Formula[] = useMemo(() => {
    const merged = base.map(f => ({ ...f, ...metas[f.id] }))
    return [...merged, ...userFormulas]
  }, [base, userFormulas, metas])

  async function toggleFavorite(id: string) {
    const cur = metas[id]?.isFavorite ?? false
    await db.metas.put({ id, isFavorite: !cur, userNote: metas[id]?.userNote })
    setMetas(p => ({ ...p, [id]: { ...p[id], isFavorite: !cur } }))
  }

  async function saveNote(id: string, note: string) {
    await db.metas.put({ id, isFavorite: metas[id]?.isFavorite, userNote: note })
    setMetas(p => ({ ...p, [id]: { ...p[id], userNote: note } }))
  }

  async function addUserFormula(f: Formula) {
    await db.userFormulas.put({ ...f, isUserFormula: true })
    setUserFormulas(prev => [...prev.filter(x => x.id !== f.id), f])
  }

  function search(filter: Filter): Formula[] {
    const q = normalize(filter.q ?? "")
    return all.filter(f => {
      const inQ = !q || [
        f.title, f.category, f.section, f.formula, ...(f.tags ?? [])
      ].some(t => normalize(t).includes(q)) ||
        Object.values(f.variables).some(v =>
          [v.symbol, v.name, v.unit].some(x => normalize(x).includes(q))
        )
      const inCat = !filter.category || f.category === filter.category
      const inSec = !filter.section || f.section === filter.section

      // Tag-filter: alle valgte tags må finnes i f.tags (AND), eller velg OR?
      // Vi velger OR (mer brukervennlig i søk).
      const sel = filter.tags ?? []
      const inTags = sel.length === 0 || (f.tags ?? []).some(t => sel.includes(t))

      return inQ && inCat && inSec && inTags
    })
  }

  const categories = useMemo(
    () => Array.from(new Set(all.map(f => f.category))).sort(),
    [all]
  )
  const sections = useMemo(
    () => Array.from(new Set(all.map(f => f.section))).sort(),
    [all]
  )
  const allTags = useMemo(
    () => Array.from(new Set(all.flatMap(f => f.tags ?? []))).sort((a,b) => a.localeCompare(b)),
    [all]
  )

  return {
    all, categories, sections, allTags,
    search,
    toggleFavorite,
    saveNote,
    addUserFormula
  }
}
/* ==== [BLOCK: Hook] END ==== */

/* ==== [BLOCK: Default Export] BEGIN ==== */
export default useFormulaStore
/* ==== [BLOCK: Default Export] END ==== */
