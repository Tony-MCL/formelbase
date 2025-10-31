/* ==== [BLOCK: Types] BEGIN ==== */
export type Variable = {
symbol: string
name: string
unit: string
description?: string
}


export type Example = {
input: Record<string, number>
output: Record<string, number>
note?: string
}


export type Formula = {
id: string
title: string
category: string
section: string
formula: string // Eks: "P = U * I * cosphi"
variables: Record<string, Variable>
description?: string
examples?: Example[]
tags?: string[]
userNote?: string
isFavorite?: boolean
}
/* ==== [BLOCK: Types] END ==== */
