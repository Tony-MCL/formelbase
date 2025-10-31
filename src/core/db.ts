/* ==== [BLOCK: Imports] BEGIN ==== */
import Dexie, { type EntityTable } from "dexie"
import type { Formula } from "./types"
/* ==== [BLOCK: Imports] END ==== */

/* ==== [BLOCK: Schema] BEGIN ==== */
export interface UserMeta {
  id: string           // formula id
  isFavorite?: boolean
  userNote?: string
}

export interface UserFormula extends Formula {
  isUserFormula: true
}

export class FormelbaseDB extends Dexie {
  metas!: EntityTable<UserMeta, "id">
  userFormulas!: EntityTable<UserFormula, "id">

  constructor() {
    super("formelbase-db")
    this.version(1).stores({
      metas: "id",
      userFormulas: "id"
    })
  }
}
export const db = new FormelbaseDB()
/* ==== [BLOCK: Schema] END ==== */
