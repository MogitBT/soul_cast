import { useState, useCallback } from 'react'
import { generateCase, getSettings } from './generateCase'

const SUSPECT_RESPONSES = {
  alibi: s => s.alibi,
  motive: s => s.isKiller
    ? `I had no particular reason to wish anyone ill... though I admit, our relationship was complicated.`
    : `Why would I? I barely knew them well enough to have a grievance.`,
  weapon: s => s.isKiller
    ? `I don't know anything about that. You're grasping at shadows.`
    : `I wouldn't even know where to find such a thing. You're wasting my time.`,
  whereabouts: s => s.alibi,
  default: s => `I've told you everything I know. Perhaps you should look elsewhere.`,
}

function classifyQuestion(q) {
  q = q.toLowerCase()
  if (/alibi|where were you|account for|evening|night|time/.test(q)) return 'alibi'
  if (/motive|reason|why|benefit|gain|hate|grudge/.test(q)) return 'motive'
  if (/weapon|poison|gun|candlestick|wire|knife|instrument|inject/.test(q)) return 'weapon'
  if (/location|room|place|whereabout|position/.test(q)) return 'whereabouts'
  return 'default'
}

export default function useMurderMystery() {
  const [phase, setPhase] = useState('idle')  // idle|setup|interrogate|accuse|reveal
  const [settingId, setSettingId] = useState(null)
  const [caseDoc, setCaseDoc] = useState(null)
  const [chatLog, setChatLog] = useState([])
  const [activeSuspect, setActiveSuspect] = useState(null)
  const [discoveredClues, setDiscoveredClues] = useState([])
  const [pinnedClues, setPinnedClues] = useState([])
  const [accusation, setAccusation] = useState(null)
  const [reveal, setReveal] = useState(null)
  const [isThinking, setIsThinking] = useState(false)

  const settings = getSettings()

  const chooseSetting = useCallback(id => {
    setSettingId(id)
    setPhase('setup')
  }, [])

  const startCase = useCallback(() => {
    setIsThinking(true)
    setTimeout(() => {
      const { caseDoc: doc } = generateCase(settingId)
      setCaseDoc(doc)
      setPhase('interrogate')
      setDiscoveredClues([])
      setPinnedClues([])
      setChatLog([{
        id: 'intro',
        role: 'narrator',
        name: 'Narrator',
        text: `A body has been discovered at ${doc.setting.label}. ${doc.setting.desc} You have ${doc.suspects.length} suspects. Interrogate them — the truth is hidden in their answers.`,
      }])
      setIsThinking(false)
    }, 1200)
  }, [settingId])

  const selectSuspect = useCallback(suspect => {
    setActiveSuspect(suspect)
    setChatLog(prev => [...prev, {
      id: Date.now() + 'sel',
      role: 'narrator',
      name: 'Narrator',
      text: `You approach ${suspect.name} — ${suspect.relation}.`,
    }])
  }, [])

  const interrogate = useCallback((question) => {
    if (!activeSuspect || !question.trim()) return
    setIsThinking(true)

    const playerMsg = { id: Date.now(), role: 'player', text: question }
    setChatLog(prev => [...prev, playerMsg])

    setTimeout(() => {
      const category = classifyQuestion(question)
      const responseText = SUSPECT_RESPONSES[category](activeSuspect)

      const suspectMsg = {
        id: Date.now() + 'r',
        role: 'suspect',
        name: activeSuspect.name,
        suspectId: activeSuspect.id,
        text: responseText,
      }
      setChatLog(prev => [...prev, suspectMsg])

      // Reveal clues based on question category
      const newClues = activeSuspect.clues.filter(c => {
        if (category === 'alibi' && c.title.toLowerCase().includes('alibi')) return true
        if (category === 'motive' && c.title.toLowerCase().includes('motive')) return true
        if (category === 'weapon' && c.title.toLowerCase().includes('trace')) return true
        return false
      })

      if (newClues.length > 0) {
        setDiscoveredClues(prev => {
          const existingIds = new Set(prev.map(c => c.id))
          const fresh = newClues.filter(c => !existingIds.has(c.id))
          if (fresh.length > 0) {
            setChatLog(p => [...p, {
              id: Date.now() + 'clue',
              role: 'narrator',
              name: 'Narrator',
              text: `🔍 New clue discovered: "${fresh[0].title}"`,
            }])
          }
          return [...prev, ...fresh.filter(c => !existingIds.has(c.id))]
        })
      }

      setIsThinking(false)
    }, 800)
  }, [activeSuspect])

  const pinClue = useCallback(clueId => {
    setPinnedClues(prev => prev.includes(clueId) ? prev.filter(id => id !== clueId) : [...prev, clueId])
  }, [])

  const accuse = useCallback(suspectId => {
    const suspect = caseDoc.suspects.find(s => s.id === suspectId)
    const correct = suspect.isKiller
    setAccusation({ suspectId, suspectName: suspect.name })
    setReveal({
      correct,
      killerName: caseDoc.killer.name,
      explanation: correct
        ? `${suspect.name} committed the crime using a ${caseDoc.weapon}, motivated by ${caseDoc.motive}. The alibi gap you uncovered was the key.`
        : `${suspect.name} was innocent. ${caseDoc.killer.name} was the real culprit — motivated by ${caseDoc.motive}, using a ${caseDoc.weapon}. The alibi gap belonged to them.`,
    })
    setPhase('reveal')
  }, [caseDoc])

  const restart = useCallback(() => {
    setPhase('idle')
    setSettingId(null)
    setCaseDoc(null)
    setChatLog([])
    setActiveSuspect(null)
    setDiscoveredClues([])
    setPinnedClues([])
    setAccusation(null)
    setReveal(null)
  }, [])

  return {
    phase, settings, settingId, caseDoc, chatLog,
    activeSuspect, discoveredClues, pinnedClues, accusation, reveal, isThinking,
    chooseSetting, startCase, selectSuspect, interrogate, pinClue, accuse, restart,
  }
}
