/* ==== [BLOCK: Imports] BEGIN ==== */
import { create, all, MathJsStatic } from "mathjs"
/* ==== [BLOCK: Imports] END ==== */

/* ==== [BLOCK: Math Instance] BEGIN ==== */
const math = create(all, { number: "number", matrix: "matrix" }) as MathJsStatic
/* ==== [BLOCK: Math Instance] END ==== */

/* ==== [BLOCK: API] BEGIN ==== */
export type CalcResult =
  | { ok: true; value: number }
  | { ok: false; error: string }

/** Evaluér høyresiden gitt knowns, f.eks. "I * R" */
function evalExpr(expr: string, scope: Record<string, number>): number {
  const compiled = math.compile(expr)
  return compiled.evaluate(scope) as number
}

/** Løs for en variabel ved numerisk nullpunkt: f(x) = LHS(x)-RHS(x) */
export function solveFor(equation: string, target: string, knowns: Record<string, number>): CalcResult {
  // Forvent "A = B"
  const [lhs, rhs] = equation.split("=").map(s => s.trim())
  if (!lhs || !rhs) return { ok: false, error: "Ugyldig likning (mangler =)." }

  const scope = { ...knowns }

  // Hvis målet er direkte på venstresiden, prøv direkte isolering ved substitusjon:
  // Eks: "U = I * R" og target "U" -> evaluer RHS
  if (lhs === target) {
    try {
      const value = evalExpr(rhs, scope)
      if (!Number.isFinite(value)) return { ok: false, error: "Uendelig/NaN i beregning." }
      return { ok: true, value }
    } catch (e: any) {
      return { ok: false, error: "Klarte ikke evaluere uttrykket." }
    }
  }

  // Generisk: finn x slik at lhs(scope[x=val]) == rhs(scope[x=val])
  const f = (x: number) => {
    const s = { ...scope, [target]: x }
    const vl = evalExpr(lhs, s)
    const vr = evalExpr(rhs, s)
    return vl - vr
  }

  // Grovt søk etter brakkett
  let a = 1e-6, b = 1
  // Skaler opp til vi får fortegnsskifte eller rimelig ramme
  for (let i = 0; i < 30; i++) {
    const fa = f(a), fb = f(b)
    if (Math.sign(fa) !== Math.sign(fb) && Number.isFinite(fa) && Number.isFinite(fb)) break
    a /= 10
    b *= 10
  }

  // Bisection
  let fa = f(a), fb = f(b)
  if (!(Number.isFinite(fa) && Number.isFinite(fb))) {
    return { ok: false, error: "Fikk ikke gyldig startintervall." }
  }
  if (Math.sign(fa) === Math.sign(fb)) {
    // Siste forsøk: Newton fra b
    let x = b
    for (let i = 0; i < 50; i++) {
      const y = f(x)
      const d = (f(x + 1e-6) - y) / 1e-6
      if (Math.abs(d) < 1e-12) break
      x = x - y / d
      if (!Number.isFinite(x)) break
    }
    const y = f(x)
    if (Number.isFinite(x) && Math.abs(y) < 1e-6) return { ok: true, value: x }
    return { ok: false, error: "Klarte ikke løse likningen numerisk." }
  }
  for (let i = 0; i < 80; i++) {
    const m = 0.5 * (a + b)
    const fm = f(m)
    if (Math.abs(fm) < 1e-9) return { ok: true, value: m }
    if (Math.sign(fa) !== Math.sign(fm)) { b = m; fb = fm } else { a = m; fa = fm }
  }
  return { ok: true, value: 0.5 * (a + b) }
}
/* ==== [BLOCK: API] END ==== */
