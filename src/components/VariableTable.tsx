/* ==== [BLOCK: VariableTable] BEGIN ==== */
import React from 'react'
import type { Formula } from '@/core/types'


export function VariableTable({ f, inputs, onChange, target, setTarget }: {
f: Formula
inputs: Record<string, number | ''>
onChange: (k: string, v: number | '') => void
target: string | null
setTarget: (k: string) => void
}) {
const symbols = Object.keys(f.variables)
return (
<table className="w-full text-sm">
<thead>
<tr className="text-left text-lineStrong">
<th className="py-1">Symbol</th>
<th>Navn</th>
<th>Enhet</th>
<th>Verdi</th>
<th>Mål</th>
</tr>
</thead>
<tbody>
{symbols.map(k => {
const v = f.variables[k]
const isTarget = target === k
return (
<tr key={k} className="border-t border-line/60">
<td className="py-1 font-mono">{v.symbol || k}</td>
<td>{v.name}</td>
<td>{v.unit}</td>
<td>
<input
type="number"
className="input"
value={inputs[k] ?? ''}
onChange={e => onChange(k, e.target.value === '' ? '' : Number(e.target.value))}
disabled={isTarget}
/>
</td>
<td>
<input
type="radio"
name="target"
checked={isTarget}
onChange={() => setTarget(k)}
/>
</td>
</tr>
)
})}
</tbody>
</table>
)
}
/* ==== [BLOCK: VariableTable] END ==== */
