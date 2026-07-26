export const CHAPTERS = [
  {
    id: 'ch1',
    title: 'The Letter',
    text: `You find a letter tucked under your apartment door at midnight. It's from someone you haven't spoken to in seven years — a friend who vanished after your biggest argument. The letter says they need you. They're in trouble.\n\nYou remember the night everything fell apart. The things said that couldn't be unsaid. But the handwriting is unmistakably theirs, and they sound desperate.`,
    choices: [
      { id: 'go_now', label: 'Go immediately', archetypeWeight: { redemption: 3, betrayal: 0, bittersweet: 1, triumphant: 1 } },
      { id: 'wait_morning', label: 'Wait until morning', archetypeWeight: { redemption: 1, betrayal: 1, bittersweet: 3, triumphant: 0 } },
      { id: 'ignore', label: 'Ignore it', archetypeWeight: { redemption: 0, betrayal: 3, bittersweet: 1, triumphant: 0 } },
    ],
  },
  {
    id: 'ch2',
    title: 'The Meeting',
    text: `You find them in a dim café near the waterfront. They look older — worn, but still them. Before you can speak, they tell you what happened: they got pulled into something they couldn't control, people who needed money paid back, a series of bad decisions that cascaded.\n\nThen they ask for help. Not money — time. A favor. Cover for them while they sort things out. One night. No one will know.`,
    choices: [
      { id: 'agree', label: 'Agree to help', archetypeWeight: { redemption: 2, betrayal: 0, bittersweet: 1, triumphant: 2 } },
      { id: 'push_back', label: 'Ask more questions first', archetypeWeight: { redemption: 1, betrayal: 0, bittersweet: 2, triumphant: 2 } },
      { id: 'refuse', label: 'Refuse and walk away', archetypeWeight: { redemption: 0, betrayal: 3, bittersweet: 2, triumphant: 0 } },
    ],
  },
  {
    id: 'ch3',
    title: 'The Night',
    text: `The night doesn't go as planned. Someone else shows up — a third party who had their own claim on the situation. You're caught between your old friend and this stranger who seems to know more about the situation than either of you.\n\nYou have one choice that matters. You can speak up — tell the truth about everything you know — or stay silent and let the moment pass, protecting your friend but leaving the stranger in the dark.`,
    choices: [
      { id: 'speak_truth', label: 'Tell the full truth', archetypeWeight: { redemption: 3, betrayal: 0, bittersweet: 1, triumphant: 2 } },
      { id: 'partial', label: 'Reveal only what helps your friend', archetypeWeight: { redemption: 1, betrayal: 1, bittersweet: 3, triumphant: 1 } },
      { id: 'silence', label: 'Stay silent', archetypeWeight: { redemption: 0, betrayal: 2, bittersweet: 2, triumphant: 0 } },
    ],
  },
  {
    id: 'ch4',
    title: 'The Climax',
    text: `Everything converges at dawn. Your friend is safe — for now. The stranger left without answers. You're alone on the waterfront, watching the sun come up over a city that has no idea what just happened.\n\nYou think about the choices you made. About what you owe people, and what you don't. About what it means to show up for someone after years of silence.\n\nThe ending is already written in the decisions you made through the night.`,
    choices: null,
  },
]

export const ENDINGS = {
  redemption: {
    title: 'Redemption',
    color: '#83ECB8',
    icon: '🌱',
    text: `You chose, again and again, to show up. To go despite the hour, to ask the hard questions, to tell the truth even when it cost something. By dawn, you and your friend have something you didn't have before — not forgiveness exactly, but an understanding. The seven years of silence hadn't erased the connection. It had just paused it.\n\nYou walk home in the early light feeling lighter than you have in years. Whatever comes next, you didn't run.`,
  },
  betrayal: {
    title: 'Betrayal',
    color: '#ED4255',
    icon: '🌑',
    text: `You chose distance, again and again. The letter went unanswered long enough that it didn't matter. When you met, you stayed behind your walls. At the critical moment, you walked away.\n\nStanding at the waterfront alone, you feel a strange clarity. You protected yourself. You made the rational choice every time. But rationality has a strange texture at dawn — it feels a lot like regret wearing a different name.`,
  },
  bittersweet: {
    title: 'Bittersweet',
    color: '#FBB64A',
    icon: '🌅',
    text: `You did what you could, held back where it mattered, revealed enough to help but not enough to fully clear the air. Your friend is okay. The stranger left without resolution. You're not sure what either of them really thinks of you now.\n\nThe sun comes up anyway. Some things don't get resolved cleanly. Some reconciliations are partial, and the honest ones usually are. You're at peace with that — mostly.`,
  },
  triumphant: {
    title: 'Triumphant',
    color: '#50BBB6',
    icon: '⭐',
    text: `You trusted your instincts and acted decisively at every turn. You went when called, asked the right questions, agreed when it was right to agree, and told the truth when the truth was needed. Everything aligned.\n\nYour friend made it through. The stranger left with what they needed. And you — you found that showing up for someone, even someone who hurt you, even after years, can be its own reward. The city gleams in the early light.`,
  },
}

export function classifyArchetype(signals) {
  const totals = { redemption: 0, betrayal: 0, bittersweet: 0, triumphant: 0 }
  signals.forEach(s => {
    Object.entries(s.archetypeWeights).forEach(([k, v]) => { totals[k] += v })
  })
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1])
  // Tiebreak: bittersweet
  const top = sorted[0]
  const second = sorted[1]
  if (top[1] === second[1]) return 'bittersweet'
  return top[0]
}
