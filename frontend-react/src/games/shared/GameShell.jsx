import styles from './GameShell.module.css'

export default function GameShell({ title, subtitle, accent = '#ED4255', onBack, children }) {
  return (
    <div className={styles.shell} style={{ '--game-accent': accent }}>
      <header className={styles.header}>
        <button className={styles.back} onClick={onBack} title="Back to Games">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Games
        </button>
        <div className={styles.titleWrap}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </header>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
