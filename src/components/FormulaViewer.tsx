/* ==== [BLOCK: FormulaViewer] BEGIN ==== */
import { useCalculator } from '@/core/useCalculator'
import 'katex/dist/katex.min.css'
// @ts-ignore – dynamisk import for KaTeX render
import katex from 'katex'
import { VariableTable } from './VariableTable'


function Latex({ children }: { children: string }) {
const html = useMemo(() => katex.renderToString(children, { throwOnError: false }), [children])
return <div className="py-2 text-lg" dangerouslySetInnerHTML={{ __html: html }} />
}


export function FormulaViewer({ formula }: { formula: Formula | null }) {
const [inputs, setInputs] = useState<Record<string, number | ''>>({})
const [target, setTarget] = useState<string | null>(null)


const { result } = useCalculator(formula, inputs, target)


if (!formula) return <div className="text-lineStrong">Ingen formel valgt.</div>


const onChange = (k: string, v: number | '') => setInputs(s => ({ ...s, [k]: v }))


const latex = katexWrap(formula.formula.replaceAll('cosphi', '\\cos \\varphi').replaceAll('sqrt', '\\sqrt'))


const targetUnit = target ? formula.variables[target]?.unit ?? '' : ''


return (
<div className="card p-4">
<div className="text-xs text-lineStrong">{formula.category} · {formula.section}</div>
<h2 className="text-2xl font-semibold mb-1">{formula.title}</h2>


{/* Formel som LaTeX */}
<Latex>{latex}</Latex>


{/* Variabler */}
<div className="mt-4">
<VariableTable f={formula} inputs={inputs} onChange={onChange} target={target} setTarget={setTarget} />
</div>


{/* Resultat */}
<div className="mt-4 p-3 rounded-xl bg-coffee-light/20">
<div className="text-sm text-lineStrong mb-1">Resultat</div>
<div className="text-xl font-bold">
{target ? (result == null || Number.isNaN(result) ? '—' : fmtUnit(result, targetUnit)) : 'Velg mål-variabel i tabellen'}
</div>
</div>


{/* Beskrivelse/Eksempler */}
{formula.description && (
<div className="mt-4 text-sm text-lineStrong">{formula.description}</div>
)}
{formula.examples?.length ? (
<div className="mt-3 text-sm">
<div className="font-medium mb-1">Eksempel</div>
<ul className="list-disc ml-5 space-y-1">
{formula.examples.map((ex, i) => (
<li key={i}>
Input: {Object.entries(ex.input).map(([k,v])=>`${k}=${v}`).join(', ')} → Output: {Object.entries(ex.output).map(([k,v])=>`${k}=${v}`).join(', ')} {ex.note ? `(${ex.note})` : ''}
</li>
))}
</ul>
</div>
) : null}
</div>
)
}
/* ==== [BLOCK: FormulaViewer] END ==== */
