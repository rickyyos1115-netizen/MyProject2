import { CityMap } from './components/CityMap'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { StatsBar } from './components/StatsBar'
import { useCityStore, useClearAnims } from './store/useCityStore'
import './styles/tokens.css'

export default function App() {
  const { expenses, buildings, addExpense, deleteExpense, clearAnim } =
    useCityStore()
  useClearAnims(buildings, clearAnim)

  const buildingCount = buildings.length
  const monthSpend = expenses
    .filter((e) => {
      const d = new Date(e.createdAt)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((s, e) => s + e.amount, 0)

  return (
    <div className="app">
      <header className="brand-bar">
        <h1>
          記帳城市
          <span>Fortune City</span>
        </h1>
        <div className="brand-meta">
          <div>{buildingCount} 棟建築</div>
          <div>本月 ${monthSpend.toLocaleString('zh-TW')}</div>
        </div>
      </header>

      <main className="layout">
        <section className="city-panel" aria-label="城市地圖">
          <CityMap buildings={buildings} expenses={expenses} />
        </section>

        <aside className="side-panel" aria-label="記帳面板">
          <StatsBar expenses={expenses} />
          <ExpenseForm onSubmit={addExpense} />
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        </aside>
      </main>
    </div>
  )
}
