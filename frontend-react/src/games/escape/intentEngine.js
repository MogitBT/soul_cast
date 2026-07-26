// Classifies a player message against the puzzle graph.
// Returns { nodeId, action } | null

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean)
}

function overlap(tokens, keywords) {
  return keywords.some(kw => tokens.some(t => t.includes(kw) || kw.includes(t)))
}

export function classifyIntent(text, nodes, revealedIds) {
  const tokens = tokenize(text)

  // Sort unrevealed nodes by prerequisite satisfaction first
  const unrevealed = nodes.filter(n => !revealedIds.includes(n.id))

  for (const node of unrevealed) {
    const keywords = node.keywords || []
    if (overlap(tokens, keywords)) {
      const prereqsMet = (node.prereqs || []).every(p => revealedIds.includes(p))
      return { node, prereqsMet }
    }
  }

  // Check if they're asking about an already-revealed node
  const revealed = nodes.filter(n => revealedIds.includes(n.id))
  for (const node of revealed) {
    const keywords = node.keywords || []
    if (overlap(tokens, keywords)) {
      return { node, prereqsMet: true, alreadyFound: true }
    }
  }

  return null
}

export function generateHintResponse(node, hintLevel, revealedIds) {
  if (!node.prereqs || node.prereqs.length === 0) {
    if (hintLevel === 0) return `Something about ${node.label} catches your eye, but you can't quite see how it connects yet.`
    if (hintLevel === 1) return `Look more carefully at ${node.label} — there's something hidden there.`
    return `Examine ${node.label} directly. The answer is right in front of you.`
  }
  if (hintLevel === 0) return `You try, but nothing happens. Something else needs to happen first.`
  if (hintLevel === 1) return `This won't work yet. Have you checked everything in the room so far?`
  return `You need to solve an earlier puzzle before ${node.label} will respond.`
}
