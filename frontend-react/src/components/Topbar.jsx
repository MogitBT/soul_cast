import { useState } from 'react'
import styles from './Topbar.module.css'

export default function Topbar() {
  const [query, setQuery] = useState('')

  return (
    <header className={styles.topbar}>
      <div className={styles.greeting}>
        <p className={styles.eyebrow}>Hello</p>
        <h1 className={styles.name}>Guest</h1>
      </div>

      <label className={styles.searchBar}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="text"
          placeholder="Search for audio series, artists"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </label>

      <button className={styles.langBtn} title="Language">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>
        </svg>
      </button>
    </header>
  )
}
