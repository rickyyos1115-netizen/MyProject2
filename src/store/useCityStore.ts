import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { placeBuilding, rebuildAfterDelete, createId } from '../data/upgradeRules'
import type { CategoryId, CityState, Expense } from '../types'

const STORAGE_KEY = 'fortune-city-v1'

const emptyState: CityState = { expenses: [], buildings: [] }

function loadState(): CityState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState
    const parsed = JSON.parse(raw) as CityState
    if (!Array.isArray(parsed.expenses) || !Array.isArray(parsed.buildings)) {
      return emptyState
    }
    return {
      expenses: parsed.expenses,
      buildings: parsed.buildings.map((b) => ({ ...b, anim: 'none' as const })),
    }
  } catch {
    return emptyState
  }
}

let state: CityState = loadState()
const listeners = new Set<() => void>()

function emit() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  listeners.forEach((l) => l())
}

function getSnapshot() {
  return state
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function setState(next: CityState) {
  state = next
  emit()
}

export function useCityStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const addExpense = useCallback(
    (input: { amount: number; category: CategoryId; note: string }) => {
      const expenseId = createId('exp')
      const placed = placeBuilding(state.buildings, input.category, expenseId)
      if (!placed) {
        return { ok: false as const, reason: '城市已滿，請先刪除部分帳單' }
      }

      const expense: Expense = {
        id: expenseId,
        amount: input.amount,
        category: input.category,
        note: input.note.trim(),
        createdAt: new Date().toISOString(),
        buildingId: placed.buildingId,
      }

      // Sync buildingId for all expenses after merges
      const expenses = [...state.expenses, expense].map((e) => {
        const owner = placed.buildings.find((b) => b.expenseIds.includes(e.id))
        return owner ? { ...e, buildingId: owner.id } : e
      })

      setState({ expenses, buildings: placed.buildings })
      return { ok: true as const }
    },
    [],
  )

  const deleteExpense = useCallback((expenseId: string) => {
    const expenses = state.expenses.filter((e) => e.id !== expenseId)
    const buildings = rebuildAfterDelete(state.buildings, expenseId)
    const synced = expenses.map((e) => {
      const owner = buildings.find((b) => b.expenseIds.includes(e.id))
      return owner ? { ...e, buildingId: owner.id } : e
    })
    setState({ expenses: synced, buildings })
  }, [])

  const clearAnim = useCallback((buildingId: string) => {
    setState({
      ...state,
      buildings: state.buildings.map((b) =>
        b.id === buildingId ? { ...b, anim: 'none' } : b,
      ),
    })
  }, [])

  return {
    expenses: snapshot.expenses,
    buildings: snapshot.buildings,
    addExpense,
    deleteExpense,
    clearAnim,
  }
}

/** Clear build/merge animation flags after CSS animation ends. */
export function useClearAnims(
  buildings: { id: string; anim: string }[],
  clearAnim: (id: string) => void,
) {
  useEffect(() => {
    const animated = buildings.filter((b) => b.anim !== 'none')
    if (animated.length === 0) return

    const timers = animated.map((b) =>
      window.setTimeout(() => clearAnim(b.id), 700),
    )
    return () => timers.forEach((t) => clearTimeout(t))
  }, [buildings, clearAnim])
}
