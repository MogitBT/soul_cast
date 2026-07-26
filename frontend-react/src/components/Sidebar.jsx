import { useState, useRef, useEffect } from 'react'
import styles from './Sidebar.module.css'

const NAV = [
  {
    id: 'home', label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11.5 12 4l9 7.5"/>
        <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"/>
      </svg>
    )
  },
  {
    id: 'store', label: 'Store',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h16l-1 12H5L4 8Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>
      </svg>
    )
  },
  {
    id: 'studio', label: 'Studio',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="3" width="6" height="11" rx="3"/>
        <path d="M5 12a7 7 0 0 0 14 0"/><path d="M12 19v3M9 22h6"/>
      </svg>
    )
  },
  {
    id: 'games', label: 'Verdicts',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-4Z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    )
  },
]

export default function Sidebar({ active, onNav, isAdminAuthenticated, onOpenAdminLogin }) {
  const [showPopover, setShowPopover] = useState(false)
  const popoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPopover(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProfileClick = () => {
    if (isAdminAuthenticated) {
      onNav('admin')
    } else {
      setShowPopover(prev => !prev)
    }
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoMark}>
        <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
          <circle cx="16" cy="16" r="14" fill="#ED4255" opacity="0.15"/>
          <path d="M10 16a6 6 0 1 1 6 6H13l-3 2.5V19.5A6 6 0 0 1 10 16Z" fill="#ED4255"/>
        </svg>
      </div>

      <nav className={styles.nav}>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`${styles.navLink} ${active === item.id ? styles.active : ''}`}
            onClick={() => onNav(item.id)}
            title={item.label}
          >
            <span className={styles.iconWrap}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Profile at bottom with popover */}
      <div className={styles.profileWrapper} ref={popoverRef}>
        {showPopover && (
          <div className={styles.popover}>
            <div className={styles.popoverHeader}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>User Account</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Guest User</span>
            </div>
            <div className={styles.popoverDivider} />
            <button 
              className={styles.popoverItem}
              onClick={() => {
                setShowPopover(false)
                onOpenAdminLogin()
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🔐</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>Admin Login</div>
                <div style={{ fontSize: '0.72rem', color: '#ED4255' }}>Access Case Forge</div>
              </div>
            </button>
          </div>
        )}

        <button 
          className={`${styles.profile} ${active === 'admin' ? styles.active : ''}`} 
          title="Profile Options" 
          onClick={handleProfileClick}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="3.5"/>
            <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"/>
          </svg>
          <span className={styles.label}>{isAdminAuthenticated ? 'Admin' : 'Profile'}</span>
        </button>
      </div>
    </aside>
  )
}
