import { Search } from "lucide-react"
import { useState } from "react"

export function SearchBar(props: { onChange: (q: string) => void }) {
  const [value, setValue] = useState("")
  return (
    <div className="panel p-2 flex items-center gap-2">
      <Search className="w-5 h-5 opacity-70" />
      <input
        className="input"
        placeholder="Søk etter tittel, variabel, nøkkelord…"
        value={value}
        onChange={e => {
          const v = e.target.value
          setValue(v)
          props.onChange(v)
        }}
      />
    </div>
  )
}
