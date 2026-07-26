import AudioStoryPlayer from '../shared/AudioStoryPlayer'

const ACCENT = '#FBB64A'

const BEATS = [
  {
    id: 'ch1_open',
    type: 'narration',
    text: `You are Kabir, a mid-level fixer in Delhi. It's 2 AM and pouring rain. You've just received a locked briefcase from a panicking politician and strict orders to deliver it to a warehouse in Okhla. But your phone buzzes—a text from an unknown number: "I know what's in the briefcase, Kabir. Drop it off a bridge, or you're a dead man." You look in your rearview mirror and see a black Scorpio with tinted windows tailing you.`,
  },
  {
    id: 'story_loop',
    type: 'chat_interaction',
    interactionType: 'story',
    storyContext: "You are Kabir, a fixer driving in Delhi at 2 AM with a mysterious briefcase. A black Scorpio is tailing you, and you just got a threat to drop the briefcase off a bridge.",
    prompt: 'What do you do?',
    maxTurns: 5,
  }
]

export default function DivergentStoryGame({ onBack }) {
  return (
    <AudioStoryPlayer
      beats={BEATS}
      title="The Delhi Drop"
      series="Interactive Podcast"
      episode="Season 1 · Episode 1"
      accent={ACCENT}
      artworkGradient="linear-gradient(135deg,#1e1200 0%,#140c00 100%)"
      artworkImage="https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&h=600&q=80"
      isOpenEnded={true}
      onBack={onBack}
    />
  )
}
