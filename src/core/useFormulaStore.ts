/* ==== [BLOCK: Store] BEGIN ==== */
import Dexie, { Table } from 'dexie'
import coreData from './formulas.json'
import type { Formula } from './types'


class FormelDB extends Dexie {
formulas!: Table<Formula, string>
constructor() {
super('formelbase-db')
this.version(1).stores({ formulas: 'id' })
}
}
const db = new FormelDB()


// Første oppstart: seed coreData hvis tomt
async function ensureSeed() {
const count = await db.formulas.count()
if (count === 0) {
await db.formulas.bulkAdd(coreData as Formula[])
}
}
ensureSeed()


export function useFormulaStore() {
// For V1 holder vi det enkelt og leser synkront fra JSON + lazy Dexie
// (Videre: hooks med liveQuery fra Dexie for favoritter/notater.)
const allFormulas = coreData as Formula[]
const favorites = allFormulas.filter(f => f.isFavorite)
return {
allFormulas,
favorites,
async toggleFavorite(id: string) {
const f = await db.formulas.get(id)
if (!f) return
f.isFavorite = !f.isFavorite
await db.formulas.put(f)
},
async saveNote(id: string, note: string) {
const f = await db.formulas.get(id)
if (!f) return
f.userNote = note
await db.formulas.put(f)
},
db
}
}
/* ==== [BLOCK: Store] END ==== */
