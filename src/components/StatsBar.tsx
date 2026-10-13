import { CATEGORIES, CATEGORY_MAP } from '../data/categories'
import type { Expense } from '../types'
import styles from './StatsBar.module.css'

interface Props {
  expenses: Expense[]
}

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function sum(list: Expense[]) {
  return list.reduce((s, e) => s + e.amount, 0)
}

export function StatsBar({ expenses }: Props) {
  const today = startOfToday()
  const month = startOfMonth()
  const todayTotal = sum(expenses.filter((e) => new Date(e.createdAt) >= today))
  const monthTotal = sum(expenses.filter((e) => new Date(e.createdAt) >= month))
  const monthExpenses = expenses.filter((e) => new Date(e.createdAt) >= month)

  const byCat = CATEGORIES.map((c) => ({
    ...c,
    total: sum(monthExpenses.filter((e) => e.category === c.id)),
  })).filter((c) => c.total > 0)

  const maxCat = Math.max(...byCat.map((c) => c.total), 1)

  return (
    <section className={styles.section}>
      <h2 className="section-title">統計</h2>
      <div className={styles.totals}>
        <div>
          <span className={styles.label}>今日</span>
          <strong>${todayTotal.toLocaleString('zh-TW')}</strong>
        </div>
        <div>
          <span className={styles.label}>本月</span>
          <strong>${monthTotal.toLocaleString('zh-TW')}</strong>
        </div>
      </div>
      {byCat.length > 0 && (
        <div className={styles.bars}>
          {byCat.map((c) => (
            <div key={c.id} className={styles.barRow}>
              <span className={styles.catName}>{CATEGORY_MAP[c.id].label}</span>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  style={{
                    width: `${(c.total / maxCat) * 100}%`,
                    background: c.color,
                  }}
                />
              </div>
              <span className={styles.catAmount}>
                ${c.total.toLocaleString('zh-TW')}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
