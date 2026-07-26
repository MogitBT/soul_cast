// Custom SVG story illustrations — one per story, thematically relevant.
// Each component fills its container absolutely.

const S = { width: '100%', height: '100%', position: 'absolute', inset: 0, display: 'block' }

/* ─── HERO SLIDES (landscape 800×400) ──────────────────────────────────── */

export function HeroPocketCases() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="hpc_sky" cx="35%" cy="60%" r="85%">
          <stop offset="0%" stopColor="#1e0430" />
          <stop offset="100%" stopColor="#03000a" />
        </radialGradient>
        <radialGradient id="hpc_lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBB64A" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FBB64A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hpc_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ED4255" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ED4255" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="400" fill="url(#hpc_sky)" />

      {/* Rain streaks */}
      {[...Array(38)].map((_, i) => (
        <line key={i}
          x1={10 + i * 21} y1={(i * 47) % 180}
          x2={5 + i * 21} y2={(i * 47) % 180 + 38}
          stroke="rgba(180,210,255,0.09)" strokeWidth="0.7" />
      ))}

      {/* Distant fog band */}
      <rect x="0" y="240" width="800" height="40" fill="#100022" opacity="0.5" />

      {/* City silhouette */}
      <g fill="#07000e">
        <rect x="0" y="260" width="800" height="140" />
        <rect x="28" y="198" width="44" height="202" />
        <rect x="85" y="218" width="34" height="182" />
        <rect x="130" y="172" width="58" height="228" />
        <rect x="198" y="228" width="32" height="172" />
        <rect x="240" y="155" width="68" height="245" />
        <rect x="318" y="212" width="30" height="188" />
        <rect x="358" y="192" width="52" height="208" />
        <rect x="592" y="208" width="44" height="192" />
        <rect x="648" y="182" width="60" height="218" />
        <rect x="718" y="222" width="38" height="178" />
        <rect x="766" y="198" width="34" height="202" />
      </g>

      {/* Windows */}
      {[[253,172],[269,172],[253,192],[269,192],[253,212],[269,212],
        [143,188],[156,188],[143,208],[143,228],
        [362,208],[376,208],[362,228],[376,228],
        [655,198],[668,198],[655,218]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="7" height="9" rx="1"
          fill="#FBB64A" opacity={0.45 + (i % 3) * 0.15} />
      ))}

      {/* Street */}
      <rect x="0" y="392" width="800" height="8" fill="#0a001a" />

      {/* Street lamp */}
      <line x1="570" y1="392" x2="570" y2="268" stroke="#180a28" strokeWidth="5" />
      <path d="M570 268 C570 252 592 246 596 260" stroke="#180a28" strokeWidth="4" fill="none" />
      <ellipse cx="598" cy="263" rx="12" ry="6" fill="#FBB64A" opacity="0.85" />
      <ellipse cx="598" cy="268" rx="55" ry="40" fill="url(#hpc_lamp)" />

      {/* Detective silhouette */}
      <g transform="translate(415,128)" fill="#06000c">
        {/* Hat */}
        <ellipse cx="0" cy="38" rx="33" ry="8" />
        <path d="M-22 37 L-17 6 Q0,-2 17 6 L22 37 Z" />
        {/* Head */}
        <ellipse cx="0" cy="57" rx="17" ry="21" />
        {/* Trench coat */}
        <path d="M-17 78 L-42 172 L42 172 L17 78 Z" />
        <path d="M-17 78 L0 105 L17 78" fill="#0e0020" />
        {/* Left arm */}
        <path d="M-40 95 L-62 148 L-52 150 L-30 100 Z" />
        {/* Right arm */}
        <path d="M40 95 L58 138 L48 142 L30 100 Z" />
        {/* Magnifying glass */}
        <circle cx="64" cy="152" r="22" fill="none" stroke="#06000c" strokeWidth="7" />
        <circle cx="64" cy="152" r="16" fill="#1a042e" opacity="0.4" />
        <line x1="79" y1="167" x2="94" y2="184" stroke="#06000c" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Red accent glow at detective's feet */}
      <ellipse cx="415" cy="392" rx="130" ry="18" fill="url(#hpc_glow)" />

      {/* Bottom mist */}
      <rect x="0" y="368" width="800" height="32" fill="#09001e" opacity="0.55" />
    </svg>
  )
}

