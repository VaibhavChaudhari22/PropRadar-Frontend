import { Bell, Search } from 'lucide-react'
import styles from './TopBar.module.css'

export default function TopBar({ title, subtitle, actions }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.right}>
        {actions}
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} strokeWidth={1.8} />
          <span className={styles.badge} />
        </button>
      </div>
    </header>
  )
}
