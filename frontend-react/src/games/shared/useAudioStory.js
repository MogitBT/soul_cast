import { useState, useCallback, useRef, useEffect } from 'react'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

function estimateDuration(text, speed = 1) {
  const words = text.trim().split(/\s+/).length
  return Math.max(1500, (words / 145) * 60000 / speed)
}

let _currentAudio = null

function stopSpeech() {
  if (_currentAudio) {
    _currentAudio.pause()
    _currentAudio = null
  }
}

export function setSpeechRate(rate) {
  if (_currentAudio) {
    _currentAudio.playbackRate = rate
  }
}

function speak(text, onEnd, speed = 1, language = 'english') {
  stopSpeech()

  let cancelled = false
  let cancelAudio = () => {}

  const doSpeak = async () => {
    if (cancelled) return

    let speakText = text
    if (language !== 'english') {
      try {
        const res = await fetch('/api/pocketcases/voice/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, target_language: language })
        })
        if (res.ok) {
          const data = await res.json()
          speakText = data.translated_text
        }
      } catch (e) {
        console.error("Translation failed", e)
      }
    }
    
    // Strict backend narrative TTS
    try {
      const res = await fetch('/api/pocketcases/voice/narration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speakText, voice: 'onyx' }) // onyx is a deep narrative voice
      })
      if (res.ok && !cancelled) {
        const data = await res.json()
        if (data.audio_base64) {
          _currentAudio = new Audio(`data:audio/mpeg;base64,${data.audio_base64}`)
          _currentAudio.playbackRate = speed
          _currentAudio.onended = () => { if (!cancelled) onEnd() }
          _currentAudio.onerror = () => { if (!cancelled) onEnd() }
          _currentAudio.play().catch(err => {
            console.error("Audio playback failed:", err)
            if (!cancelled) onEnd()
          })
          cancelAudio = () => {
            if (_currentAudio) {
              _currentAudio.pause()
              _currentAudio = null
            }
          }
          return
        }
      } else {
        console.error("Backend TTS returned an error", res.status, await res.text())
      }
    } catch (e) {
      console.error("Backend TTS request failed entirely. Is the server running?", e)
    }

    // If TTS fails, we just wait a bit and move on so the app doesn't lock up, 
    // but we DO NOT fall back to the robotic browser voice anymore.
    if (!cancelled) {
      setTimeout(onEnd, estimateDuration(speakText, speed))
    }
  }

  doSpeak()

  return () => { 
    cancelled = true; 
    cancelAudio();
    stopSpeech() 
  }
}

