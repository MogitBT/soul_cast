import { useEffect, useRef, useState } from 'react'
import useAudioStory from './useAudioStory'
import styles from './AudioStoryPlayer.module.css'

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z"/>
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  )
}

function Skip5Back() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12.5 3a9 9 0 1 0 6.364 2.636L17.5 7H13V2.5l1.94 1.94A8.96 8.96 0 0 0 12.5 3z" opacity=".3"/>
      <path d="M12.5 2C8.36 2 4.86 4.65 3.5 8.35V5H2v5h5v-1.5H4.07A7.5 7.5 0 1 1 12.5 20a7.5 7.5 0 0 1-7.44-6.5H3.55A9 9 0 1 0 12.5 2z"/>
      <text x="12" y="15.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">5</text>
    </svg>
  )
}

function Skip5Fwd() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M11.5 3a9 9 0 1 1-6.364 2.636L6.5 7H11V2.5L9.06 4.44A8.96 8.96 0 0 1 11.5 3z" opacity=".3"/>
      <path d="M11.5 2c4.14 0 7.64 2.65 9 6.35V5H22v5h-5v-1.5h2.93A7.5 7.5 0 1 0 11.5 20a7.5 7.5 0 0 0 7.44-6.5h1.51A9 9 0 1 1 11.5 2z"/>
      <text x="12" y="15.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">5</text>
    </svg>
  )
}

