import styles from './PlaceholderView.module.css'

export default function PlaceholderView({ icon, eyebrow, title, desc }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.icon}>{icon}</div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
        <p className={styles.desc}>{desc}</p>
      </div>
    </div>
  )
}
