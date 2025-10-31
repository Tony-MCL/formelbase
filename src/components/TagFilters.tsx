/* ==== [BLOCK: TagFilters] BEGIN ==== */
import React from "react"

export function TagFilters({
  tags,
  selected,
  onToggle
}: {
  tags: string[]
  selected: string[]
  onToggle: (tag: string) => void
}) {
  if (!tags.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => {
        const active = selected.includes(tag)
        return (
          <button
            key={tag}
            className={`chip ${active ? "chip-active" : ""}`}
            onClick={() => onToggle(tag)}
            aria-pressed={active}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
/* ==== [BLOCK: TagFilters] END ==== */
