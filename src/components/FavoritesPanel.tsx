/* ==== [BLOCK: FavoritesPanel] BEGIN ==== */
import React from 'react'
import type { Formula } from '@/core/types'


export function FavoritesPanel({ favorites, onPick }: { favorites: Formula[]; onPick: (f: Formula) => void }) {
if (!favorites.length) return (
<div className="card p-3 text-sm text-lineStrong">Ingen favoritter ennå.</div>
)
return (
<div className="card">
<div className="p-3 text-sm text-lineStrong">Favoritter</div>
<ul>
{favorites.map(f => (
<li key={f.id}>
<button className="w-full text-left px-3 py-2 hover:bg-coffee-light/30" onClick={()=>onPick(f)}>
<div className="font-medium">{f.title}</div>
<div className="text-xs text-lineStrong truncate">{f.formula}</div>
</button>
</li>
))}
</ul>
</div>
)
}
/* ==== [BLOCK: FavoritesPanel] END ==== */
