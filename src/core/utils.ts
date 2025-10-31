/* ==== [BLOCK: Helpers] BEGIN ==== */
export const debounce = <F extends (...args: any[]) => void>(fn: F, ms = 250) => {
  let t: number | undefined
  return (...args: Parameters<F>) => {
    window.clearTimeout(t)
    t = window.setTimeout(() => fn(...args), ms)
  }
}

export function tryJson<T>(raw: string, fallback: T): T {
  try { return JSON.parse(raw) as T } catch { return fallback }
}
/* ==== [BLOCK: Helpers] END ==== */
