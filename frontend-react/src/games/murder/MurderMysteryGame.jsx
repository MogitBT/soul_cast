import { useState, useMemo } from 'react'
import AudioStoryPlayer from '../shared/AudioStoryPlayer'
import { generateCase, getSettings } from './generateCase'
import styles from './MurderMysteryGame.module.css'

const ACCENT = '#ED4255'

function buildBeats(caseDoc) {
  const { setting, suspects, killer, motive, weapon } = caseDoc
  const guilty = suspects.find(s => s.isKiller)
  const firstName = n => n.split(' ')[0]

  const SETTING_OPENERS = {
    victorian_manor: `Rain hammers Ashford Manor. The body was found in the study at half past six. One of them is a murderer.`,
    space_station: `Station Kepler drifts in deep orbit. The victim was found in the airlock corridor. One crew member is lying.`,
    speakeasy_1920: `The body is warm in the back office of the Golden Haze. Four people were here. One is a killer.`,
    island_resort: `A body was found on the marina dock. The resort is on lockdown. Someone here is lying.`,
  }

  const APPROACH_GUILTY = [
    `${guilty.name} is standing by the window when you find them — not pacing, not fidgeting. Just watching the grounds. The stillness is deliberate. You've seen it before: people who have prepared for this exact moment.`,
    `${guilty.name} turns to face you before you've said a word. Either they heard you coming, or they've been waiting. Their eyes are unreadable. Their hands are perfectly still.`,
    `${guilty.name} offers you a seat before you can ask. Hospitable. Practiced. Something in the phrasing of their greeting is half a beat too smooth — like a line rehearsed.`,
  ]

  const APPROACH_INNOCENT = [
    `You find them in the corridor — genuinely startled when you appear. The surprise reads as real. Fear, maybe, but not guilt.`,
    `They're already asking questions before you can ask yours: "Do you know what happened? Has anyone said anything?" Either authentic shock, or a convincing performance of it.`,
    `Their hands are shaking slightly, eyes red. Either they cared about the victim, or they desperately want you to think they did.`,
  ]

  const GUILTY_ANSWERS = {
    alibi: `"I was in my room all evening, you can check the logs." A beat too long before the answer. You will check — and you'll find a twenty-minute gap that the logs don't explain. They're betting you won't know what it means.`,
    motive: `"We had our disagreements. Every family does." An interesting word choice. The victim and ${guilty.name} had more than disagreements — there was ${motive} at the centre of it, old and sharp. "But nothing that would lead to this."`,
    weapon: `"I don't know what you mean." Their gaze drops for a fraction of a second to their hands, then back to you. The ${weapon} was found, and the traces were found. They know you know.`,
  }

  const INNOCENT_ANSWERS = {
    alibi: `"I was with the others until about eleven, then I went to bed. You can ask anyone." Two witnesses have already said the same thing, independently, without prompting. The timeline holds.`,
    motive: `"Of course we had tensions. But I genuinely liked them, in my way." The grief sounds unperformed. The small details — a private joke, a shared habit — feel true rather than constructed.`,
    weapon: `"I heard it was a ${weapon} — I can't even say it." They look ill. "I don't understand how anyone in this house could do that." Their distress at the question is inconsistent with guilt.`,
  }

  const beats = []

  // 0: opener
  beats.push({
    id: 'intro',
    type: 'narration',
    text: SETTING_OPENERS[caseDoc.settingId] || SETTING_OPENERS['victorian_manor'],
  })

  // 1: scene detail + weapon/motive reveal
  beats.push({
    id: 'scene_detail',
    type: 'narration',
    text: `The method was the ${weapon}. The motive, as best you can reconstruct it, runs somewhere through ${motive}. These are your two anchors. Four people were present when it happened, and one of them is the killer.`,
  })

  // 2: full character introductions before asking choices
  beats.push({
    id: 'suspect_intros',
    type: 'narration',
    text: `Here is who you are dealing with: ${suspects.map(s => `${s.name}, ${s.relation}`).join('; ')}. Each suspect has a reason to be here, and one story between them that doesn't fully add up. You decide who to approach first.`,
  })

  // 3: choose suspect
  beats.push({
    id: 'choose_suspect',
    type: 'interaction',
    prompt: 'Who do you approach first?',
    options: suspects.map((s, i) => ({
      id: s.id,
      label: `${s.name} — ${s.relation}`,
      emoji: '🕵️',
      nextBeat: 4 + i * 2,
    })),
  })

  const bodyLocations = {
    victorian_manor: 'the study',
    space_station: 'the airlock corridor',
    speakeasy_1920: 'the back office',
    island_resort: 'the marina dock',
  }
  const bodyLoc = bodyLocations[caseDoc.settingId] || 'the study'

  // 4..N: suspect arcs (2 beats each)
  suspects.forEach((s, i) => {
    const base = 4 + i * 2
    const isKiller = s.isKiller
    const approachPool = isKiller ? APPROACH_GUILTY : APPROACH_INNOCENT
    const approachText = approachPool[i % approachPool.length]

    beats[base] = {
      id: `approach_${s.id}`,
      type: 'narration',
      text: `${s.name} — ${s.relation}. ${approachText}`,
    }

    beats[base + 1] = {
      id: `q_${s.id}`,
      type: 'chat_interaction',
      prompt: `Interrogate ${firstName(s.name)}...`,
      characterName: s.name,
      characterContext: isKiller 
        ? `You are the killer. The murder took place at ${setting.label} (specifically in ${bodyLoc}) at half past six. You used the ${weapon}. Your motive was ${motive}. Alibi: I claim to have been in my room all evening, but there is a 20-minute gap during the murder that I cannot explain if pressed. Do not reveal you are the killer immediately. Be defensive and try to deflect suspicion to the others. Do not contradict that the body was found in ${bodyLoc}.` 
        : `You are innocent. The murder took place at ${setting.label} (specifically in ${bodyLoc}) at half past six. You did not use the ${weapon}. You know the motive was ${motive}. Alibi: I was with the others until about eleven, then went to bed. Two witnesses saw me. You are helpful but nervous. If asked about the body or murder, you only know what everyone else knows: it was found in ${bodyLoc}.`,
      nextBeat: 4 + suspects.length * 2,
    }
  })

  const afterSuspects = 4 + suspects.length * 2

  // afterSuspects: loop or accuse
  beats[afterSuspects] = {
    id: 'next_step',
    type: 'interaction',
    prompt: 'What do you do next?',
    options: [
      { id: 'more', label: 'Speak with another suspect', emoji: '🔍', nextBeat: afterSuspects + 1 },
      { id: 'accuse', label: "I'm ready to deliver my verdict", emoji: '⚖️', nextBeat: afterSuspects + 2 },
    ],
  }

  beats[afterSuspects + 1] = {
    id: 'choose_next',
    type: 'interaction',
    prompt: 'Who do you approach?',
    options: suspects.map((s, i) => ({
      id: s.id,
      label: `${s.name} — ${s.relation}`,
      emoji: '🕵️',
      nextBeat: 4 + i * 2,
    })),
  }

  // afterSuspects+2: pre-verdict narration
  beats[afterSuspects + 2] = {
    id: 'pre_verdict',
    type: 'narration',
    text: `You step back and run the threads through your mind: the ${weapon}, the ${motive}, and the gap in the alibi. One person in this house couldn't account for twenty minutes during the window of death. It's time to name your killer.`,
  }

  // afterSuspects+3: accusation
  beats[afterSuspects + 3] = {
    id: 'accuse',
    type: 'interaction',
    prompt: 'Name your killer. There is no going back.',
    options: suspects.map(s => ({
      id: s.id,
      label: s.name,
      emoji: '👤',
      nextBeat: s.isKiller ? afterSuspects + 4 : afterSuspects + 5,
    })),
  }

  // Correct ending
  beats[afterSuspects + 4] = {
    id: 'correct_reveal',
    type: 'narration',
    text: `The room goes very quiet. ${guilty.name} doesn't move for three full seconds, and then their posture fractures. "How did you know?" Not a denial — a genuine question. You explain the alibi gap, the ${motive}, and the trace of ${weapon}. Justice arrives before morning.`,
  }

  // Wrong ending
  beats[afterSuspects + 5] = {
    id: 'wrong_reveal',
    type: 'narration',
    text: `The person you named looks stricken. Across the room, you spot the flicker of relief on the real killer's face — ${guilty.name}. By the time you realize what you missed, they are already composing their expression into sorrow. A killer walks free.`,
  }

  return beats.filter(Boolean)
}

