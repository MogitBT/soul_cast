import { useState, useEffect, useCallback } from 'react'

const API_BASE = '/api/pocketcases'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || err.error || 'Request failed')
  }
  return res.json()
}

export function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 0.92; u.pitch = 0.9
  window.speechSynthesis.speak(u)
}

export default function usePocketCases() {
  const [modes, setModes] = useState([])
  const [selectedMode, setSelectedMode] = useState('living_story')
  const [room, setRoom] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const [status, setStatus] = useState('checking') // 'checking' | 'ok' | 'offline'
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/health')
      .then(() => setStatus('ok'))
      .catch(() => setStatus('offline'))

    request('/modes')
      .then(d => setModes(d.modes))
      .catch(() => setStatus('offline'))
  }, [])

  const createRoom = useCallback(async (hostName, theme) => {
    setError(null)
    try {
      const d = await request('/rooms', {
        method: 'POST',
        body: JSON.stringify({ mode: selectedMode, host_name: hostName, theme }),
      })
      setRoom(d.room)
      setPlayerId(d.host_player_id)
      speak(`Room ${d.room.code} created. ${d.room.game.episode_hook}`)
    } catch (e) { setError(e.message) }
  }, [selectedMode])

  const joinRoom = useCallback(async (code, name) => {
    setError(null)
    try {
      const d = await request(`/rooms/${code.toUpperCase()}/join`, {
        method: 'POST',
        body: JSON.stringify({ name: name || 'Friend' }),
      })
      setRoom(d.room)
      setPlayerId(d.player.id)
    } catch (e) { setError(e.message) }
  }, [])

  const roomAction = useCallback(async (action, extra = {}) => {
    if (!room) return
    setError(null)
    try {
      if (action === 'start') {
        const d = await request(`/rooms/${room.code}/start`, { method: 'POST' })
        setRoom(d.room)
      } else if (action === 'play') {
        const text = room?.game?.shared_narration?.at(-1) || room?.game?.episode_hook || 'PocketCases is ready.'
        speak(text)
      } else if (action === 'share') {
        const d = await request(`/rooms/${room.code}/share-clue`, {
          method: 'POST',
          body: JSON.stringify({ player_id: playerId, clue_id: extra.clueId }),
        })
        setRoom(d.room)
      } else if (action === 'decision') {
        const d = await request(`/rooms/${room.code}/decision`, {
          method: 'POST',
          body: JSON.stringify({ player_id: playerId, spoken_text: extra.text }),
        })
        setRoom(d.room)
        speak(d.world_rule.text)
      } else if (action === 'interrogate') {
        const d = await request(`/rooms/${room.code}/interrogate`, {
          method: 'POST',
          body: JSON.stringify({ player_id: playerId, target_id: extra.targetId, question: extra.question }),
        })
        setRoom(d.room)
        speak(d.answer)
      }
    } catch (e) { setError(e.message) }
  }, [room, playerId])

  return { modes, selectedMode, setSelectedMode, room, playerId, status, error, setError, createRoom, joinRoom, roomAction }
}
