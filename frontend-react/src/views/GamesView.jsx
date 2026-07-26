import { useState, useEffect } from 'react'
import MurderMysteryGame  from '../games/murder/MurderMysteryGame'
import EscapeRoomGame     from '../games/escape/EscapeRoomGame'
import DivergentStoryGame from '../games/story/DivergentStoryGame'
import DynamicAdminGame   from '../games/shared/DynamicAdminGame'
import styles from './GamesView.module.css'

const DEFAULT_SERIES = [
  {
    id: 'murder',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    imgOverlay: 'linear-gradient(to bottom, rgba(10,2,6,0.2) 0%, transparent 30%, rgba(14,2,9,0.88) 100%)',
    title: 'The Ashford Murders',
    genre: 'Murder Mystery',
    tagline: 'Every case is different. Every killer is real.',
    blurb: 'A new killer, motive, and evidence set every time you play. Interrogate suspects, read between the lines, and deliver your verdict.',
    accent: '#ED4255',
    shadowColor: 'rgba(237, 66, 85, 0.45)',
    rating: '4.9',
    plays: '1.2M plays',
    tags: ['Generative', 'Voice Narrated', 'Interactive'],
    badge: 'NEW CASE EVERY TIME',
  },
  {
    id: 'escape',
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
    imgOverlay: 'linear-gradient(to bottom, rgba(2,14,14,0.25) 0%, rgba(2,14,14,0.05) 40%, rgba(2,14,14,0.92) 100%)',
    title: 'Locked',
    genre: 'AI Escape Room',
    tagline: 'A room with no instructions. Only your attention.',
    blurb: 'You wake inside a Victorian study. One locked door. The room holds the answer — if you know how to look.',
    accent: '#50BBB6',
    shadowColor: 'rgba(80, 187, 182, 0.38)',
    rating: '4.8',
    plays: '876K plays',
    tags: ['Puzzle', 'Atmospheric', 'Branching'],
    badge: 'PUZZLE',
  },
  {
    id: 'story',
    img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    imgOverlay: 'linear-gradient(to bottom, rgba(10,7,0,0.25) 0%, rgba(10,7,0,0.1) 35%, rgba(10,7,0,0.9) 100%)',
    title: 'SoulCast: The Delhi Drop',
    genre: 'SoulCast',
    tagline: 'Your choices shape the podcast.',
    blurb: 'A gritty interactive thriller. You are a fixer driving through Delhi with a mysterious briefcase. What you do next changes the story.',
    accent: '#FBB64A',
    shadowColor: 'rgba(251, 182, 74, 0.38)',
    rating: '4.9',
    plays: '2.1M plays',
    tags: ['Drama', 'Choice-Driven', 'Replayable'],
    badge: 'SOULCAST',
  },
]

function StarRating({ value }) {
  return (
    <span className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} viewBox="0 0 12 12" width="11" height="11"
             fill={i <= Math.round(parseFloat(value)) ? '#FBB64A' : 'rgba(255,255,255,0.2)'}>
          <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8.02l-2.78 1.53.53-3.09L1.5 4.27l3.11-.45z"/>
        </svg>
      ))}
      <span className={styles.ratingVal}>{value}</span>
    </span>
  )
}

function SeriesTile({ series, onPlay }) {
  return (
    <article
      className={styles.tile}
      style={{ '--tile-accent': series.accent, '--tile-shadow': series.shadowColor }}
      onClick={() => onPlay(series)}
    >
      {/* Artwork panel */}
      <div className={styles.tileArt}>
        <img src={series.img} alt={series.title} className={styles.tileImg} />
        <div className={styles.tileImgOverlay} style={{ background: series.imgOverlay }} />

        {/* Floating badge top-left */}
        <div className={styles.tileBadge} style={{ borderColor: series.accent, color: series.accent }}>
          {series.badge}
        </div>

        {/* Genre pill bottom */}
        <div className={styles.tileGenrePill}>{series.genre}</div>
      </div>

      {/* Metadata panel */}
      <div className={styles.tileMeta}>
        <div className={styles.tileTopRow}>
          <StarRating value={series.rating} />
          <span className={styles.tilePlays}>
            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            {series.plays}
          </span>
        </div>

        <h3 className={styles.tileTitle}>{series.title}</h3>
        <p className={styles.tileTagline}>{series.tagline}</p>
        <p className={styles.tileBlurb}>{series.blurb}</p>

        <div className={styles.tileTags}>
          {series.tags.map(t => (
            <span key={t} className={styles.tileTag}>{t}</span>
          ))}
        </div>

        <button
          className={styles.tileCta}
          style={{ background: series.accent }}
          onClick={e => { e.stopPropagation(); onPlay(series) }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Listen Now
        </button>
      </div>
    </article>
  )
}

export default function GamesView() {
  const [activeGame, setActiveGame] = useState(null)
  const [dynamicCases, setDynamicCases] = useState([])

  useEffect(() => {
    fetch('/api/user_api/cases/featured')
      .then(res => res.json())
      .then(data => {
        if (data.cases) {
          const mapped = data.cases.map(c => {
            const gs = c.game_state || {}
            
            // Generate appropriate fallback image based on mode if no cover generated
            let fallback = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&h=600&q=80'
            if (c.mode === 'escape_case') fallback = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&h=600&q=80'
            if (c.mode === 'living_story') fallback = 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&h=600&q=80'

            return {
              id: c.id,
              isCustom: true,
              rawCase: c,
              img: gs.cover_image || fallback,
              imgOverlay: 'linear-gradient(to bottom, rgba(10,2,6,0.2) 0%, transparent 30%, rgba(14,2,9,0.88) 100%)',
              title: c.title || 'Untitled Case',
              genre: c.mode === 'murder_case' ? 'Murder Mystery' : c.mode === 'escape_case' ? 'Escape Room' : 'SoulCast',
              tagline: gs.hook || 'A new mystery awaits.',
              blurb: gs.setting || 'Step into the unknown.',
              accent: '#ED4255',
              shadowColor: 'rgba(237, 66, 85, 0.45)',
              rating: '5.0',
              plays: 'NEW',
              tags: ['AI Generated', 'Interactive'],
              badge: 'COMMUNITY'
            }
          })
          setDynamicCases(mapped)
        }
      })
      .catch(() => {})
  }, [])

  const back = () => setActiveGame(null)

  if (activeGame === 'murder') return <MurderMysteryGame  onBack={back} />
  if (activeGame === 'escape') return <EscapeRoomGame     onBack={back} />
  if (activeGame === 'story')  return <DivergentStoryGame onBack={back} />
  if (activeGame && activeGame.isCustom) return <DynamicAdminGame publishedCase={activeGame.rawCase} onBack={back} />

  const handlePlay = (series) => {
    if (series.isCustom) {
      setActiveGame(series)
    } else {
      setActiveGame(series.id)
    }
  }

  const allSeries = [...DEFAULT_SERIES, ...dynamicCases]

  return (
    <div className={styles.lobby}>
      <div className={styles.lobbyHead}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          Verdicts · Interactive Audio Stories
        </p>
        <h1 className={styles.lobbyTitle}>Story Mode</h1>
        <p className={styles.lobbyDesc}>
          Interactive audio series. Listen, make choices, and shape the outcome.
          Each one is a different kind of story intelligence.
        </p>
      </div>

      <div className={styles.tileGrid}>
        {allSeries.map(s => (
          <SeriesTile key={s.id} series={s} onPlay={handlePlay} />
        ))}
      </div>
    </div>
  )
}