export function HeroBillionaire() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <linearGradient id="hb_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050508" />
          <stop offset="60%" stopColor="#1a0e00" />
          <stop offset="100%" stopColor="#3d1e00" />
        </linearGradient>
        <radialGradient id="hb_sun" cx="62%" cy="72%" r="35%">
          <stop offset="0%" stopColor="#FBB64A" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ED6A1A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ED6A1A" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="400" fill="url(#hb_sky)" />
      <rect width="800" height="400" fill="url(#hb_sun)" />

      {/* Horizon glow */}
      <ellipse cx="490" cy="390" rx="260" ry="60" fill="#FBB64A" opacity="0.12" />

      {/* City silhouettes — tall skyscrapers */}
      <g fill="#0a0600">
        <rect x="0" y="320" width="800" height="80" />
        {/* BG layer */}
        <rect x="10" y="240" width="28" height="160" />
        <rect x="50" y="200" width="22" height="200" />
        <rect x="82" y="185" width="30" height="215" />
        <rect x="122" y="160" width="25" height="240" />
        <rect x="156" y="220" width="18" height="180" />
        <rect x="184" y="145" width="35" height="255" />
        <rect x="228" y="170" width="24" height="230" />
        <rect x="260" y="210" width="20" height="190" />
        {/* Tall center towers */}
        <rect x="340" y="80" width="40" height="320" />
        <rect x="390" y="60" width="50" height="340" />
        <rect x="450" y="100" width="38" height="300" />
        {/* BG right */}
        <rect x="530" y="180" width="30" height="220" />
        <rect x="568" y="155" width="40" height="245" />
        <rect x="618" y="195" width="26" height="205" />
        <rect x="652" y="168" width="35" height="232" />
        <rect x="696" y="200" width="28" height="200" />
        <rect x="734" y="185" width="32" height="215" />
        <rect x="775" y="220" width="25" height="180" />
      </g>

      {/* Golden window grids */}
      {[[344,88],[352,88],[344,108],[352,108],[344,128],[352,128],[344,148],[352,148],
        [394,68],[402,68],[394,88],[402,88],[394,108],[402,108],[394,128],[402,128],
        [454,108],[462,108],[454,128],[462,128]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="6" height="10" rx="1"
          fill="#FBB64A" opacity={0.35 + (i % 4) * 0.12} />
      ))}

      {/* Helicopter silhouette */}
      <g transform="translate(680,120)" fill="#08050a" opacity="0.9">
        <ellipse cx="0" cy="0" rx="28" ry="8" />
        <rect x="-6" y="-18" width="12" height="22" rx="4" />
        <line x1="-28" y1="-2" x2="28" y2="-2" stroke="#08050a" strokeWidth="3" />
        <line x1="-20" y1="-18" x2="20" y2="-18" stroke="#08050a" strokeWidth="2" />
        <line x1="28" y1="-2" x2="44" y2="2" stroke="#08050a" strokeWidth="2" />
        <rect x="38" y="-4" width="8" height="6" rx="2" />
      </g>

      {/* Bottom road reflection */}
      <rect x="0" y="375" width="800" height="25" fill="#1a0c00" />
      {[...Array(12)].map((_, i) => (
        <rect key={i} x={50 + i * 63} y="378" width="28" height="4" rx="2"
          fill="#FBB64A" opacity="0.18" />
      ))}
    </svg>
  )
}

export function HeroLoveUntold() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <linearGradient id="hlu_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#04020e" />
          <stop offset="50%" stopColor="#0e0525" />
          <stop offset="100%" stopColor="#1a083a" />
        </linearGradient>
        <radialGradient id="hlu_moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4c8f0" />
          <stop offset="70%" stopColor="#8a70c8" />
          <stop offset="100%" stopColor="#4a2890" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hlu_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#50BBB6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#50BBB6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="400" fill="url(#hlu_sky)" />

      {/* Stars */}
      {[...Array(70)].map((_, i) => {
        const x = (i * 137.5) % 800
        const y = (i * 83) % 260
        const r = i % 5 === 0 ? 1.5 : 0.7
        return <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.3 + (i % 4) * 0.18} />
      })}

      {/* Moon */}
      <circle cx="620" cy="90" r="48" fill="url(#hlu_moon)" />
      <circle cx="620" cy="90" r="48" fill="none" stroke="#d4c8f0" strokeWidth="1" opacity="0.3" />
      {/* Moon craters */}
      <circle cx="602" cy="78" r="9" fill="#8a70c8" opacity="0.35" />
      <circle cx="635" cy="102" r="6" fill="#8a70c8" opacity="0.25" />

      {/* Teal glow at horizon */}
      <ellipse cx="400" cy="400" rx="300" ry="60" fill="url(#hlu_glow)" />

      {/* Rolling hills */}
      <path d="M0 360 Q100 300 200 340 Q300 380 400 320 Q500 260 600 300 Q700 340 800 310 L800 400 L0 400 Z"
        fill="#0a0520" />
      <path d="M0 380 Q150 340 300 370 Q450 400 600 350 Q700 330 800 360 L800 400 L0 400 Z"
        fill="#07031a" />

      {/* Couple silhouette */}
      <g transform="translate(355,262)" fill="#050210">
        {/* Woman */}
        <ellipse cx="0" cy="-72" rx="10" ry="13" />
        <path d="M-16 -58 Q-2 -40 -2 0 Q-20 5 -22 0 L-16 -58 Z" />
        <path d="M2 -58 Q-2 -40 -2 0 L2 0 Z" />
        {/* Hair */}
        <path d="M-10 -82 Q0 -90 10 -82 Q15 -72 12 -58 Q0 -62 -12 -58 Q-15 -72 -10 -82 Z" />
        {/* Man */}
        <ellipse cx="28" cy="-78" rx="11" ry="14" />
        <path d="M14 -64 L14 0 L42 0 L42 -64 Z" rx="2" />
        {/* Arms intertwined */}
        <path d="M2 -40 Q15 -30 14 -40" stroke="#050210" strokeWidth="4" fill="none" />
      </g>

      {/* Fireflies / floating lights */}
      {[[180,310],[220,290],[450,280],[510,300],[560,270],[650,295]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#83ECB8" opacity={0.5 + (i % 2) * 0.3} />
      ))}
    </svg>
  )
}

