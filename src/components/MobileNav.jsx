import { NavLink } from 'react-router-dom'
import { LayoutGrid, PlusCircle, BarChart3 } from 'lucide-react'
import styles from './MobileNav.module.css'

export default function MobileNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" end className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
        <LayoutGrid size={20} strokeWidth={1.8} />
        <span>Projects</span>
      </NavLink>
      <NavLink to="/projects/new" className={({ isActive }) => `${styles.item} ${styles.add} ${isActive ? styles.active : ''}`}>
        <PlusCircle size={22} strokeWidth={1.8} />
        <span>Add</span>
      </NavLink>
      <NavLink to="/analytics" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
        <BarChart3 size={20} strokeWidth={1.8} />
        <span>Analytics</span>
      </NavLink>
    </nav>
  )
}
