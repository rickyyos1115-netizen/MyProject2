import { CATEGORY_MAP } from '../data/categories'
import type { Expense } from '../types'
import styles from './ExpenseList.module.css'

interface Props {
  expenses: Expense[]
  onDelete: (id: string) => void
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function ExpenseList({ expenses, onDelete }: Props) {
  const sorted = [...expenses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <section className={styles.section}>
      <h2 className="section-title">近期帳單</h2>
      {sorted.length === 0 ? (
        <p className="muted">還沒有消費紀錄，記一筆開始蓋城吧。</p>
      ) : (
        <ul className={styles.list}>
          {sorted.map((e) => {
            const cat = CATEGORY_MAP[e.category]
            return (
              <li key={e.id} className={styles.item}>
                <span
                  className={styles.dot}
                  style={{ background: cat.color }}
                  aria-hidden
                />
                <div className={styles.info}>
                  <div className={styles.top}>
                    <strong>{cat.label}</strong>
                    <span className={styles.amount}>
                      ${e.amount.toLocaleString('zh-TW')}
                    </span>
                  </div>
                  <div className={styles.meta}>
                    <span>{formatTime(e.createdAt)}</span>
                    {e.note && <span>· {e.note}</span>}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.delete}
                  onClick={() => onDelete(e.id)}
                  aria-label="刪除帳單"
                >
                  刪除
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
