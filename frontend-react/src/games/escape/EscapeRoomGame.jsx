import AudioStoryPlayer from '../shared/AudioStoryPlayer'

const ACCENT = '#50BBB6'

const BEATS = [
  {
    id: 'open',
    type: 'narration',
    text: `The lock turns. The door closes. And then — silence. You are inside a Victorian study. Candlelight throws long shadows across walls lined with leather-bound books. A mahogany desk stands to your left, heavy and old. In the corner, a grandfather clock. On the wall opposite, a portrait of an admiral — stern-faced, watching. Ahead of you, an oak door. Locked. You have no key. You have no instructions. You have only this room, and whatever it is willing to tell you.`,
  },
  {
    id: 'escape_loop',
    type: 'chat_interaction',
    interactionType: 'escape',
    roomContext: "A Victorian study. A mahogany desk, a grandfather clock stuck at 7:15, an admiral's portrait concealing a safe. To escape they need code 371 to open the safe and get the exit key.",
    prompt: 'The room is waiting. What do you do?',
  }
]

export default function EscapeRoomGame({ onBack }) {
  return (
    <AudioStoryPlayer
      beats={BEATS}
      title="Locked"
      series="AI Escape Room"
      episode="The Victorian Study"
      accent={ACCENT}
      artworkGradient="linear-gradient(135deg,#0a1e1e 0%,#051414 100%)"
      artworkImage="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&h=600&q=80"
      isOpenEnded={true}
      onBack={onBack}
    />
  )
}
