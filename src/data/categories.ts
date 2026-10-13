import type { BuildingLevel, CategoryId } from '../types'

export interface CategoryMeta {
  id: CategoryId
  label: string
  buildingName: string
  color: string
  roof: string
  accent: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'food',
    label: '餐飲',
    buildingName: '餐廳',
    color: '#e07a5f',
    roof: '#c45c42',
    accent: '#f4a261',
  },
  {
    id: 'transport',
    label: '交通',
    buildingName: '車站',
    color: '#3d5a80',
    roof: '#293241',
    accent: '#98c1d9',
  },
  {
    id: 'shopping',
    label: '購物',
    buildingName: '商店',
    color: '#2a9d8f',
    roof: '#1d7a6f',
    accent: '#8ecae6',
  },
  {
    id: 'entertainment',
    label: '娛樂',
    buildingName: '遊樂場',
    color: '#e9c46a',
    roof: '#d4a84b',
    accent: '#f4a261',
  },
  {
    id: 'housing',
    label: '居住',
    buildingName: '住宅',
    color: '#81b29a',
    roof: '#5c8a74',
    accent: '#f2cc8f',
  },
  {
    id: 'other',
    label: '其他',
    buildingName: '雜貨舖',
    color: '#6d6875',
    roof: '#4a4458',
    accent: '#b8b0c0',
  },
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryMeta>

export function buildingLabel(category: CategoryId, level: BuildingLevel): string {
  const base = CATEGORY_MAP[category].buildingName
  if (level === 1) return base
  if (level === 2) return `升級${base}`
  return `豪華${base}`
}