export default function useAudioStory(beats) {
  const [beatIndex, setBeatIndex]   = useState(-1)
  const [phase, setPhase]           = useState('idle')
  const [isPlaying, setIsPlaying]   = useState(false)
  const [elapsed, setElapsed]       = useState(0)
  const [history, setHistory]       = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})
  const [speedIdx, setSpeedIdx]     = useState(1)  // index into SPEEDS, default 1x
  const [translatedBeat, setTranslatedBeat] = useState(null)

  const speed = SPEEDS[speedIdx]

  const cancelSpeech = useRef(() => {})
  const timerRef     = useRef(null)
  const startedAt    = useRef(null)
  const beatDuration = useRef(0)
  const currentText  = useRef('')
  const currentOpts  = useRef({})
  const advanceIdRef = useRef(0)

  const clearTimer = () => { clearInterval(timerRef.current); timerRef.current = null }

  const currentBeat = beats[beatIndex] ?? null

  const progress = beats.length > 0
    ? Math.max(0, Math.min(1, (Math.max(0, beatIndex) + Math.min(1, elapsed / (beatDuration.current || 10000))) / beats.length))
    : 0

  const advance = useCallback(async (idx, opts) => {
    const currentAdvanceId = ++advanceIdRef.current
    
    // IMMEDIATELY STOP ALL AUDIO AT 0ms
    cancelSpeech.current()
    stopSpeech()
    clearTimer()

    const next = beats[idx]
    if (!next) {
      setPhase('complete')
      setIsPlaying(false)
      return
    }

    if (next.type === 'narration' || next.type === 'response') {
      let dispText = next.text
      const lang = window.localStorage.getItem('preferredLanguage') || 'english'
      if (lang !== 'english') {
        try {
          const res = await fetch('/api/pocketcases/voice/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: next.text, target_language: lang })
          })
          if (res.ok) {
            const data = await res.json()
            dispText = data.translated_text
          }
        } catch (e) {
          console.error("Translation failed", e)
        }
      }

      if (currentAdvanceId !== advanceIdRef.current) return

      const translatedBeat = { ...next, text: dispText, _beatIdx: idx }
      
      setHistory(prev => {
        // If the last item in history is already this beat, update it in place
        if (prev.length > 0 && prev[prev.length - 1]._beatIdx === idx) {
          return [...prev.slice(0, -1), translatedBeat]
        }
        return [...prev, translatedBeat]
      })
      setBeatIndex(idx)
      setPhase('narrating')
      setElapsed(0)
      startedAt.current = Date.now()
      currentText.current = dispText
      currentOpts.current = opts
      beatDuration.current = estimateDuration(dispText, speed)

      clearTimer()
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startedAt.current)
      }, 100)

      cancelSpeech.current = speak(dispText, () => {
        clearTimer()
        advance(idx + 1, opts)
      }, speed, lang)

    } else if (next.type === 'interaction' || next.type === 'chat_interaction') {
      if (opts?.[next.id] !== undefined) {
        const chosen = next.options?.find(o => o.id === opts[next.id])
        advance(chosen?.nextBeat ?? next.nextBeat ?? idx + 1, opts)
        return
      }
      cancelSpeech.current()
      clearTimer()
      
      // Update state & setTranslatedBeat IMMEDIATELY so buttons pop up in 0ms!
      setBeatIndex(idx)
      setPhase('waiting')
      setIsPlaying(false)
      setTranslatedBeat({ ...next })
      
      let tBeat = { ...next }
      const lang = window.localStorage.getItem('preferredLanguage') || 'english'
      if (lang !== 'english') {
        try {
          const resPrompt = await fetch('/api/pocketcases/voice/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: next.prompt, target_language: lang })
          })
          if (resPrompt.ok) {
            const data = await resPrompt.json()
            tBeat.prompt = data.translated_text
          }

          if (next.options) {
            tBeat.options = await Promise.all(next.options.map(async opt => {
              const resOpt = await fetch('/api/pocketcases/voice/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: opt.label, target_language: lang })
              })
              if (resOpt.ok) {
                const data = await resOpt.json()
                return { ...opt, label: data.translated_text }
              }
              return opt
            }))
          }
        } catch (e) {
          console.error("Interaction translation failed", e)
        }
      }
      
      if (currentAdvanceId !== advanceIdRef.current) return
      
      setTranslatedBeat(tBeat)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beats, speed])

  const play = useCallback(() => {
    if (phase === 'idle') {
      setIsPlaying(true)
      advance(0, {})
    } else if (phase === 'paused' || phase === 'narrating') {
      setIsPlaying(true)
      setPhase('narrating')
      const lang = window.localStorage.getItem('preferredLanguage') || 'english'
      
      const onSpeechEnd = () => {
        const cBeat = beats[beatIndex]
        if (cBeat && cBeat.type === 'chat_interaction') {
          setPhase('waiting')
          setIsPlaying(false)
        } else {
          advance(beatIndex + 1, currentOpts.current)
        }
      }

      cancelSpeech.current = speak(currentText.current || '', onSpeechEnd, speed, lang)
      startedAt.current = Date.now() - elapsed
      clearTimer()
      timerRef.current = setInterval(() => setElapsed(Date.now() - startedAt.current), 100)
    }
  }, [phase, beatIndex, elapsed, advance, speed, beats])

  const pause = useCallback(() => {
    cancelSpeech.current()
    stopSpeech()          // always stop directly — Chrome bug workaround
    clearTimer()
    setIsPlaying(false)
    setPhase(p => p === 'narrating' ? 'paused' : p)
  }, [])

  // Find the index of the first unanswered interaction in the story
  const firstUnansweredInteractionIdx = beats.findIndex(b => (b.type === 'interaction' || b.type === 'chat_interaction') && !selectedOptions[b.id])

  const skipForward = useCallback(() => {
    if (phase === 'waiting' || phase === 'idle' || phase === 'complete') return
    if (firstUnansweredInteractionIdx !== -1 && beatIndex >= firstUnansweredInteractionIdx) return

    // If audio is currently playing, seek +5 seconds in the audio track!
    if (_currentAudio && !_currentAudio.paused && _currentAudio.duration) {
      const newTime = _currentAudio.currentTime + 5
      if (newTime < _currentAudio.duration - 0.5) {
        _currentAudio.currentTime = newTime
        setElapsed(newTime * 1000)
        startedAt.current = Date.now() - (newTime * 1000)
        return
      }
    }

    // Otherwise (near end of track or audio loading), advance to next beat!
    const targetIdx = beatIndex + 1
    if (targetIdx < beats.length) {
      cancelSpeech.current()
      stopSpeech()
      clearTimer()
      advance(targetIdx, currentOpts.current)
    }
  }, [beatIndex, phase, advance, firstUnansweredInteractionIdx, beats])

  const skipBackward = useCallback(() => {
    if (elapsed > 5000) {
      startedAt.current = startedAt.current + 5000
      setElapsed(e => Math.max(0, e - 5000))
      if (_currentAudio) {
        _currentAudio.currentTime = Math.max(0, _currentAudio.currentTime - 5)
      }
    } else if (beatIndex > 0) {
      // go to previous narration beat
      cancelSpeech.current()
      clearTimer()
      const prevBeat = beats.slice(0, beatIndex).reverse().find(b => b.type === 'narration')
      const prevIdx = beats.indexOf(prevBeat)
      if (prevIdx >= 0) {
        setHistory(prev => prev.slice(0, -1))
        advance(prevIdx, currentOpts.current)
      }
    }
  }, [beatIndex, elapsed, beats, advance])

  const seek = useCallback((fraction) => {
    cancelSpeech.current()
    stopSpeech()
    clearTimer()

    // If dragging to the very end (>= 95%), jump straight to the FINAL ENDING / LAST BEAT!
    if (fraction >= 0.95) {
      const lastBeatIdx = beats.length - 1
      advance(lastBeatIdx, currentOpts.current)
      return
    }

    // Determine target beat index from fraction
    const targetIdx = Math.min(beats.length - 1, Math.floor(fraction * beats.length))
    
    // Cannot seek past the first unanswered interaction
    const maxIdx = firstUnansweredInteractionIdx !== -1 ? firstUnansweredInteractionIdx : beats.length - 1
    const finalIdx = Math.min(targetIdx, maxIdx)

    const targetBeat = beats[finalIdx]
    if (targetBeat.type === 'interaction') {
      advance(finalIdx, currentOpts.current)
      return
    }

    const newHistory = beats.slice(0, finalIdx).filter(b2 => b2.type === 'narration')
    setHistory(newHistory)
    advance(finalIdx, currentOpts.current)
  }, [beats, advance, firstUnansweredInteractionIdx])

  const cycleSpeed = useCallback(() => {
    const nextSpeedIdx = (speedIdx + 1) % SPEEDS.length
    const nextSpeed = SPEEDS[nextSpeedIdx]
    setSpeedIdx(nextSpeedIdx)
    // Update live audio playback rate if it's currently speaking
    setSpeechRate(nextSpeed)
    // We adjust elapsed timer based on new speed scaling if we want, but it's simpler to just let the audio end naturally.
  }, [speedIdx])

  const [chatLoading, setChatLoading] = useState(false)

  const choose = useCallback((interactionBeatId, option) => {
    const newOpts = { ...selectedOptions, [interactionBeatId]: option.id }
    setSelectedOptions(newOpts)
    currentOpts.current = newOpts
    setHistory(prev => [...prev, {
      id: interactionBeatId + '_choice',
      type: 'choice',
      text: `${option.emoji ? option.emoji + ' ' : ''}${option.label}`,
    }])
    setIsPlaying(true)
    const idx = beats.findIndex(b => b.id === interactionBeatId)
    const nextIdx = option.nextBeat !== undefined ? option.nextBeat : idx + 1
    advance(nextIdx, newOpts)
  }, [beats, selectedOptions, advance])

  const submitChat = useCallback(async (interactionBeatId, text) => {
    const beat = beats.find(b => b.id === interactionBeatId)
    if (!beat) return

    setChatLoading(true)

    // Add user question to history
    setHistory(prev => [...prev, {
      id: interactionBeatId + '_user_q_' + Date.now(),
      type: 'choice',
      text: `You asked: "${text}"`,
    }])

    try {
      let endpoint = '/api/pocketcases/voice/interrogate'
      let bodyPayload = {}

      if (beat.interactionType === 'escape') {
        endpoint = '/api/pocketcases/voice/escape-action'
        const stringHistory = history.map(h => h.text).slice(0, 15)
        bodyPayload = {
          room_context: beat.roomContext || "An escape room.",
          history: stringHistory,
          action: text
        }
      } else if (beat.interactionType === 'story') {
        endpoint = '/api/pocketcases/voice/story-action'
        const stringHistory = history.map(h => h.text).slice(0, 15)
        // Count how many user interactions have occurred
        const turnCount = history.filter(h => h.id && h.id.includes('_user_q_')).length
        bodyPayload = {
          story_context: beat.storyContext || "A story.",
          history: stringHistory,
          action: text,
          turn_count: turnCount,
          max_turns: beat.maxTurns || 3
        }
      } else {
        bodyPayload = {
          character_name: beat.characterName,
          character_context: beat.characterContext,
          question: text
        }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      })
      if (res.ok) {
        const data = await res.json()
        const responseText = data.text
        setChatLoading(false)

        const isEnding = responseText.includes('[ENDING]')
        const cleanText = responseText.replace(/\[ENDING\]/g, '').trim()

        // Add response to history
        setHistory(prev => [...prev, {
          id: interactionBeatId + '_ai_a_' + Date.now(),
          type: 'narration',
          text: `"${cleanText}"`,
          _beatIdx: beatIndex // to ensure it doesn't break history truncation check
        }])

        // Play the response
        setIsPlaying(true)
        setPhase('narrating')
        currentText.current = cleanText
        
        const lang = window.localStorage.getItem('preferredLanguage') || 'english'
        cancelSpeech.current = speak(cleanText, () => {
          // when speech finishes, check if ending
          if (isEnding) {
            setPhase('complete')
          } else {
            setPhase('waiting')
          }
          setIsPlaying(false)
        }, speed, lang)

      } else {
        setChatLoading(false)
      }
    } catch (e) {
      console.error(e)
      setChatLoading(false)
    }
  }, [beats, beatIndex, speed])

  const restart = useCallback(() => {
    cancelSpeech.current()
    stopSpeech()
    clearTimer()
    setBeatIndex(-1)
    setPhase('idle')
    setIsPlaying(false)
    setElapsed(0)
    setHistory([])
    setSelectedOptions({})
    currentText.current = ''
    currentOpts.current = {}
    setTranslatedBeat(null)
  }, [])

  useEffect(() => () => { cancelSpeech.current(); stopSpeech(); clearTimer() }, [])

  return {
    phase, isPlaying, progress, history, currentBeat: translatedBeat || currentBeat, beatIndex,
    selectedOptions, speed, speedLabel: `${speed}x`, chatLoading,
    play, pause, choose, submitChat, restart, skipForward, skipBackward, seek, cycleSpeed,
  }
}
