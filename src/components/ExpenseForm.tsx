import type { CSSProperties, FormEvent } from 'react'
import { useState } from 'react'
import { CATEGORIES } from '../data/categories'
import type { CategoryId } from '../types'
import styles from './ExpenseForm.module.css'

interface Props {
  onSubmit: (data: {
    amount: number
    category: CategoryId
    note: string
  }) => { ok: true } | { ok: false; reason: string }
}

export function ExpenseForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<CategoryId>('food')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) {
      setError('請輸入有效金額')
      return
    }
    const result = onSubmit({ amount: Math.round(value * 100) / 100, category, note })
    if (!result.ok) {
      setError(result.reason)
      return
    }
    setAmount('')
    setNote('')
    setError('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className="section-title">記一筆</h2>
      <div className={styles.row}>
        <label className={styles.amountWrap}>
          <span className={styles.label}>金額</span>
          <div className={styles.amountField}>
            <span>$</span>
            <input
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label="金額"
            />
          </div>
        </label>
      </div>

      <div className={styles.categories} role="group" aria-label="消費類別">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.catBtn}
            data-active={category === c.id}
            style={{ '--cat': c.color } as CSSProperties}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <label className={styles.note}>
        <span className={styles.label}>備註</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="可選，例如：午餐"
          maxLength={40}
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submit}>
        蓋一棟建築
      </button>
    </form>
  )
}
