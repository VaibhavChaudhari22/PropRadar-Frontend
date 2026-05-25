import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  PlusCircle,
  Building2,
  Zap,
  Users,
  Settings,
  BarChart3
} from 'lucide-react'
import styles from './Sidebar.module.css'

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Projects', end: true },
  { to: '/projects/new', icon: PlusCircle, label: 'Add Project' },
]

const bottomItems = [
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Zap size={18} strokeWidth={2.5} />
        </div>
        <div>
          <div className={styles.logoName}>PropRadar</div>
          <div className={styles.logoSub}>Channel Partner</div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <span className={styles.navLabel}>Menu</span>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.divider} />
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}

        {/* Profile */}
        <div className={styles.profile}>
          <div className={styles.avatar}>CP</div>
          <div>
            <div className={styles.profileName}>Channel Partner</div>
            <div className={styles.profileSub}>Pro Account</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