/* ─── POSTER CARDS (portrait 300×400) ─────────────────────────────────── */

export function DarkRitualArt() {
  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="dr_bg" cx="50%" cy="55%" r="65%">
          <stop offset="0%" stopColor="#7a0012" />
          <stop offset="45%" stopColor="#2a0020" />
          <stop offset="100%" stopColor="#04000c" />
        </radialGradient>
        <radialGradient id="dr_moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#cc1122" />
          <stop offset="60%" stopColor="#880011" />
          <stop offset="100%" stopColor="#660010" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="url(#dr_bg)" />

      {/* Texture streaks */}
      {[...Array(8)].map((_, i) => (
        <line key={i} x1={i * 45} y1="0" x2={i * 45 + 20} y2="400"
          stroke="rgba(180,0,30,0.04)" strokeWidth="30" />
      ))}

      {/* Blood moon */}
      <circle cx="150" cy="118" r="58" fill="url(#dr_moon)" />
      <circle cx="150" cy="118" r="58" fill="none" stroke="#FF1A2E" strokeWidth="1.5" opacity="0.4" />
      <circle cx="150" cy="118" r="48" fill="#AA0018" opacity="0.35" />
      <circle cx="132" cy="102" r="10" fill="#770010" opacity="0.45" />
      <circle cx="168" cy="128" r="7" fill="#770010" opacity="0.35" />
      <ellipse cx="150" cy="118" rx="58" ry="58" fill="none" stroke="#FF3344" strokeWidth="3" opacity="0.12" />

      {/* Tree silhouettes left */}
      <path d="M18 400 L18 268 L2 218 L18 228 L8 172 L20 185 L12 140 L22 155 L18 268"
        fill="#06000e" />
      <path d="M48 400 L48 288 L32 242 L48 250 L40 196 L50 208 L44 162 L55 178 L48 288"
        fill="#06000e" />
      <path d="M4 400 L6 310 L-4 275 L6 282 L-2 240 L6 248 L4 310" fill="#06000e" />

      {/* Tree silhouettes right */}
      <path d="M282 400 L282 268 L298 218 L282 228 L292 172 L280 185 L288 140 L278 155 L282 268"
        fill="#06000e" />
      <path d="M252 400 L252 288 L268 242 L252 250 L260 196 L250 208 L256 162 L245 178 L252 288"
        fill="#06000e" />

      {/* Ground */}
      <ellipse cx="150" cy="400" rx="180" ry="30" fill="#0c0018" />

      {/* Ritual circle */}
      <circle cx="150" cy="348" r="52" fill="none" stroke="#CC0020" strokeWidth="1.5"
        strokeDasharray="5 4" opacity="0.75" />
      <circle cx="150" cy="348" r="36" fill="none" stroke="#CC0020" strokeWidth="0.8" opacity="0.5" />

      {/* Pentagram dots */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180
        return (
          <circle key={i} cx={150 + 52 * Math.cos(rad)} cy={348 + 52 * Math.sin(rad)}
            r="4" fill="#FF1A2E" opacity="0.9" />
        )
      })}

      {/* Candles */}
      {[[138, 362], [155, 366], [168, 360]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="4" height={16 - i * 2} fill="#F5E0A0" opacity="0.85" />
          <ellipse cx={x + 2} cy={y - 1} rx="2.5" ry="4" fill="#FF9900" opacity="0.9" />
          <ellipse cx={x + 2} cy={y + 2} rx="6" ry="3" fill="#FF9900" opacity="0.15" />
        </g>
      ))}
    </svg>
  )
}

