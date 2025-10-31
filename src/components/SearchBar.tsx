/* ==== [BLOCK: SearchBar] BEGIN ==== */
import React from 'react'
import { Search } from 'lucide-react'


export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
return (
<div className="relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lineStrong" />
<input
className="input pl-9"
placeholder="Søk etter formel, symbol eller tag…"
value={value}
onChange={e => onChange(e.target.value)}
/>
</div>
)
}
/* ==== [BLOCK: SearchBar] END ==== */
