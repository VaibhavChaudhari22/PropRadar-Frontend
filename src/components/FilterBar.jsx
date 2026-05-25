import { Search, SlidersHorizontal, X } from 'lucide-react'
import styles from './FilterBar.module.css'

const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK']

export default function FilterBar({ filters, onChange, onReset, totalProjects }) {
  const hasFilters = filters.search || filters.location || filters.variant ||
    filters.minBudget || filters.maxBudget

  return (
    <div className={styles.wrap}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} strokeWidth={1.8} />
        <input
          className={styles.search}
          placeholder="Search projects..."
          value={filters.search || ''}
          onChange={e => onChange('search', e.target.value)}
        />
        {filters.search && (
          <button className={styles.clearBtn} onClick={() => onChange('search', '')}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className={styles.filters}>
        <div className={styles.filterIcon}>
          <SlidersHorizontal size={15} strokeWidth={1.8} />
        </div>

        {/* Location */}
        <input
          className={`input input-sm ${styles.filterInput}`}
          placeholder="Location"
          value={filters.location || ''}
          onChange={e => onChange('location', e.target.value)}
        />

        {/* BHK */}
        <select
          className={`input input-sm ${styles.filterInput}`}
          value={filters.variant || ''}
          onChange={e => onChange('variant', e.target.value)}
        >
          <option value="">All BHK</option>
          {BHK_OPTIONS.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Budget min */}
        <input
          className={`input input-sm ${styles.filterInput}`}
          placeholder="Min Budget (₹)"
          type="number"
          value={filters.minBudget || ''}
          onChange={e => onChange('minBudget', e.target.value)}
        />

        {/* Budget max */}
        <input
          className={`input input-sm ${styles.filterInput}`}
          placeholder="Max Budget (₹)"
          type="number"
          value={filters.maxBudget || ''}
          onChange={e => onChange('maxBudget', e.target.value)}
        />

        {/* Reset */}
        {hasFilters && (
          <button className={`btn btn-ghost btn-sm ${styles.resetBtn}`} onClick={onReset}>
            <X size={14} />
            Reset
          </button>
        )}
      </div>

      {/* Result count */}
      <div className={styles.resultCount}>
        {totalProjects !== undefined && (
          <span className="text-muted text-sm">
            {totalProjects} project{totalProjects !== 1 ? 's' : ''} found
          </span>
        )}
      </div>
    </div>
  )
}
