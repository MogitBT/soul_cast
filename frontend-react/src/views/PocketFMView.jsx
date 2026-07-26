import { useState, useRef, useEffect } from 'react'
import useAudioStory from '../games/shared/useAudioStory'
import styles from './PocketFMView.module.css'

const DARK_RITUAL_BEATS = [
  { id: 'dr1', type: 'narration', text: "The village of Bhangarh was known for one thing: the shadows that moved when the sun went down. Vikram, an archeologist with a penchant for the forbidden, arrived just as the twilight painted the sky blood red." },
  { id: 'dr2', type: 'narration', text: "He had a map, scribbled in dried blood, given to him by an old sadhu who vanished shortly after. It pointed to the center of the ruins, to the temple of the Forgotten Devi." },
  { id: 'dr3', type: 'narration', text: "As he pushed the heavy stone doors open, a cold wind rushed out, carrying the scent of jasmine and decay. The temple was not empty. In the center, a fire burned without any wood, casting erratic dancing shadows." },
  { id: 'dr4', type: 'narration', text: "Suddenly, the chanting began. Not from outside, but from the walls themselves. Thousands of whispers, speaking a language older than Sanskrit. Vikram felt his chest tighten as a figure emerged from the flames, wearing a necklace of skulls." },
  { id: 'dr5', type: 'narration', text: "The figure raised a hand, pointing a single, elongated finger right at Vikram's chest. 'You seek the truth of the dark ritual,' it hissed, its voice echoing in Vikram's mind. 'But are you prepared to pay the price of admission?'" },
]

export default function PocketFMView({ onBack }) {
  const {
    phase, isPlaying, progress, beatIndex,
    play, pause, skipForward, skipBackward, seek
  } = useAudioStory(DARK_RITUAL_BEATS)

  const [chatLog, setChatLog] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatLogRef = useRef(null)

  // Auto scroll chat
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [chatLog])

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    const q = chatInput.trim()
    if (!q) return

    setChatInput('')
    setChatLog(prev => [...prev, { role: 'user', text: q }])
    setChatLoading(true)

    // Calculate context so far
    const currentIdx = Math.max(0, beatIndex)
    const contextSoFar = DARK_RITUAL_BEATS.slice(0, currentIdx + 1).map(b => b.text).join(' ')

    try {
      const res = await fetch('/api/pocketcases/voice/companion-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story_title: 'Dark Ritual',
          story_context_so_far: contextSoFar,
          question: q
        })
      })
      if (res.ok) {
        const data = await res.json()
        setChatLog(prev => [...prev, { role: 'ai', text: data.text }])
      } else {
        setChatLog(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't reach the backend." }])
      }
    } catch (err) {
      setChatLog(prev => [...prev, { role: 'ai', text: "Connection error." }])
    }
    setChatLoading(false)
  }

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = (e.clientX - rect.left) / rect.width
    seek(Math.max(0, Math.min(1, fraction)))
  }

  return (
    <div className={styles.container}>
      <div className={styles.playerArea}>
        <div className={styles.bgBlur} />
        
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onBack}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        <div className={styles.mainContent}>
          <img src="https://images.unsplash.com/photo-1516410529446-2c777cb7366d?auto=format&fit=crop&w=600&h=800&q=80" alt="Dark Ritual" className={styles.coverArt} />
          
          <div className={styles.titleInfo}>
            <h1 className={styles.title}>Dark Ritual</h1>
            <p className={styles.subtitle}>A PocketFM Original Story</p>
          </div>

          <div className={styles.controls}>
            <div className={styles.scrubberWrap} onClick={handleScrubberClick}>
              <div className={styles.scrubberFill} style={{ width: `${progress * 100}%` }} />
            </div>

            <div className={styles.buttons}>
              <button className={styles.skipBtn} onClick={skipBackward} title="-5s">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 19 2 12 11 5 11 19"></polygon>
                  <polygon points="22 19 13 12 22 5 22 19"></polygon>
                </svg>
              </button>

              <button className={styles.playBtn} onClick={isPlaying ? pause : play}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>

              <button className={styles.skipBtn} onClick={skipForward} title="+5s">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 19 22 12 13 5 13 19"></polygon>
                  <polygon points="2 19 11 12 2 5 2 19"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chatSidebar}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderIcon}>✨</div>
          <div>
            <p className={styles.chatTitle}>AI Co-Pilot</p>
            <p className={styles.chatSub}>Ask questions without rewinding</p>
          </div>
        </div>

        <div className={styles.chatLog} ref={chatLogRef}>
          {chatLog.length === 0 && (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '40px', fontSize: '14px' }}>
              Have a question about the story? Ask me! I promise not to spoil anything that hasn't happened yet.
            </div>
          )}
          {chatLog.map((msg, i) => (
            <div key={i} className={`${styles.chatMsg} ${msg.role === 'user' ? styles.chatMsgUser : styles.chatMsgAi}`}>
              {msg.text}
            </div>
          ))}
          {chatLoading && <div className={styles.chatLoading}>AI Co-Pilot is thinking...</div>}
        </div>

        <div className={styles.chatInputArea}>
          <form className={styles.chatForm} onSubmit={handleChatSubmit}>
            <input 
              type="text" 
              className={styles.chatInput} 
              placeholder="E.g. Who is Vikram?" 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={chatLoading}
            />
            <button type="submit" className={styles.chatSendBtn} disabled={chatLoading || !chatInput.trim()}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
