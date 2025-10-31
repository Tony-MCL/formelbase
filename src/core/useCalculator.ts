/* ==== [BLOCK: Kalkulator Hook] BEGIN ==== */
import { useMemo } from 'react'
import { solveFormula } from './parser'
import type { Formula } from './types'


export type Inputs = Record<string, number | ''>


export function useCalculator(formula: Formula | null, inputs: Inputs, target: string | null) {
return useMemo(() => {
if (!formula || !target) return { result: null as number | null }
// Konverter tomme til undefined og fjern target fra known
const known: Record<string, number> = {}
for (const [k, v] of Object.entries(inputs)) {
if (k === target) continue
if (v === '' || v == null) continue
known[k] = Number(v)
}
const value = solveFormula(formula.formula, known, target)
return { result: value }
}, [formula, inputs, target])
}
/* ==== [BLOCK: Kalkulator Hook] END ==== */
