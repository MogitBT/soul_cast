import { useState, useCallback } from 'react'
import { classifyIntent, generateHintResponse } from './intentEngine'

const PUZZLE_GRAPH = {
  nodes: [
    { id: 'desk',      label: 'Old Desk',       type: 'object',  keywords: ['desk','drawer','table','furniture','wood'],
      description: 'A heavy mahogany desk with a locked drawer.',
      prereqs: [], revealText: 'Inside the desk drawer you find a brass key engraved with the number 3.', reward: 'brass_key' },
    { id: 'painting',  label: 'Wall Painting',  type: 'puzzle',  keywords: ['painting','picture','frame','wall','art','portrait'],
      description: 'A portrait of a stern-faced admiral. The frame seems slightly loose.',
      prereqs: [], revealText: 'Behind the painting is a safe with a combination dial.', reward: 'safe_location' },
    { id: 'safe',      label: 'Hidden Safe',    type: 'puzzle',  keywords: ['safe','dial','combination','lock','vault','number'],
      description: 'A combination safe is embedded in the wall. It needs a 3-digit code.',
      prereqs: ['painting'],
      revealText: 'You try the desk key number — 3 — and remember the clock showed 7:15. 3-7-1 opens the safe. Inside: a room key.', reward: 'room_key' },
    { id: 'clock',     label: 'Grandfather Clock', type: 'object', keywords: ['clock','time','tick','hour','hand','pendulum'],
      description: 'A tall grandfather clock stopped at 7:15.',
      prereqs: [], revealText: 'The clock is stopped at exactly 7:15. The pendulum has been removed — something is hidden inside.', reward: 'clock_note' },
    { id: 'pendulum_note', label: 'Pendulum Compartment', type: 'object', keywords: ['pendulum','compartment','inside clock','hidden clock','note'],
      description: 'A compartment inside the clock casing.',
      prereqs: ['clock'], revealText: 'Inside the pendulum housing is a folded note: "The safe yields to key, time, and beginning. 3-7-1."', reward: 'code_hint' },
    { id: 'door',      label: 'Exit Door',      type: 'exit',    keywords: ['door','exit','leave','escape','key','out','lock'],
      description: 'A heavy oak door with a modern lock.',
      prereqs: ['safe'], revealText: 'The room key fits perfectly. The lock clicks open. You step into the corridor — you are free.', reward: 'escaped' },
  ]
}

function buildInitialGraph() {
  return {
    nodes: PUZZLE_GRAPH.nodes.map(n => ({ ...n, revealed: false })),
  }
}

export default function useEscapeRoom() {
  const [phase, setPhase]   = useState('idle')
  const [graph, setGraph]   = useState(() => buildInitialGraph())
  const [chatLog, setChatLog] = useState([])
  const [revealedIds, setRevealedIds] = useState([])
  const [hintLevel, setHintLevel]     = useState(0)
  const [stuckTurns, setStuckTurns]   = useState(0)
  const [isThinking, setIsThinking]   = useState(false)

  const initRoom = useCallback(() => {
    setGraph(buildInitialGraph())
    setRevealedIds([])
    setHintLevel(0)
    setStuckTurns(0)
    setPhase('playing')
    setChatLog([{
      id: 'intro', role: 'room',
      text: 'You are locked inside a Victorian study. A mahogany desk, a ticking grandfather clock, a painting on the wall, and a heavy oak door stand before you. Examine, question, try anything. Talk your way out.',
    }])
  }, [])

  const sendMessage = useCallback(text => {
    if (!text.trim() || phase !== 'playing') return
    setIsThinking(true)

    const playerMsg = { id: Date.now(), role: 'player', text }
    setChatLog(prev => [...prev, playerMsg])

    setTimeout(() => {
      const result = classifyIntent(text, graph.nodes, revealedIds)

      let response = ''
      let newRevealedId = null

      if (!result) {
        const stuck = stuckTurns + 1
        setStuckTurns(stuck)
        if (stuck >= 2) setHintLevel(h => Math.min(h + 1, 3))
        response = hintLevel === 0
          ? `You look around but nothing reacts to that. Try examining specific objects in the room.`
          : `Nothing responds. Look carefully at the objects: desk, clock, painting, door.`
      } else if (result.alreadyFound) {
        response = `You already examined ${result.node.label}. It revealed: ${result.node.revealText.slice(0, 80)}…`
        setStuckTurns(s => s + 1)
      } else if (!result.prereqsMet) {
        const stuck = stuckTurns + 1
        setStuckTurns(stuck)
        if (stuck >= 2) setHintLevel(h => Math.min(h + 1, 3))
        response = generateHintResponse(result.node, hintLevel, revealedIds)
      } else {
        // Reveal the node
        newRevealedId = result.node.id
        response = result.node.revealText
        setRevealedIds(prev => [...prev, result.node.id])
        setStuckTurns(0)

        if (result.node.reward === 'escaped') {
          setTimeout(() => setPhase('escaped'), 600)
        }
      }

      setChatLog(prev => [...prev, { id: Date.now() + 'r', role: 'room', text: response, revealed: newRevealedId }])
      setIsThinking(false)
    }, 700)
  }, [graph, revealedIds, hintLevel, stuckTurns, phase])

  const restart = useCallback(() => {
    setPhase('idle')
    setGraph(buildInitialGraph())
    setRevealedIds([])
    setHintLevel(0)
    setStuckTurns(0)
    setChatLog([])
  }, [])

  return { phase, graph, chatLog, revealedIds, hintLevel, isThinking, initRoom, sendMessage, restart }
}
