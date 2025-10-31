/* ==== [BLOCK: Imports] BEGIN ==== */
import katex from "katex"
import "katex/dist/katex.min.css"
import React from "react"
/* ==== [BLOCK: Imports] END ==== */

/* ==== [BLOCK: Helpers] BEGIN ==== */
const GREEK_MAP: Record<string, string> = {
  "α": "\\alpha",
  "β": "\\beta",
  "γ": "\\gamma",
  "δ": "\\delta",
  "Δ": "\\Delta",
  "ε": "\\epsilon",
  "η": "\\eta",
  "θ": "\\theta",
  "λ": "\\lambda",
  "μ": "\\mu",
  "π": "\\pi",
  "φ": "\\varphi",
  "Φ": "\\Phi",
  "ρ": "\\rho",
  "σ": "\\sigma",
  "ω": "\\omega",
  "Ω": "\\Omega"
}

/** Konverter “vanlig tekst”-formel → trygg LaTeX for KaTeX */
function normalizeToLatex(src: string): string {
  let s = src.trim()

  // 1) Erstatt unicode greske symboler med LaTeX
  for (const [u, ltx] of Object.entries(GREEK_MAP)) {
    s = s.replaceAll(u, ltx)
  }

  // 2) Punkt: * → \cdot
  s = s.replaceAll("*", " \\cdot ")

  // 3) Kvadratrøtter: "√x" / "√ 3" → "\sqrt{x}"
  s = s.replace(/√\s*([A-Za-z0-9\\.]+)/g, (_m, g1) => `\\sqrt{${g1}}`)

  // 4) Delestreker skrevet som " / " → brøk (en enkel heuristikk)
  // NB: vi gjør IKKE alt til brøk; det kan bli “for smart”.
  // Vi lar KaTeX ta seg av vanlige /, men rydder litt ved mellomrom:
  s = s.replace(/\s*\/\s*/g, " / ")

  // 5) Trig-funksjoner: cos, sin, tan → \cos, \sin, \tan
  s = s.replace(/\bcos\b/g, "\\cos")
       .replace(/\bsin\b/g, "\\sin")
       .replace(/\btan\b/g, "\\tan")

  // 6) Rom mellom symbol og eksponent for lesbarhet, lar KaTeX håndtere ^ :
  // (ingen endring nødvendig, men beholdes som kommentar om vi trenger senere)

  return s
}
/* ==== [BLOCK: Helpers] END ==== */

/* ==== [BLOCK: Component] BEGIN ==== */
export function SafeMath({ math }: { math: string }) {
  const normalized = normalizeToLatex(math)

  try {
    const html = katex.renderToString(normalized, {
      throwOnError: false,     // Viktig: aldri kast til React (unngå blank skjerm)
      strict: "ignore",        // Vær snill med litt “ugyldig” LaTeX
      displayMode: true,
      errorColor: "#ef4444"
    })
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  } catch {
    // Hvis noe helt uventet skjer, fall tilbake til ren tekst
    return (
      <div className="font-mono text-lg px-2 py-1 rounded bg-slate-900/20 dark:bg-slate-100/10">
        {math}
      </div>
    )
  }
}
/* ==== [BLOCK: Component] END ==== */