export function TigerQueenArt() {
  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="tq_bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#7a3200" />
          <stop offset="50%" stopColor="#3a1200" />
          <stop offset="100%" stopColor="#080300" />
        </radialGradient>
        <radialGradient id="tq_eye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBB64A" />
          <stop offset="60%" stopColor="#E8820A" />
          <stop offset="100%" stopColor="#8B4000" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="url(#tq_bg)" />

      {/* Tiger stripe texture */}
      {[...Array(10)].map((_, i) => (
        <path key={i}
          d={`M${-40 + i * 40} 0 L${-20 + i * 40} 0 L${i * 40} 400 L${-20 + i * 40} 400 Z`}
          fill="#000" opacity="0.25" />
      ))}

      {/* Large tiger eye — center piece */}
      <ellipse cx="150" cy="185" rx="90" ry="52" fill="url(#tq_eye)" />
      <ellipse cx="150" cy="185" rx="90" ry="52" fill="none" stroke="#FBB64A" strokeWidth="2" opacity="0.5" />
      {/* Pupil */}
      <ellipse cx="150" cy="185" rx="18" ry="46" fill="#0a0300" />
      {/* Eye highlight */}
      <ellipse cx="128" cy="170" rx="10" ry="8" fill="white" opacity="0.2" />
      <ellipse cx="128" cy="170" rx="5" ry="4" fill="white" opacity="0.4" />
      {/* Eye lashes / fur */}
      {[-70, -50, -30, 30, 50, 70].map((dx, i) => (
        <line key={i}
          x1={150 + dx} y1={185 - 52 + (Math.abs(dx) > 50 ? 8 : 3)}
          x2={150 + dx * 1.15} y2={185 - 65 + (Math.abs(dx) > 50 ? 8 : 0)}
          stroke="#FBB64A" strokeWidth="2.5" opacity="0.7" />
      ))}

      {/* Crown */}
      <g transform="translate(150,52)" fill="#FBB64A">
        <path d="M-55 35 L-55 -5 L-30 20 L0 -20 L30 20 L55 -5 L55 35 Z" />
        <rect x="-55" y="35" width="110" height="12" rx="3" />
        {/* Gems */}
        <circle cx="0" cy="0" r="8" fill="#ED4255" />
        <circle cx="-30" cy="15" r="5" fill="#50BBB6" />
        <circle cx="30" cy="15" r="5" fill="#50BBB6" />
      </g>

      {/* Nose bridge */}
      <path d="M135 235 Q150 260 165 235" fill="none" stroke="#E8820A" strokeWidth="2" opacity="0.6" />
      {/* Whiskers */}
      <line x1="60" y1="250" x2="130" y2="240" stroke="#FBB64A" strokeWidth="1" opacity="0.5" />
      <line x1="60" y1="260" x2="130" y2="255" stroke="#FBB64A" strokeWidth="1" opacity="0.5" />
      <line x1="170" y1="240" x2="240" y2="250" stroke="#FBB64A" strokeWidth="1" opacity="0.5" />
      <line x1="170" y1="255" x2="240" y2="260" stroke="#FBB64A" strokeWidth="1" opacity="0.5" />

      {/* Bottom text area gradient */}
      <rect x="0" y="320" width="300" height="80" fill="#0a0500" opacity="0.7" />
    </svg>
  )
}

export function LoveUntoldPosterArt() {
  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="lup_bg" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#450038" />
          <stop offset="55%" stopColor="#1a0025" />
          <stop offset="100%" stopColor="#04000c" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="url(#lup_bg)" />

      {/* Stars */}
      {[...Array(55)].map((_, i) => {
        const x = (i * 97.5) % 300
        const y = (i * 67) % 280
        return <circle key={i} cx={x} cy={y} r={i % 6 === 0 ? 1.8 : 0.8}
          fill="white" opacity={0.2 + (i % 5) * 0.15} />
      })}

      {/* Moon */}
      <circle cx="220" cy="68" r="34" fill="#e0d0f8" opacity="0.8" />
      <circle cx="232" cy="62" r="30" fill="#1a0025" opacity="0.88" />

      {/* Couple silhouette on hill */}
      <path d="M0 310 Q80 268 150 280 Q220 292 300 270 L300 400 L0 400 Z" fill="#0e0018" />
      <path d="M0 340 Q100 310 200 330 Q260 342 300 320 L300 400 L0 400 Z" fill="#080010" />

      {/* Woman silhouette */}
      <g transform="translate(128,248)" fill="#05000e">
        <ellipse cx="0" cy="-22" rx="9" ry="12" />
        <path d="M-8 -10 Q-16 10 -12 36 Q0 42 12 36 Q16 10 8 -10 Z" />
        <path d="M-8 -10 Q-18 5 -20 20 L-12 22 Q-12 8 -8 -10 Z" />
        <path d="M-4 -30 Q4 -38 10 -26 Q14 -18 10 -10 Q2 -14 -4 -10 Q-8 -18 -4 -30 Z" />
      </g>

      {/* Man silhouette */}
      <g transform="translate(155,242)" fill="#05000e">
        <ellipse cx="0" cy="-26" rx="10" ry="13" />
        <rect x="-11" y="-13" width="22" height="44" rx="2" />
        <path d="M-11 -8 L-22 18 L-15 20 L-11 -8 Z" />
        <path d="M11 -8 L22 18 L15 20 L11 -8 Z" />
      </g>

      {/* Floating hearts */}
      {[[148,190],[168,160],[125,172],[108,140],[175,145]].map(([x, y], i) => (
        <path key={i}
          d={`M${x} ${y + 6} Q${x - 10} ${y - 2} ${x} ${y + 14} Q${x + 10} ${y - 2} ${x} ${y + 6} Z`}
          fill="#ED4255" opacity={0.35 + i * 0.1}
          transform={`scale(${0.7 + i * 0.12})`}
          style={{ transformOrigin: `${x}px ${y + 6}px` }} />
      ))}

      {/* Teal shimmer line at horizon */}
      <line x1="0" y1="278" x2="300" y2="270" stroke="#50BBB6" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

export function SultansHeirArt() {
  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <linearGradient id="sh_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#030c10" />
          <stop offset="60%" stopColor="#041820" />
          <stop offset="100%" stopColor="#062830" />
        </linearGradient>
        <radialGradient id="sh_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#83ECB8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#83ECB8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="url(#sh_sky)" />

      {/* Stars scattered */}
      {[...Array(45)].map((_, i) => {
        const x = (i * 113) % 300, y = (i * 71) % 220
        return <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 1.6 : 0.7}
          fill="#83ECB8" opacity={0.15 + (i % 5) * 0.12} />
      })}

      {/* Crescent moon */}
      <circle cx="150" cy="80" r="46" fill="#c8f0e0" opacity="0.85" />
      <circle cx="166" cy="74" r="40" fill="#041820" opacity="0.95" />

      {/* Star */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const r1 = 12, r2 = 5
        const a1 = (deg - 90) * Math.PI / 180
        const a2 = (deg - 90 + 36) * Math.PI / 180
        return <polygon key={i} points={`${198 + r1 * Math.cos(a1)},${72 + r1 * Math.sin(a1)} ${198 + r2 * Math.cos(a2)},${72 + r2 * Math.sin(a2)}`}
          fill="#c8f0e0" opacity="0.8" />
      })}
      <polygon
        points={[0, 72, 144, 216, 288].map(deg => {
          const r1 = 12, a = (deg - 90) * Math.PI / 180
          return `${198 + r1 * Math.cos(a)},${72 + r1 * Math.sin(a)}`
        }).join(' ')}
        fill="none" stroke="#c8f0e0" strokeWidth="0.5" />
      <circle cx="198" cy="72" r="12" fill="#c8f0e0" opacity="0.7"
        style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />

      {/* Mosque / palace silhouette */}
      <g fill="#040e14">
        {/* Ground */}
        <rect x="0" y="330" width="300" height="70" />
        {/* Main dome */}
        <ellipse cx="150" cy="290" rx="52" ry="42" />
        <rect x="98" y="290" width="104" height="110" />
        {/* Minarets */}
        <rect x="52" y="278" width="20" height="122" />
        <ellipse cx="62" cy="278" rx="10" ry="14" />
        <rect x="68" y="265" width="6" height="18" />
        <rect x="228" y="278" width="20" height="122" />
        <ellipse cx="238" cy="278" rx="10" ry="14" />
        <rect x="226" y="265" width="6" height="18" />
        {/* Arch windows */}
        <path d="M118 330 Q128 315 138 330 Z" fill="#062830" />
        <path d="M152 330 Q162 315 172 330 Z" fill="#062830" />
        {/* Small domes */}
        <ellipse cx="62" cy="264" rx="8" ry="6" fill="#041820" />
        <ellipse cx="238" cy="264" rx="8" ry="6" fill="#041820" />
      </g>

      {/* Glow under dome */}
      <ellipse cx="150" cy="330" rx="80" ry="15" fill="url(#sh_glow)" />

      {/* Ornamental arch at top */}
      <path d="M60 180 Q150 130 240 180" fill="none" stroke="#83ECB8" strokeWidth="1" opacity="0.25"
        strokeDasharray="4 4" />
    </svg>
  )
}

