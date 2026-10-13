import type { CSSProperties } from 'react'
import { CATEGORY_MAP, buildingLabel } from '../data/categories'
import type { Building as BuildingType, Expense } from '../types'
import styles from './Building.module.css'

interface Props {
  building: BuildingType
  expenses: Expense[]
}

export function Building({ building, expenses }: Props) {
  const cat = CATEGORY_MAP[building.category]
  const linked = expenses.filter((e) => building.expenseIds.includes(e.id))
  const total = linked.reduce((s, e) => s + e.amount, 0)
  const sizeClass =
    building.level === 1 ? styles.lv1 : building.level === 2 ? styles.lv2 : styles.lv3
  const animClass =
    building.anim === 'build'
      ? styles.buildAnim
      : building.anim === 'merge'
        ? styles.mergeAnim
        : ''

  return (
    <div
      className={`${styles.building} ${sizeClass} ${animClass}`}
      style={
        {
          '--body': cat.color,
          '--roof': cat.roof,
          '--accent': cat.accent,
          gridColumn: building.x + 1,
          gridRow: building.y + 1,
        } as CSSProperties
      }
      title={`${buildingLabel(building.category, building.level)} · $${total.toLocaleString('zh-TW')}`}
    >
      <div className={styles.sprite} aria-hidden>
        <div className={styles.roof} />
        <div className={styles.body}>
          <span className={styles.window} />
          <span className={styles.window} />
          {building.level >= 2 && <span className={styles.window} />}
          {building.level >= 3 && (
            <>
              <span className={styles.window} />
              <span className={styles.flag} />
            </>
          )}
          <span className={styles.door} />
        </div>
      </div>
      <span className={styles.tag}>
        Lv{building.level} {cat.buildingName}
      </span>
      {total > 0 && (
        <span className={styles.amount}>${Math.round(total).toLocaleString('zh-TW')}</span>
      )}
    </div>
  )
}
