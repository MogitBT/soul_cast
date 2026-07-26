import { useState, useRef, useEffect } from 'react'
import styles from './HomeView.module.css'

// ─── AI-Generated Images (served from public/ai-art/) ─────────────────────
const HERO_IMG_1 = '/ai-art/hero_pocket_cases_1785016126539.jpg'
const HERO_IMG_2 = '/ai-art/hero_bechara_billionaire_1785016145658.jpg'
const HERO_IMG_3 = '/ai-art/hero_love_untold_1785016162591.jpg'

const POSTER_IMG = {
  dark_ritual:    '/ai-art/poster_dark_ritual_1785016182269.jpg',
  tiger_queen:    '/ai-art/poster_tiger_queen_1785016191822.jpg',
  love_untold:    '/ai-art/poster_love_untold_1785016209534.jpg',
  sultans_heir:   '/ai-art/poster_sultans_heir_1785016219005.jpg',
  desert_storm:   '/ai-art/poster_desert_storm_1785016236852.jpg',
  ek_ladki:       '/ai-art/poster_ek_ladki_1785016246640.jpg',
  night_watch:    '/ai-art/poster_night_watch_1785016267268.jpg',
  shadow_king:    '/ai-art/poster_shadow_king_1785016276139.jpg',
}

const HERO_SLIDES = [
  {
    title: 'Pocket', titleAccent: 'Cases',
    kicker: 'Pocket FM Originals',
    genre: 'Mystery', rating: '4.8', plays: '78.2M', votes: '8.7K', age: 'U/A 13+',
    desc: 'Three playable story rooms with voice, clues, moral choices, and worlds that remember.',
    native: 'पॉकेट केसेस · پاکٹ کیسز',
    img: HERO_IMG_1,
    overlay: 'linear-gradient(90deg, rgba(10,2,20,0.95) 0%, rgba(10,2,20,0.7) 50%, rgba(10,2,20,0.2) 100%)',
    accent: '#ED4255',
  },
  {
    title: 'Bechara', titleAccent: 'Billionaire',
    kicker: 'Pocket FM Originals',
    genre: 'Drama', rating: '4.8', plays: '78.2M', votes: '8.7K', age: 'U/A 18+',
    desc: 'A rags-to-riches story of a man who bets everything on one last chance.',
    native: 'बेचारा बिलियनेयर · بیچارہ بلینئر',
    img: HERO_IMG_2,
    overlay: 'linear-gradient(90deg, rgba(10,8,0,0.95) 0%, rgba(10,8,0,0.7) 50%, rgba(10,8,0,0.2) 100%)',
    accent: '#FBB64A',
  },
  {
    title: 'Love', titleAccent: 'Untold',
    kicker: 'Top Trending',
    genre: 'Romance', rating: '4.9', plays: '396M', votes: '12K', age: 'U/A 16+',
    desc: 'A story of love that defied time, distance, and destiny.',
    native: 'लव अनटोल्ड · لوو انٹولڈ',
    img: HERO_IMG_3,
    overlay: 'linear-gradient(90deg, rgba(10,0,8,0.95) 0%, rgba(10,0,8,0.7) 50%, rgba(10,0,8,0.2) 100%)',
    accent: '#50BBB6',
  },
]

const POSTERS = [
  { title: 'Dark Ritual',  tag: '176M+', color: '#ED4255', sub: 'Horror',   imgKey: 'dark_ritual',  nav: 'pocketfm' },
  { title: 'Tiger Queen',  tag: '24.2M', color: '#FBB64A', sub: 'Drama',    imgKey: 'tiger_queen'  },
  { title: 'Love Untold',  tag: '396M+', color: '#50BBB6', sub: 'Romance',  imgKey: 'love_untold'  },
  { title: "Sultan's Heir",tag: '18+',   color: '#83ECB8', sub: 'Action',   imgKey: 'sultans_heir' },
  { title: 'Desert Storm', tag: '142M+', color: '#ED4255', sub: 'Thriller', imgKey: 'desert_storm' },
  { title: 'Ek Ladki',     tag: '88M+',  color: '#FBB64A', sub: 'Romance',  imgKey: 'ek_ladki'     },
  { title: 'Night Watch',  tag: '54M+',  color: '#50BBB6', sub: 'Mystery',  imgKey: 'night_watch'  },
  { title: 'Shadow King',  tag: '31M+',  color: '#83ECB8', sub: 'Fantasy',  imgKey: 'shadow_king'  },
]

const CTA_CARDS = [
  { id: 'murder', icon: '🔍', title: 'Murder Case',   sub: 'Solve who did it',   accent: '#ED4255' },
  { id: 'escape', icon: '🗝️', title: 'Escape Case',   sub: 'Find the way out',  accent: '#50BBB6' },
  { id: 'story',  icon: '🎙️', title: 'SoulCast',      sub: 'Shape the story',   accent: '#FBB64A' },
]

