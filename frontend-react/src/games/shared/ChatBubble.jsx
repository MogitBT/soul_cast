import styles from './ChatBubble.module.css'

export default function ChatBubble({ role, name, text, accent }) {
  const isPlayer = role === 'player'
  return (
    <div className={`${styles.row} ${isPlayer ? styles.rowPlayer : ''}`}>
      {!isPlayer && (
        <div className={styles.avatar} style={{ background: accent || 'var(--red)' }}>
          {(name || role)[0].toUpperCase()}
        </div>
      )}
      <div className={`${styles.bubble} ${isPlayer ? styles.bubblePlayer : styles.bubbleOther}`}
           style={isPlayer ? {} : { borderColor: accent ? `${accent}44` : undefined }}>
        {!isPlayer && name && <p className={styles.name} style={{ color: accent || 'var(--red)' }}>{name}</p>}
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  )
}