export default function AudioStoryPlayer({
  beats, title, series, episode,
  accent = '#ED4255', artworkGradient, artworkEmoji, artworkImage,
  onBack, onComplete, isOpenEnded = false
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcriptText, setTranscriptText] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (e) => {
        const current = e.resultIndex
        const transcript = e.results[current][0].transcript
        setTranscriptText(transcript)
      }

      recognition.onerror = (e) => {
        console.error("Speech recognition error:", e)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    } else {
      setTranscriptText('')
      recognitionRef.current?.start()
      setIsRecording(true)
    }
  }

  const {
    phase, isPlaying, progress, history, currentBeat,
    speedLabel, chatLoading, selectedOptions,
    play, pause, choose, submitChat, restart, skipForward, skipBackward, seek, cycleSpeed,
  } = useAudioStory(beats)

  const narrationRef = useRef(null)
  const scrubberRef  = useRef(null)

  useEffect(() => {
    if (narrationRef.current) {
      narrationRef.current.scrollTop = narrationRef.current.scrollHeight
    }
  }, [history.length])

  useEffect(() => {
    if (phase === 'complete' && onComplete) onComplete()
  }, [phase])

  const togglePlay = () => { if (isPlaying) pause(); else play() }

  const handleScrubberClick = (e) => {
    const rect = scrubberRef.current.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(fraction)
  }

  const fmtTime = (pct, total = 1200000) => {
    const ms = pct * total
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const isWaiting  = phase === 'waiting'
  const isComplete = phase === 'complete'
  const isIdle     = phase === 'idle'

  return (
    <div className={styles.player} style={{ '--accent': accent }}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          New Case
        </button>
        <div className={styles.headerMeta}>
          <span className={styles.headerSeries}>{series}</span>
          <span className={styles.headerDot}>·</span>
          <span className={styles.headerEp}>{episode}</span>
        </div>
      </div>

      {/* Main body */}
      <div className={styles.body}>
        {/* Left: artwork + controls */}
        <div className={styles.playerLeft}>
          <div className={styles.artwork} style={{ background: artworkGradient || `linear-gradient(135deg,${accent}33,#0a0a12)` }}>
            {artworkImage ? (
              <img src={artworkImage} alt={title} className={styles.artworkImg} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
            ) : (
              <span className={styles.artworkEmoji}>{artworkEmoji || '🎙️'}</span>
            )}
            {isPlaying && (
              <div className={styles.waveform}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={styles.waveBar} style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            )}
          </div>

          <div className={styles.episodeInfo}>
            <h3 className={styles.episodeTitle}>{title}</h3>
            <p className={styles.episodeSub}>{series} · {episode}</p>
          </div>

          {/* Scrubber — clickable */}
          <div className={styles.scrubberWrap}>
            {isOpenEnded ? (
              <div className={styles.liveIndicator}>
                <span className={styles.liveDot} style={{ background: accent }}></span>
                <span style={{ color: accent, fontWeight: 500, letterSpacing: '0.5px' }}>LIVE SESSION</span>
              </div>
            ) : (
              <>
                <div
                  className={styles.scrubber}
                  ref={scrubberRef}
                  onClick={handleScrubberClick}
                  role="slider"
                  aria-label="Story progress"
                  aria-valuenow={Math.round(progress * 100)}
                >
                  <div className={styles.scrubberFill} style={{ width: `${progress * 100}%` }} />
                  <div className={styles.scrubberThumb} style={{ left: `${progress * 100}%` }} />
                </div>
                <div className={styles.times}>
                  <span>{fmtTime(progress)}</span>
                  <span>{fmtTime(1)}</span>
                </div>
              </>
            )}
          </div>

          {/* Controls row */}
          <div className={styles.controls}>
            {/* Left Control */}
            <div className={styles.leftControls}>
              <button className={styles.ctrlBtn} onClick={restart} title="Restart story">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            </div>

            {/* Media Controls */}
            <div className={styles.mediaControls}>
              <button className={styles.ctrlBtn} onClick={skipBackward} title="Back 5 seconds" disabled={isWaiting || isIdle}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.67"/>
                </svg>
                <span className={styles.skipLabel}>5</span>
              </button>

              <button
                className={`${styles.playBtn} ${isWaiting ? styles.playBtnWaiting : ''}`}
                onClick={togglePlay}
                disabled={isWaiting}
                title={isWaiting ? 'Make your choice' : isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <button className={styles.ctrlBtn} onClick={skipForward} title="Forward 5 seconds" disabled={isWaiting || isIdle}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-.49-3.67"/>
                </svg>
                <span className={styles.skipLabel}>5</span>
              </button>
            </div>

            {/* Right Controls */}
            <div className={styles.rightControls}>
              <button className={styles.speedBtn} onClick={cycleSpeed} title="Playback speed">
                {speedLabel}
              </button>

              <select 
                className={styles.langBtn}
                onChange={(e) => {
                  window.localStorage.setItem('preferredLanguage', e.target.value);
                }}
                defaultValue={window.localStorage.getItem('preferredLanguage') || 'english'}
              >
                <option value="english">EN</option>
                <option value="hindi">HI</option>
                <option value="tamil">TA</option>
                <option value="kannada">KA</option>
              </select>
            </div>
          </div>

          {/* Status pill below controls */}
          <div className={styles.statusRow}>
            {isIdle     && <span className={styles.statusPill}>Ready to play</span>}
            {isPlaying  && <span className={`${styles.statusPill} ${styles.statusLive}`}>● Narrating</span>}
            {phase === 'paused' && <span className={styles.statusPill}>Paused</span>}
            {isWaiting  && <span className={`${styles.statusPill} ${styles.statusWaiting}`}>⏸ Your turn</span>}
            {isComplete && <span className={`${styles.statusPill} ${styles.statusComplete}`}>✓ Complete</span>}
          </div>
        </div>

        {/* Right: narration scroll */}
        <div className={styles.playerRight}>
          <div className={styles.narrationHeader}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Story Narration
          </div>
          <div className={styles.narrationLog} ref={narrationRef}>
            {history.length === 0 && (
              <div className={styles.narrationEmpty}>
                <span>Press play to begin the story…</span>
              </div>
            )}
            {history.map((h, i) => (
              <div
                key={h.id || i}
                className={`${styles.narrationLine} ${h.type === 'choice' ? styles.choiceLine : ''} ${i === history.length - 1 ? styles.narrationCurrent : ''}`}
              >
                {h.type === 'choice'
                  ? <span className={styles.choiceTag}>{h.text}</span>
                  : <p>{h.text}</p>
                }
              </div>
            ))}
            {isPlaying && (
              <div className={styles.speaking}>
                <span/><span/><span/>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interaction panel */}
      {isWaiting && currentBeat && (
        <div className={styles.interactionPanel}>
          <div className={styles.interactionHeader}>
            <div className={styles.pauseIndicator}>
              <span className={styles.pauseDot} />
              Story Paused — Your Choice
            </div>
            <p className={styles.interactionPrompt}>{currentBeat.prompt}</p>
          </div>
          
          {currentBeat.type === 'chat_interaction' ? (
            <div className={styles.chatInteraction}>
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  const fd = new FormData(e.target)
                  const text = fd.get('question')
                  if (text && text.trim()) {
                    submitChat(currentBeat.id, text.trim())
                    e.target.reset()
                    setTranscriptText('')
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    name="question" 
                    value={transcriptText}
                    onChange={e => setTranscriptText(e.target.value)}
                    placeholder={
                      currentBeat.interactionType === 'escape' ? "Type your action (e.g. 'I open the desk drawer')..." : 
                      currentBeat.interactionType === 'story' ? "What do you do? (e.g. 'I burn the letter')" : 
                      "Type your question..."
                    } 
                    disabled={chatLoading}
                    autoComplete="off"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #333',
                      background: '#1a1a24',
                      color: '#fff',
                      fontSize: '15px'
                    }}
                  />
                  {recognitionRef.current && (
                    <button
                      type="button"
                      onClick={toggleRecording}
                      disabled={chatLoading}
                      style={{
                        background: isRecording ? '#ED4255' : 'transparent',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: chatLoading ? 'not-allowed' : 'pointer',
                        color: isRecording ? '#fff' : '#888',
                        transition: 'all 0.2s',
                        boxShadow: isRecording ? '0 0 12px rgba(237,66,85,0.6)' : 'none'
                      }}
                      title="Hold to speak"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                    </button>
                  )}
                  <button 
                    type="submit" 
                    disabled={chatLoading}
                    style={{
                      background: '#ED4255',
                      border: 'none',
                      borderRadius: '8px',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: chatLoading ? 'not-allowed' : 'pointer',
                      color: '#fff',
                      opacity: chatLoading ? 0.5 : 1,
                      transition: 'background 0.2s',
                    }}
                    title="Send"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
                {currentBeat.interactionType !== 'escape' && currentBeat.interactionType !== 'story' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button 
                      type="button" 
                      disabled={chatLoading}
                      onClick={() => choose(currentBeat.id, { id: 'stop', label: 'Stop Interrogating', nextBeat: currentBeat.nextBeat })}
                      className={styles.optionBtn}
                      style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}
                    >
                      Leave
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className={styles.interactionOptions}>
              {currentBeat.options?.map(opt => {
                const wasInterrogated = selectedOptions['q_' + opt.id] === 'stop'
                return (
                  <button
                    key={opt.id}
                    className={styles.optionBtn}
                    onClick={() => choose(currentBeat.id, opt)}
                    style={{
                      opacity: wasInterrogated ? 0.6 : 1,
                      textDecoration: wasInterrogated ? 'line-through' : 'none'
                    }}
                  >
                    <span className={styles.optionEmoji}>
                      {wasInterrogated ? '✅' : opt.emoji || '👤'}
                    </span>
                    <span>{opt.label}</span>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Complete overlay */}
      {isComplete && (
        <div className={styles.completeOverlay}>
          <div className={styles.completeBadge}>✓ Story Complete</div>
          <button className={styles.restartLink} onClick={restart}>Listen Again</button>
        </div>
      )}
    </div>
  )
}
