/* ==== [BLOCK: Imports] BEGIN ==== */
import React, { useMemo, useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { FormulaList } from './components/FormulaList'
import { FormulaViewer } from './components/FormulaViewer'
import { FavoritesPanel } from './components/FavoritesPanel'
import { useFormulaStore } from './core/useFormulaStore'
import { type Formula } from './core/types'
import { BookMarked, Settings } from 'lucide-react'
/* ==== [BLOCK: Imports] END ==== */


/* ==== [BLOCK: App Component] BEGIN ==== */
export default function App() {
const { allFormulas, favorites } = useFormulaStore()
const [query, setQuery] = useState('')
const [active, setActive] = useState<Formula | null>(null)


const filtered = useMemo(() => {
const q = query.trim().toLowerCase()
if (!q) return allFormulas
return allFormulas.filter(f =>
f.title.toLowerCase().includes(q) ||
f.tags?.some(t => t.toLowerCase().includes(q)) ||
Object.entries(f.variables).some(([sym, v]) =>
sym.toLowerCase().includes(q) || v.name.toLowerCase().includes(q)
)
)
}, [allFormulas, query])


return (
<div className="min-h-screen bg-coffee-bg text-txt">
{/* Header */}
<header className="sticky top-0 z-10 border-b border-line/60 backdrop-blur bg-coffee-bg/80">
<div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
<div className="text-xl font-semibold tracking-tight">Formelbase</div>
<div className="ml-auto flex items-center gap-2">
<button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-coffee-light/60 hover:bg-coffee-light text-coffee-dark">
<Settings className="w-4 h-4" /> <span>Innstillinger</span>
</button>
<button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-coffee-accent/80 hover:bg-coffee-accent text-white">
<BookMarked className="w-4 h-4" /> <span>Mine formler</span>
</button>
</div>
</div>
<div className="border-t border-line/60">
<div className="max-w-6xl mx-auto px-4 py-2">
<SearchBar value={query} onChange={setQuery} />
</div>
</div>
</header>


{/* Innhold */}
<main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
{/* Venstre: Liste */}
<aside className="md:col-span-4 lg:col-span-3">
<FormulaList
items={filtered}
activeId={active?.id || null}
onPick={setActive}
/>


<div className="mt-6">
<FavoritesPanel onPick={setActive} favorites={favorites} />
</div>
</aside>


{/* Høyre: Viewer */}
<section className="md:col-span-8 lg:col-span-9">
<FormulaViewer formula={active ?? filtered[0] ?? null} />
</section>
</main>
</div>
)
}
/* ==== [BLOCK: App Component] END ==== */
