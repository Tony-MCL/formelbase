/* ==== [BLOCK: Imports] BEGIN ==== */
import { create, all } from "mathjs"
/* ==== [BLOCK: Imports] END ==== */

/* ==== [BLOCK: Math Instance] BEGIN ==== */
const math = create(all, {
  number: "number",
  predictable: true
})
/* ==== [BLOCK: Math Instance] END ==== */

export type SolveResult = { ok: boolean; value: number }

/* ==== [BLOCK: Normalization Helpers] BEGIN ==== */
/** Map unicode → ASCII som mathjs forstår */
const NAME_MAP: Record<string, string> = {
  "φ": "phi",
  "Φ": "Phi",
  "ρ": "rho",
  "σ": "sigma",
  "η": "eta",
  "Δ": "Delta",
  "Ω": "Ohm" // sjelden brukt i selve uttrykket, men ok
}

/** Normaliser variabel-navn til trygge nøkler i evaluator */
function normName(name: string): string {
  let s = name.trim()
  for (const [u, ascii] of Object.entries(NAME_MAP)) {
    s = s.replaceAll(u, ascii)
  }
  // mellomrom og spesialtegn til _:
  s = s.replace(/[^\p{L}\p{N}_]/gu, "_")
  return s
}

/** Normaliser uttrykk til mathjs-vennlig form */
function normExpr(expr: string): string {
  let s = expr.trim()

  // unicode-gresk → ascii (først)
  for (const [u, ascii] of Object.entries(NAME_MAP)) {
    s = s.replaceAll(u, ascii)
  }

  // √x → sqrt(x)
  s = s.replace(/√\s*([A-Za-z0-9.]+)/g, "sqrt($1)")

  // trig med gresk phi: cosphi, sinphi
  s = s.replace(/\bcos\s*phi\b/g, "cos(phi)")
  s = s.replace(/\bsin\s*phi\b/g, "sin(phi)")
  s = s.replace(/\btan\s*phi\b/g, "tan(phi)")

  // * lar vi være; / lar vi være; ^ lar vi være (mathjs forstår)
  // sikre desimal-komma ikke sniker seg inn:
  s = s.replace(/(\d),(\d)/g, "$1.$2")

  return s
}
/* ==== [BLOCK: Normalization Helpers] END ==== */

/* ==== [BLOCK: Public API] BEGIN ==== */
/**
 * Løs enkel likning "LHS = RHS" for mål-variabel.
 * V1: Støtter robust løsning når `target` === venstresiden (LHS).
 * For andre mål-variabler returneres {ok:false} (V2 får generell snu-funksjon).
 */
export function solveFor(formula: string, target: string, knowns: Record<string, number>): SolveResult {
  try {
    // Splitt likning
    const [lhsRaw, rhsRaw] = formula.split("=")
    if (!lhsRaw || !rhsRaw) return { ok: false, value: NaN }

    const lhs = lhsRaw.trim()
    const rhs = rhsRaw.trim()

    // Kun støtt målsymbolet lik venstresiden i V1
    if (target.trim() !== lhs) {
      return { ok: false, value: NaN }
    }

    // Normaliser uttrykk for evaluator
    const rhsNorm = normExpr(rhs)

    // Bygg scope: normaliser navnene på kjente variabler
    const scope: Record<string, number> = {}
    for (const [k, v] of Object.entries(knowns)) {
      if (Number.isFinite(v)) {
        scope[normName(k)] = v as number
      }
    }

    // Erstatt også variable navn inne i RHS som kan være unicode (ΔU → DeltaU)
    // mathjs trenger at tokens i uttrykket matcher scope-nøkler:
    // Vi gjør dette ved å parse og deretter erstatte noder med rename-map.
    const node = math.parse(rhsNorm)
    const renamed = node.transform((n: any) => {
      if (n.isSymbolNode) {
        const newName = normName(n.name)
        return new (n.constructor as any)(newName)
      }
      return n
    })

    const value = renamed.evaluate(scope)
    if (typeof value === "number" && Number.isFinite(value)) {
      return { ok: true, value }
    }
    return { ok: false, value: NaN }
  } catch {
    // ALDRI kast videre – appen skal ikke knekke
    return { ok: false, value: NaN }
  }
}
/* ==== [BLOCK: Public API] END ==== */