function SettingPicker({ settings, onChoose }) {
  return (
    <div className={styles.settingWrap}>
      <p className={styles.eyebrow}>Infinite Murder Mystery</p>
      <h2 className={styles.settingHeading}>Choose the scene of the crime</h2>
      <p className={styles.settingDesc}>Every setting generates a completely unique case — different killer, motive, evidence, and solution.</p>
      <div className={styles.settingGrid}>
        {settings.map(s => (
          <button key={s.id} className={styles.settingCard} onClick={() => onChoose(s.id)}
                  style={{ '--sa': s.accent }}>
            <div className={styles.settingArt} style={{ background: `linear-gradient(135deg,${s.accent}22,#0a0a12)` }}>
              <span className={styles.settingEmoji}>
                {s.id === 'victorian_manor' ? '🏚️'
                  : s.id === 'space_station' ? '🛸'
                  : s.id === 'speakeasy_1920' ? '🎷'
                  : '🏖️'}
              </span>
            </div>
            <div className={styles.settingInfo}>
              <p className={styles.settingLabel}>{s.label}</p>
              <p className={styles.settingBlurb}>{s.desc}</p>
              <p className={styles.settingCta} style={{ color: s.accent }}>Start Investigation →</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MurderMysteryGame({ onBack }) {
  const settings = getSettings()
  const [caseDoc, setCaseDoc] = useState(null)
  const [loading, setLoading] = useState(false)

  const beats = useMemo(() => caseDoc ? buildBeats(caseDoc) : [], [caseDoc])

  const choose = (id) => {
    setLoading(true)
    setTimeout(() => {
      const { caseDoc: doc } = generateCase(id)
      setCaseDoc(doc)
      setLoading(false)
    }, 1000)
  }

  if (!caseDoc) {
    return (
      <div className={styles.root}>
        <div className={styles.topBar}>
          <button className={styles.back} onClick={onBack}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Verdicts
          </button>
        </div>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Generating your unique case…</p>
            <small>Building killer, motive, clue graph, and suspects</small>
          </div>
        ) : (
          <div className={styles.settingScroll}>
            <SettingPicker settings={settings} onChoose={choose} />
          </div>
        )}
      </div>
    )
  }

  return (
    <AudioStoryPlayer
      beats={beats}
      title={`The ${caseDoc.setting.label} Murder`}
      series="Murder Mystery"
      episode="Case File #1"
      accent={ACCENT}
      artworkGradient={`linear-gradient(135deg,${caseDoc.setting.accent || '#ED4255'}33,#0a0a12)`}
      artworkImage="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&h=600&q=80"
      onBack={() => setCaseDoc(null)}
    />
  )
}
