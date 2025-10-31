/* ==== [BLOCK: Imports] BEGIN ==== */
import katex from "katex"
import "katex/dist/katex.min.css"
import React from "react"
/* ==== [BLOCK: Imports] END ==== */

export function SafeMath({ math }: { math: string }) {
  // Liten normalisering for typiske blandinger av tekst/LaTeX
  const normalized = math
    .replaceAll("*", "\\cdot ")
    .replaceAll("√", "\\sqrt{")  // "√3" -> "\sqrt{3" + "}" under
    .replaceAll("\\sqrt{3", "\\sqrt{3}") // lukker tilfeller over
    .replaceAll(" / ", " \\over ") // mild forbedring for brøker uten \frac

  try {
    const html = katex.renderToString(normalized, {
      throwOnError: true,
      strict: "warn",
      displayMode: true
    })
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  } catch {
    // Fallback: vis formelen som monospaced tekst, så ingenting krasjer
    return (
      <div className="font-mono text-lg px-2 py-1 rounded bg-slate-900/20 dark:bg-slate-100/10">
        {math}
      </div>
    )
  }
}