export function DesertStormArt() {
  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <linearGradient id="ds_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c0200" />
          <stop offset="40%" stopColor="#3a0c00" />
          <stop offset="100%" stopColor="#6a1e00" />
        </linearGradient>
        <radialGradient id="ds_lightning" cx="50%" cy="30%" r="40%">
          <stop offset="0%" stopColor="#fff4d0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff4d0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="url(#ds_sky)" />
      <rect width="300" height="400" fill="url(#ds_lightning)" />

      {/* Storm clouds */}
      <ellipse cx="80" cy="60" rx="90" ry="35" fill="#1a0800" opacity="0.9" />
      <ellipse cx="220" cy="50" rx="100" ry="40" fill="#1a0800" opacity="0.85" />
      <ellipse cx="150" cy="80" rx="120" ry="45" fill="#240c00" opacity="0.9" />
      <ellipse cx="60" cy="95" rx="60" ry="28" fill="#1a0600" opacity="0.7" />
      <ellipse cx="260" cy="90" rx="55" ry="25" fill="#1a0600" opacity="0.7" />

      {/* Lightning bolt */}
      <path d="M162 92 L140 162 L158 162 L128 240 L148 240 L108 310"
        stroke="#FFF4D0" strokeWidth="3" fill="none" opacity="0.9" />
      <path d="M162 92 L140 162 L158 162 L128 240 L148 240 L108 310"
        stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
      {/* Lightning glow */}
      <path d="M162 92 L140 162 L158 162 L128 240 L148 240 L108 310"
        stroke="#FBB64A" strokeWidth="8" fill="none" opacity="0.15" />

      {/* Sand dunes */}
      <path d="M0 300 Q60 255 130 275 Q200 295 270 260 Q300 248 300 255 L300 400 L0 400 Z"
        fill="#4a1800" />
      <path d="M0 340 Q80 295 170 315 Q240 330 300 305 L300 400 L0 400 Z"
        fill="#3a1200" />
      <path d="M0 370 Q100 340 200 355 Q260 362 300 345 L300 400 L0 400 Z"
        fill="#2a0c00" />
      <path d="M0 390 Q120 368 250 378 L300 370 L300 400 L0 400 Z"
        fill="#1e0800" />

      {/* Dust particles */}
      {[...Array(25)].map((_, i) => (
        <circle key={i} cx={(i * 89) % 300} cy={280 + (i * 43) % 80}
          r={1 + (i % 3) * 0.5} fill="#ED6A1A" opacity={0.2 + (i % 4) * 0.12} />
      ))}

      {/* Distant camel silhouette */}
      <g transform="translate(230,268)" fill="#1e0600" opacity="0.8">
        <ellipse cx="0" cy="0" rx="18" ry="8" />
        <path d="M-10 -8 Q-8 -22 -4 -20 Q0 -28 4 -20 Q8 -22 10 -8 Z" />
        <rect x="-14" y="8" width="5" height="14" rx="2" />
        <rect x="-4" y="8" width="5" height="16" rx="2" />
        <rect x="5" y="8" width="5" height="14" rx="2" />
        <rect x="15" y="8" width="4" height="12" rx="2" />
        <ellipse cx="-12" cy="-10" rx="5" ry="6" />
      </g>
    </svg>
  )
}

