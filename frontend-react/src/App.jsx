import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import HomeView from './views/HomeView'
import GamesView from './views/GamesView'
import PlaceholderView from './views/PlaceholderView'
import AdminStudioView from './views/AdminStudioView'
import PocketFMView from './views/PocketFMView'
import AdminAuthModal from './components/AdminAuthModal'
import styles from './App.module.css'

export default function App() {
  const [view, setView] = useState('home')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Clear backend cases when the app is refreshed
  useEffect(() => {
    fetch('/api/admin/cases/all', { method: 'DELETE' }).catch(() => {})
  }, [])

  const handleNav = (newView) => {
    if (newView === 'admin' && !isAdminAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setView(newView)
  }

  const handleAuthSuccess = () => {
    setIsAdminAuthenticated(true)
    setShowAuthModal(false)
    setView('admin')
  }

  return (
    <div className={styles.shell}>
      <Sidebar 
        active={view} 
        onNav={handleNav} 
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminLogin={() => setShowAuthModal(true)}
      />

      <AdminAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <div className={styles.mainArea}>
        <Topbar />
        <main className={styles.content}>
          {view === 'home'   && <HomeView onNav={handleNav} />}
          {view === 'store'  && <PlaceholderView icon="🛒" eyebrow="Store"  title="Coin store coming soon"     desc="Buy coins to unlock premium PocketCases episodes and story packs." />}
          {view === 'studio' && <PlaceholderView icon="🎙️" eyebrow="Studio" title="Creator Studio coming soon" desc="Record and publish your own interactive PocketCases story rooms." />}
          {view === 'admin'  && (isAdminAuthenticated ? <AdminStudioView /> : <HomeView onNav={handleNav} />)}
          {view === 'games'  && <GamesView />}
          {view === 'pocketfm' && <PocketFMView onBack={() => setView('home')} />}
        </main>
      </div>
    </div>
  )
}
