import { useState } from 'react'
import styles from './AdminAuthModal.module.css'

export default function AdminAuthModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState('admin@pocketcases.ai')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (email === 'admin@pocketcases.ai' && password === 'admin123') {
        setLoading(false)
        onSuccess()
      } else {
        setLoading(false)
        setError('Invalid admin credentials. Use default: admin@pocketcases.ai / admin123')
      }
    }, 600)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        
        <div className={styles.header}>
          <div className={styles.badgeIcon}>🔐</div>
          <h2>Admin Studio Access</h2>
          <p>Please enter your administrator credentials to access the Case Forge engine.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMsg}>{error}</div>}

          <div className={styles.field}>
            <label>Admin Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="admin@pocketcases.ai"
              required 
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className={styles.hint}>
            <span>💡 Pretyped Credentials:</span>
            <code>admin@pocketcases.ai / admin123</code>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Authenticating..." : "🔑 Authenticate & Enter Case Forge"}
          </button>
        </form>
      </div>
    </div>
  )
}