export function EkLadkiArt() {
  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="el_bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#460035" />
          <stop offset="55%" stopColor="#1e0020" />
          <stop offset="100%" stopColor="#060008" />
        </radialGradient>
        <radialGradient id="el_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF80C0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF80C0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="url(#el_bg)" />

      {/* Glow center */}
      <ellipse cx="150" cy="200" rx="120" ry="100" fill="url(#el_glow)" />

      {/* Lotus / flower — main visual */}
      <g transform="translate(150,210)">
        {/* Outer petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = deg * Math.PI / 180
          const px = 58 * Math.cos(rad), py = 58 * Math.sin(rad)
          return (
            <ellipse key={i} cx={px * 0.65} cy={py * 0.65}
              rx="18" ry="35"
              fill="#CC0060" opacity="0.55"
              transform={`rotate(${deg}, ${px * 0.65}, ${py * 0.65})`} />
          )
        })}
        {/* Mid petals */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => {
          const rad = deg * Math.PI / 180
          return (
            <ellipse key={i} cx={38 * Math.cos(rad)} cy={38 * Math.sin(rad)}
              rx="13" ry="26"
              fill="#E8007A" opacity="0.7"
              transform={`rotate(${deg}, ${38 * Math.cos(rad)}, ${38 * Math.sin(rad)})`} />
          )
        })}
        {/* Inner petals */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = deg * Math.PI / 180
          return (
            <ellipse key={i} cx={20 * Math.cos(rad)} cy={20 * Math.sin(rad)}
              rx="9" ry="18"
              fill="#FF40A0" opacity="0.85"
              transform={`rotate(${deg}, ${20 * Math.cos(rad)}, ${20 * Math.sin(rad)})`} />
          )
        })}
        {/* Center */}
        <circle cx="0" cy="0" r="14" fill="#FFD0E8" />
        <circle cx="0" cy="0" r="8" fill="#FFA0C8" />
        <circle cx="0" cy="0" r="4" fill="#FF60A0" />
      </g>

      {/* Floating petals */}
      {[[55, 120], [245, 90], [80, 310], [230, 330], [40, 220], [260, 240], [130, 65], [190, 340]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="7" ry="12"
          fill="#E8007A" opacity={0.3 + (i % 3) * 0.15}
          transform={`rotate(${i * 45}, ${x}, ${y})`} />
      ))}

      {/* Woman silhouette at bottom */}
      <g transform="translate(150,355)" fill="#08000a">
        <ellipse cx="0" cy="-28" rx="10" ry="13" />
        <path d="M-10 -15 Q-22 10 -18 45 Q0 52 18 45 Q22 10 10 -15 Z" />
        <path d="M-4 -38 Q4 -48 12 -34 Q16 -24 12 -15 Q4 -18 -4 -15 Q-8 -24 -4 -38 Z" />
        <path d="M-10 -15 Q-24 0 -26 15 L-18 18 Q-16 5 -10 -15 Z" />
        <path d="M10 -15 Q24 0 26 15 L18 18 Q16 5 10 -15 Z" />
      </g>
    </svg>
  )
}

