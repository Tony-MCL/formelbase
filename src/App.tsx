/* ==== [BLOCK: Imports] BEGIN ==== */
import React, { useMemo, useState } from "react"
import { SearchBar } from "./components/SearchBar"
import { FormulaList } from "./components/FormulaList"
import { FormulaViewer } from "./components/FormulaViewer"
import { FavoritesPanel } from "./components/FavoritesPanel"
import { FormulaEditor } from "./components/FormulaEditor"
import { useFormulaStore } from "./core/useFormulaStore"
import type { Formula } from "./core/types"
import "./assets/styles.css"
import { Moon, Sun, Plus } from "lucide-react"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { TagFilters } from "./components/TagFilters"
/* ==== [BLOCK: Imports] END ==== */

export default function App() {
  /* ==== [BLOCK: State] BEGIN ==== */
  const [q, setQ] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [dark, setDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  )

  const {
    all, categories, sections, allTags,
    search, toggleFavorite, saveNote, addUserFormula
  } = useFormulaStore()

  const items = useMemo(() => search({ q, tags: selectedTags }), [search, q, selectedTags])
  const [current, setCurrent] = useState<Formula | null>(null)
  /* ==== [BLOCK: State] END ==== */

  /* ==== [BLOCK: Effects/UI] BEGIN ==== */
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  React.useEffect(() => {
    if (!current && items.length) setCurrent(items[0]!)
  }, [items.length])
  /* ==== [BLOCK: Effects/UI] END ==== */

  const favorites = useMemo(() => all.filter(f => f.isFavorite), [all])

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="app-shell">
      {/* ==== [BLOCK: Topbar] BEGIN ==== */}
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="text-lg font-semibold">Formelbase</div>
          <div className="ml-auto flex items-center gap-2">
            <button className="btn" onClick={() => setDark(d => !d)}>
              {dark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4" />}
              <span className="text-sm">{dark ? "Lyst tema" : "Mørkt tema"}</span>
            </button>
            <button className="btn" onClick={() => setShowEditor(s => !s)}>
              <Plus className="w-4 h-4" />
              Ny formel
            </button>
          </div>
        </div>
      </header>
      {/* ==== [BLOCK: Topbar] END ==== */}

      {/* ==== [BLOCK: Main] BEGIN ==== */}
      <main className="max-w-6xl mx-auto px-4 py-4 grid md:grid-cols-3 gap-4">
        {/* Venstre kolonne */}
        <section className="md:col-span-1 space-y-3">
          <SearchBar onChange={setQ} />
          <TagFilters tags={allTags} selected={selectedTags} onToggle={toggleTag} />
          <FavoritesPanel items={favorites} onSelect={f => setCurrent(f)} />
          <div className="text-xs text-slate-500">
            {items.length} treff • {categories.length} kategorier • {sections.length} seksjoner
            {selectedTags.length ? ` • filter: ${selectedTags.join(", ")}` : ""}
          </div>
          <FormulaList items={items} onSelect={f => setCurrent(f)} />
        </section>

        {/* Høyre kolonne */}
        <section className="md:col-span-2 space-y-3">
          <ErrorBoundary>
            {current ? (
              <FormulaViewer
                formula={current}
                onToggleFavorite={() => {
                  toggleFavorite(current.id)
                  setCurrent({ ...current, isFavorite: !current.isFavorite })
                }}
                onSaveNote={(txt) => {
                  saveNote(current.id, txt)
                  setCurrent({ ...current, userNote: txt })
                }}
              />
            ) : (
              <div className="panel p-6 text-slate-500">Velg en formel fra listen.</div>
            )}
          </ErrorBoundary>

          {showEditor && (
            <FormulaEditor
              onSave={async (f) => {
                await addUserFormula(f)
                setShowEditor(false)
                setCurrent(f)
              }}
            />
          )}
        </section>
      </main>
      {/* ==== [BLOCK: Main] END ==== */}
    </div>
  )
}