function PosterCard({ title, tag, color, sub, imgKey, onClick }) {
  return (
    <div className={styles.poster} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={styles.posterImg}>
        <img
          src={POSTER_IMG[imgKey]}
          alt={title}
          className={styles.posterImgEl}
          onError={e => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.style.background = `linear-gradient(160deg,${color}44,#0a0a12)`
          }}
        />
        <span className={styles.posterTag}
          style={{ color, borderColor: `${color}55`, background: `${color}18` }}>
          {tag}
        </span>
        <div className={styles.posterGradient} />
      </div>
      <p className={styles.posterTitle}>{title}</p>
      <p className={styles.posterSub}>{sub}</p>
    </div>
  )
}

export default function HomeView({ onNav }) {
  const [slide, setSlide] = useState(0)
  const rowRef = useRef(null)
  const hero = HERO_SLIDES[slide]
  const scrollRow = dir => {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <div className={styles.home}>
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <img
          key={slide}
          src={hero.img}
          alt={hero.title}
          className={styles.heroBgImg}
          onError={e => { e.currentTarget.style.opacity = '0' }}
        />
        <div className={styles.heroOverlay} style={{ background: hero.overlay }} />
        <div className={styles.heroBottomFade} />
        <div className={styles.heroDeco} style={{ background: hero.accent }} />

        <div className={styles.heroCopy}>
          <p className={styles.heroKicker}>{hero.kicker}</p>
          <h2 className={styles.heroTitle}>
            <span>{hero.title}</span>{' '}
            <span style={{ color: hero.accent }}>{hero.titleAccent}</span>
          </h2>

          <div className={styles.heroMeta}>
            <span className={styles.metaPlays}>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              {hero.plays} Plays
            </span>
            <span className={styles.metaRating}>★ {hero.rating} <small>| {hero.votes}</small></span>
            <span className={styles.metaChip}>{hero.genre}</span>
            <span className={styles.metaChip}>{hero.age}</span>
          </div>

          <p className={styles.heroDesc}>{hero.desc}</p>

          <div className={styles.heroActions}>
            <button
              className={styles.btnPlay}
              style={{ background: hero.accent, boxShadow: `0 8px 28px ${hero.accent}55` }}
              onClick={() => onNav('games')}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Play Now
            </button>
            <button className={styles.btnInfo}>More Info</button>
          </div>

          <p className={styles.heroNative}>{hero.native}</p>
        </div>

        <button
          className={styles.heroRoundBtn}
          style={{ background: hero.accent, boxShadow: `0 14px 36px ${hero.accent}55` }}
          onClick={() => onNav('games')}
        >▶</button>
      </section>

      {/* ── Carousel Thumbnails ──────────────────────────────── */}
      <div className={styles.carouselRow}>
        <button className={styles.carArrow} onClick={() => setSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}>‹</button>
        <div className={styles.carThumbs}>
          {HERO_SLIDES.map((s, i) => (
            <button
              key={i}
              className={`${styles.carThumb} ${i === slide ? styles.carThumbActive : ''}`}
              onClick={() => setSlide(i)}
              style={i === slide ? { borderColor: s.accent } : {}}
            >
              <img
                src={s.img}
                alt={s.title}
                className={styles.thumbImg}
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
            </button>
          ))}
        </div>
        <button className={styles.carArrow} onClick={() => setSlide(s => (s + 1) % HERO_SLIDES.length)}>›</button>
      </div>

      {/* ── Top Picks Row ─────────────────────────────────────── */}
      <section className={styles.rowSection}>
        <div className={styles.rowHead}>
          <h3>Top Picks for <span style={{ color: 'var(--red)' }}>Guest</span></h3>
          <div className={styles.rowNav}>
            <button className={styles.rowArrow} onClick={() => scrollRow(-1)}>‹</button>
            <button className={styles.rowArrow} onClick={() => scrollRow(1)}>›</button>
          </div>
        </div>
        <div className={styles.posterRow} ref={rowRef}>
          {POSTERS.map((p, i) => (
            <PosterCard
              key={i}
              {...p}
              onClick={p.nav ? () => onNav(p.nav) : undefined}
            />
          ))}
        </div>
      </section>



      {/* ── Interactive Story Rooms CTA ────────────────────────── */}
      <section className={styles.rowSection}>
        <div className={styles.rowHead}>
          <h3>Interactive Story Rooms</h3>
        </div>
        <div className={styles.ctaRow}>
          {CTA_CARDS.map(card => (
            <div
              key={card.id}
              className={styles.ctaCard}
              style={{ '--card-accent': card.accent }}
              onClick={() => onNav('games')}
            >
              <div className={styles.ctaThumb} style={{ background: `${card.accent}22` }}>
                <span className={styles.ctaThumbIcon}>{card.icon}</span>
              </div>
              <div>
                <p className={styles.ctaTitle}>{card.title}</p>
                <p className={styles.ctaSub}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
