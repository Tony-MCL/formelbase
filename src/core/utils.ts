/* ==== [BLOCK: Utils] BEGIN ==== */
export const fmtUnit = (n: number, unit: string) => {
if (Number.isNaN(n)) return '—'
// Enkel formattering; senere: Intl.NumberFormat + prefikser.
return `${n}${unit ? ' ' + unit : ''}`
}


export const katexWrap = (latex: string) => `\\[ ${latex} \\]`
/* ==== [BLOCK: Utils] END ==== */
