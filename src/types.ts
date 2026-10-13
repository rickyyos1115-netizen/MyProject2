export type CategoryId =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'housing'
  | 'other'

export type BuildingLevel = 1 | 2 | 3

export interface Expense {
  id: string
  amount: number
  category: CategoryId
  note: string
  createdAt: string
  buildingId: string
}

export interface Building {
  id: string
  category: CategoryId
  level: BuildingLevel
  x: number
  y: number
  expenseIds: string[]
  anim: 'none' | 'build' | 'merge'
}

export interface CityState {
  expenses: Expense[]
  buildings: Building[]
}

export const GRID_COLS = 8
export const GRID_ROWS = 6
export const MERGE_THRESHOLD = 3
export const MAX_LEVEL = 3
