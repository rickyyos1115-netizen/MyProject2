import type { Building, BuildingLevel, CategoryId } from '../types'
import { GRID_COLS, GRID_ROWS, MAX_LEVEL, MERGE_THRESHOLD } from '../types'

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function findEmptyCell(
  buildings: Building[],
  preferNear?: { x: number; y: number },
): { x: number; y: number } | null {
  const occupied = new Set(buildings.map((b) => `${b.x},${b.y}`))
  const cells: { x: number; y: number; score: number }[] = []

  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      if (occupied.has(`${x},${y}`)) continue
      const score = preferNear
        ? Math.abs(x - preferNear.x) + Math.abs(y - preferNear.y)
        : (x - (GRID_COLS - 1) / 2) ** 2 + (y - (GRID_ROWS - 1) / 2) ** 2
      cells.push({ x, y, score })
    }
  }

  if (cells.length === 0) return null
  cells.sort((a, b) => a.score - b.score)
  return { x: cells[0].x, y: cells[0].y }
}

function takeMergeGroup(
  buildings: Building[],
  category: CategoryId,
  level: BuildingLevel,
): Building[] | null {
  const group = buildings.filter((b) => b.category === category && b.level === level)
  if (group.length < MERGE_THRESHOLD) return null
  return group.slice(0, MERGE_THRESHOLD)
}

/** Repeatedly merge same-category buildings until no more merges are possible. */
export function applyMerges(buildings: Building[]): Building[] {
  let next = buildings.map((b) => ({ ...b, expenseIds: [...b.expenseIds] }))
  let merged = true

  while (merged) {
    merged = false
    for (const level of [1, 2] as BuildingLevel[]) {
      if (level >= MAX_LEVEL) continue
      const categories = [...new Set(next.map((b) => b.category))]
      for (const category of categories) {
        const group = takeMergeGroup(next, category, level)
        if (!group) continue

        const ids = new Set(group.map((b) => b.id))
        const expenseIds = group.flatMap((b) => b.expenseIds)
        const avgX = Math.round(group.reduce((s, b) => s + b.x, 0) / group.length)
        const avgY = Math.round(group.reduce((s, b) => s + b.y, 0) / group.length)

        const remaining = next.filter((b) => !ids.has(b.id))
        let spot = { x: avgX, y: avgY }
        if (remaining.some((b) => b.x === spot.x && b.y === spot.y)) {
          const empty = findEmptyCell(remaining, spot)
          if (!empty) continue
          spot = empty
        }

        const upgraded: Building = {
          id: createId('bld'),
          category,
          level: (level + 1) as BuildingLevel,
          x: spot.x,
          y: spot.y,
          expenseIds,
          anim: 'merge',
        }

        next = [...remaining, upgraded]
        merged = true
      }
    }
  }

  return next
}

export function placeBuilding(
  buildings: Building[],
  category: CategoryId,
  expenseId: string,
): { buildings: Building[]; buildingId: string } | null {
  const cell = findEmptyCell(buildings)
  if (!cell) return null

  const building: Building = {
    id: createId('bld'),
    category,
    level: 1,
    x: cell.x,
    y: cell.y,
    expenseIds: [expenseId],
    anim: 'build',
  }

  const withNew = [...buildings, building]
  const merged = applyMerges(withNew)

  // After merge, the building that holds this expense may have a new id
  const owner = merged.find((b) => b.expenseIds.includes(expenseId))
  if (!owner) return null

  return { buildings: merged, buildingId: owner.id }
}

export function rebuildAfterDelete(
  buildings: Building[],
  removedExpenseId: string,
): Building[] {
  const target = buildings.find((b) => b.expenseIds.includes(removedExpenseId))
  if (!target) return buildings

  const leftoverIds = target.expenseIds.filter((id) => id !== removedExpenseId)
  let next = buildings.filter((b) => b.id !== target.id)

  // Re-place leftover expenses as Lv1, then re-merge
  for (const expenseId of leftoverIds) {
    const cell = findEmptyCell(next)
    if (!cell) break
    next = [
      ...next,
      {
        id: createId('bld'),
        category: target.category,
        level: 1 as BuildingLevel,
        x: cell.x,
        y: cell.y,
        expenseIds: [expenseId],
        anim: 'none' as const,
      },
    ]
  }

  return applyMerges(next).map((b) => ({ ...b, anim: 'none' as const }))
}