export function NightWatchArt() {
  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="nw_bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#003040" />
          <stop offset="55%" stopColor="#001020" />
          <stop offset="100%" stopColor="#000408" />
        </radialGradient>
        <radialGradient id="nw_eye_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#50BBB6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#50BBB6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="url(#nw_bg)" />

      {/* City grid (aerial view) — tiny lit windows */}
      {[...Array(15)].map((_, row) =>
        [...Array(12)].map((_, col) => (
          <rect key={`${row}-${col}`}
            x={8 + col * 24} y={8 + row * 24}
            width={14} height={14} rx="2"
            fill="#50BBB6"
            opacity={(row + col) % 7 === 0 ? 0.55 : (row + col) % 3 === 0 ? 0.25 : 0.08} />
        ))
      )}

      {/* Large eye silhouette — surveillance */}
      <ellipse cx="150" cy="205" rx="110" ry="55" fill="#001828" />
      <ellipse cx="150" cy="205" rx="110" ry="55" fill="none"
        stroke="#50BBB6" strokeWidth="2" opacity="0.6" />
      {/* Iris */}
      <circle cx="150" cy="205" r="42" fill="url(#nw_eye_glow)" />
      <circle cx="150" cy="205" r="38" fill="#002030" />
      <circle cx="150" cy="205" r="38" fill="none" stroke="#50BBB6" strokeWidth="1.5" opacity="0.5" />
      {/* Pupil */}
      <circle cx="150" cy="205" r="18" fill="#001018" />
      <circle cx="150" cy="205" r="18" fill="none" stroke="#50BBB6" strokeWidth="1" opacity="0.4" />
      {/* Highlight */}
      <circle cx="138" cy="195" r="7" fill="#50BBB6" opacity="0.25" />
      <circle cx="138" cy="195" r="4" fill="#83ECB8" opacity="0.4" />
      {/* Eye lashes top */}
      {[-80, -50, -20, 20, 50, 80].map((dx, i) => {
        const rad = Math.asin(dx / 110)
        return (
          <line key={i}
            x1={150 + dx} y1={205 - 55 * Math.cos(rad)}
            x2={150 + dx * 1.1} y2={205 - 68 * Math.cos(rad)}
            stroke="#50BBB6" strokeWidth="2" opacity="0.5" />
        )
      })}

      {/* Scan lines */}
      {[...Array(3)].map((_, i) => (
        <line key={i} x1="0" y1={160 + i * 40} x2="300" y2={160 + i * 40}
          stroke="#50BBB6" strokeWidth="0.5" opacity="0.06" />
      ))}

      {/* Target reticle */}
      <circle cx="150" cy="205" r="80" fill="none"
        stroke="#50BBB6" strokeWidth="0.8" strokeDasharray="8 6" opacity="0.2" />
    </svg>
  )
}

export function ShadowKingArt() {
  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="sk_bg" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1e0040" />
          <stop offset="55%" stopColor="#0a0020" />
          <stop offset="100%" stopColor="#020008" />
        </radialGradient>
        <radialGradient id="sk_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B00FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8B00FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="url(#sk_bg)" />

      {/* Shadow rays from crown */}
      {[...Array(12)].map((_, i) => {
        const ang = (i * 30 - 90) * Math.PI / 180
        return (
          <line key={i}
            x1="150" y1="130"
            x2={150 + 200 * Math.cos(ang)} y2={130 + 200 * Math.sin(ang)}
            stroke="#5500BB" strokeWidth={2 - i * 0.1} opacity={0.12 + (i % 2) * 0.05} />
        )
      })}

      {/* Crown glow */}
      <ellipse cx="150" cy="130" rx="90" ry="60" fill="url(#sk_glow)" />

      {/* Crown */}
      <g fill="#3A0090">
        <path d="M60 175 L60 125 L90 155 L120 95 L150 135 L180 95 L210 155 L240 125 L240 175 Z" />
        <rect x="60" y="175" width="180" height="18" rx="4" />
      </g>
      {/* Crown highlights */}
      <path d="M60 175 L60 125 L90 155 L120 95 L150 135 L180 95 L210 155 L240 125 L240 175"
        fill="none" stroke="#9B40FF" strokeWidth="2" opacity="0.6" />
      {/* Gems on crown */}
      <circle cx="150" cy="120" r="10" fill="#ED4255" />
      <ellipse cx="150" cy="120" rx="10" ry="10" fill="none" stroke="#FF8090" strokeWidth="1" opacity="0.5" />
      {[90, 120, 180, 210].map((x, i) => (
        <circle key={i} cx={x} cy={160} r={i % 2 === 0 ? 5 : 4} fill={i % 2 === 0 ? "#50BBB6" : "#FBB64A"} />
      ))}

      {/* Throne silhouette */}
      <g fill="#0a0018">
        {/* Throne back */}
        <rect x="95" y="200" width="110" height="180" rx="4" />
        {/* Throne seat */}
        <rect x="80" y="305" width="140" height="20" rx="4" />
        {/* Armrests */}
        <rect x="78" y="270" width="20" height="55" rx="3" />
        <rect x="202" y="270" width="20" height="55" rx="3" />
        {/* Throne top finials */}
        <circle cx="100" cy="200" r="8" />
        <circle cx="200" cy="200" r="8" />
        {/* Steps */}
        <rect x="70" y="325" width="160" height="10" rx="2" />
        <rect x="55" y="335" width="190" height="10" rx="2" />
      </g>

      {/* Shadow figure seated */}
      <g transform="translate(150,265)" fill="#04000e">
        <ellipse cx="0" cy="-58" rx="18" ry="22" />
        <path d="M-20 -36 L-28 0 L28 0 L20 -36 Z" />
        <path d="M-20 -30 L-50 -5 L-44 2 L-20 -20 Z" />
        <path d="M20 -30 L50 -5 L44 2 L20 -20 Z" />
      </g>

      {/* Stars / sparkles around crown */}
      {[[100, 80], [205, 72], [75, 148], [230, 142], [120, 55], [185, 60]].map(([x, y], i) => (
        <path key={i}
          d={`M${x} ${y - 6} L${x + 1.5} ${y - 1.5} L${x + 6} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 6} L${x - 1.5} ${y + 1.5} L${x - 6} ${y} L${x - 1.5} ${y - 1.5} Z`}
          fill="#9B40FF" opacity={0.4 + (i % 3) * 0.2} />
      ))}
    </svg>
  )
}

