import { useState, useCallback } from 'react'
import { CHAPTERS, ENDINGS, classifyArchetype } from './storyData'

export default function useDivergentStory() {
  const [phase, setPhase] = useState('idle')       // idle|reading|choosing|ending
  const [chapterIndex, setChapterIndex] = useState(0)
  const [signals, setSignals] = useState([])
  const [choiceStartedAt, setChoiceStartedAt] = useState(null)
  const [archetype, setArchetype] = useState(null)
  const [ending, setEnding] = useState(null)
  const [revealing, setRevealing] = useState(false)

  const chapter = CHAPTERS[chapterIndex]

  const startStory = useCallback(() => {
    setChapterIndex(0)
    setSignals([])
    setArchetype(null)
    setEnding(null)
    setPhase('reading')
  }, [])

  const readyForChoice = useCallback(() => {
    setChoiceStartedAt(Date.now())
    setPhase('choosing')
  }, [])

  const makeChoice = useCallback((choice) => {
    const latencyMs = choiceStartedAt ? Date.now() - choiceStartedAt : 0

    const signal = {
      chapterId: chapter.id,
      choiceId: choice.id,
      selectedLabel: choice.label,
      latencyMs,
      archetypeWeights: choice.archetypeWeight,
    }
    const newSignals = [...signals, signal]
    setSignals(newSignals)

    const nextIndex = chapterIndex + 1
    setChapterIndex(nextIndex)

    const nextChapter = CHAPTERS[nextIndex]

    if (!nextChapter || nextChapter.choices === null) {
      // Climax or end: classify archetype
      setRevealing(true)
      setPhase('reading')
      setTimeout(() => {
        const arch = classifyArchetype(newSignals)
        setArchetype(arch)
        setEnding(ENDINGS[arch])
        setPhase('ending')
        setRevealing(false)
      }, 2000)
    } else {
      setPhase('reading')
    }
  }, [signals, chapterIndex, chapter, choiceStartedAt])

  const restart = useCallback(() => {
    setPhase('idle')
    setChapterIndex(0)
    setSignals([])
    setArchetype(null)
    setEnding(null)
    setRevealing(false)
  }, [])

  return {
    phase, chapter, chapterIndex, signals, archetype, ending, revealing,
    startStory, readyForChoice, makeChoice, restart,
    totalChapters: CHAPTERS.length,
  }
}
