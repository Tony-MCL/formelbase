/* ==== [BLOCK: MathText] BEGIN ==== */
import React from "react"

/** Minimal, krasj-sikker renderer for formel-strenger.
 *  Vi gjør små kosmetiske bytter (·, sqrt) men ingen KaTeX.
 */
export function MathText({ expr }: { expr: string }) {
  const pretty = expr
    .replaceAll("*", " · ")
    .replace(/√\s*([A-Za-z0-9.]+)/g, "√($1)")
    .trim()

  return (
    <div className="font-mono text-lg px-2 py-1 rounded bg-slate-900/10 dark:bg-slate-100/10">
      {pretty}
    </div>
  )
}
/* ==== [BLOCK: MathText] END ==== */