/* ─── CTA CARD THUMBS (square 120×120) ───────────────────────────────── */

export function MurderCaseArt() {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="mc_bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#3a0010" />
          <stop offset="100%" stopColor="#08000a" />
        </radialGradient>
      </defs>
      <rect width="120" height="120" fill="url(#mc_bg)" />
      {/* Magnifying glass */}
      <circle cx="50" cy="50" r="28" fill="none" stroke="#ED4255" strokeWidth="5" />
      <circle cx="50" cy="50" r="22" fill="#1a000c" opacity="0.8" />
      {/* Fingerprint inside glass */}
      {[12, 9, 6].map((r, i) => (
        <circle key={i} cx="50" cy="50" r={r} fill="none"
          stroke="#ED4255" strokeWidth="1" opacity={0.5 - i * 0.1} strokeDasharray="3 2" />
      ))}
      {/* Handle */}
      <line x1="71" y1="71" x2="90" y2="92" stroke="#ED4255" strokeWidth="6" strokeLinecap="round" />
      {/* Glint */}
      <circle cx="40" cy="38" r="4" fill="white" opacity="0.2" />
    </svg>
  )
}

export function EscapeCaseArt() {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="ec_bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#003030" />
          <stop offset="100%" stopColor="#000808" />
        </radialGradient>
        <radialGradient id="ec_light" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#50BBB6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#50BBB6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="120" height="120" fill="url(#ec_bg)" />
      {/* Door */}
      <rect x="30" y="18" width="60" height="88" rx="4" fill="#0c2828" stroke="#50BBB6" strokeWidth="1.5" opacity="0.8" />
      {/* Door panel detail */}
      <rect x="36" y="24" width="24" height="32" rx="2" fill="none" stroke="#50BBB6" strokeWidth="0.8" opacity="0.35" />
      <rect x="60" y="24" width="24" height="32" rx="2" fill="none" stroke="#50BBB6" strokeWidth="0.8" opacity="0.35" />
      {/* Keyhole */}
      <circle cx="82" cy="65" r="7" fill="#001a1a" stroke="#50BBB6" strokeWidth="1.5" />
      <path d="M79 65 L79 76 L85 76 L85 65" fill="#001a1a" stroke="#50BBB6" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Light behind door (ajar) */}
      <ellipse cx="82" cy="65" rx="12" ry="10" fill="url(#ec_light)" />
      {/* Key */}
      <g transform="translate(55,72) rotate(-35)">
        <circle cx="0" cy="0" r="8" fill="none" stroke="#FBB64A" strokeWidth="2.5" />
        <line x1="8" y1="0" x2="28" y2="0" stroke="#FBB64A" strokeWidth="2.5" />
        <line x1="22" y1="0" x2="22" y2="5" stroke="#FBB64A" strokeWidth="2" />
        <line x1="26" y1="0" x2="26" y2="4" stroke="#FBB64A" strokeWidth="2" />
      </g>
    </svg>
  )
}

export function LivingStoryArt() {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={S}>
      <defs>
        <radialGradient id="ls_bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#2a1800" />
          <stop offset="100%" stopColor="#060300" />
        </radialGradient>
        <radialGradient id="ls_glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FBB64A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FBB64A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="120" height="120" fill="url(#ls_bg)" />
      <ellipse cx="60" cy="55" rx="50" ry="40" fill="url(#ls_glow)" />
      {/* Open book */}
      <g>
        {/* Left page */}
        <path d="M18 80 Q18 30 60 28 L60 88 Q38 86 18 80 Z" fill="#1a0e04" stroke="#FBB64A" strokeWidth="1.2" opacity="0.9" />
        {/* Right page */}
        <path d="M102 80 Q102 30 60 28 L60 88 Q82 86 102 80 Z" fill="#1a0e04" stroke="#FBB64A" strokeWidth="1.2" opacity="0.9" />
        {/* Spine */}
        <line x1="60" y1="28" x2="60" y2="88" stroke="#FBB64A" strokeWidth="2" opacity="0.8" />
        {/* Text lines left */}
        {[40, 50, 60, 70, 78].map((y, i) => (
          <line key={i} x1="26" y1={y} x2={50 - (i % 3) * 4} y2={y}
            stroke="#FBB64A" strokeWidth="1" opacity="0.3" />
        ))}
        {/* Text lines right */}
        {[40, 50, 60, 70, 78].map((y, i) => (
          <line key={i} x1="70" y1={y} x2={94 - (i % 3) * 4} y2={y}
            stroke="#FBB64A" strokeWidth="1" opacity="0.3" />
        ))}
        {/* Glowing pages bottom */}
        <path d="M18 80 Q60 92 102 80 Q82 90 60 88 Q38 90 18 80 Z" fill="#FBB64A" opacity="0.08" />
      </g>
      {/* Magic sparkles above book */}
      {[[45, 20], [60, 14], [76, 20], [52, 10], [70, 12]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5 + (i % 2) * 1}
          fill="#FBB64A" opacity={0.5 + (i % 3) * 0.2} />
      ))}
    </svg>
  )
}
