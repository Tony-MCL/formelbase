/* ==== [BLOCK: Parser/Kalkulator] BEGIN ==== */
import { create, all } from 'mathjs'
const math = create(all, {})


/**
* Evaluer uttrykk ved å injisere verdier for kjente variabler.
* Formler skrives som "VENSTRE = HOYRE". Vi kan beregne direkte når
* målet er på venstresiden, ellers løser vi numerisk med root-finding.
*/
export function solveFormula(
formula: string,
known: Record<string, number>,
target: string
): number | null {
// Normaliser: bytt cosphi -> cosphi, sqrt(3) støttes av mathjs.
const expr = formula.replace(/\s+/g, '')
const [left, right] = expr.split('=')


// Direkte-case: target er venstre side og er et enkelt symbol
if (left === target) {
const scope: Record<string, number> = { ...known, sqrt: Math.sqrt, cos: Math.cos }
try {
return math.evaluate(right, scope)
} catch { return null }
}


// Ellers: numerisk løsning for f(x) = left - right = 0, der x=target
const vars = new Set(Array.from(expr.matchAll(/[a-zA-Z]+/g)).map(m => m[0]))
if (!vars.has(target)) return null


const f = (x: number) => {
const scope: Record<string, number> = { ...known, [target]: x, sqrt: Math.sqrt, cos: Math.cos }
try { return math.evaluate(left, scope) - math.evaluate(right, scope) }
catch { return Number.NaN }
}


// En enkel robust søk: binærsøk over et bredt intervall.
// TODO: smartere intervall/NR-metode senere.
let lo = -1e6, hi = 1e6
let flo = f(lo), fhi = f(hi)
// Sikre fortegnsskifte – ekspander hvis likt fortegn
let expand = 0
while (Math.sign(flo) === Math.sign(fhi) && expand < 12) {
lo *= 2; hi *= 2; expand++
flo = f(lo); fhi = f(hi)
}
if (Math.sign(flo) === Math.sign(fhi)) return null


for (let i = 0; i < 80; i++) {
const mid = (lo + hi) / 2
const fm = f(mid)
if (!Number.isFinite(fm)) return null
if (Math.abs(fm) < 1e-9) return mid
if (Math.sign(fm) === Math.sign(flo)) { lo = mid; flo = fm } else { hi = mid; fhi = fm }
}
return (lo + hi) / 2
}
/* ==== [BLOCK: Parser/Kalkulator] END ==== */
