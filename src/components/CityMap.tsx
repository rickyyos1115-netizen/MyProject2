import type { CSSProperties } from 'react'
import { Building } from './Building'
import type { Building as BuildingType, Expense } from '../types'
import { GRID_COLS, GRID_ROWS } from '../types'
import styles from './CityMap.module.css'

interface Props {
  buildings: BuildingType[]
  expenses: Expense[]
}

export function CityMap({ buildings, expenses }: Props) {
  const cells = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => i)

  return (
    <div className={styles.wrap}>
      <div className={styles.skyDecor} aria-hidden>
        <span className={styles.cloud} />
        <span className={`${styles.cloud} ${styles.cloud2}`} />
      </div>
      <div className={styles.ground}>
        <div
          className={styles.grid}
          style={
            {
              '--cols': GRID_COLS,
              '--rows': GRID_ROWS,
            } as CSSProperties
          }
        >
          {cells.map((i) => (
            <div key={i} className={styles.cell} />
          ))}
          {buildings.map((b) => (
            <Building key={b.id} building={b} expenses={expenses} />
          ))}
        </div>
        {buildings.length === 0 && (
          <p className={styles.empty}>城市還是空地 — 記一筆消費，蓋起第一棟建築</p>
        )}
      </div>
      <div className={styles.legend}>
        同類型 3 棟同級建築會自動合併升級
      </div>
    </div>
  )
}
