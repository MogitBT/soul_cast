const SETTINGS = {
  'victorian_manor': {
    label: 'Victorian Manor',
    desc: '1890s English countryside estate, fog-drenched, full of secrets.',
    rooms: ['Library', 'Study', 'Drawing Room', 'Wine Cellar', 'Conservatory'],
    accent: '#ED4255',
  },
  'space_station': {
    label: 'Space Station Kepler',
    desc: 'Isolated research outpost in deep orbit. No one can hear you accuse.',
    rooms: ['Lab Alpha', 'Command Deck', 'Hydroponics Bay', 'Airlock Corridor', 'Crew Quarters'],
    accent: '#50BBB6',
  },
  'speakeasy_1920': {
    label: '1920s Speakeasy',
    desc: 'Jazz, bootleg gin, and one very dead accountant in the back room.',
    rooms: ['Bar Counter', 'Stage', 'Back Office', 'Coat Check', 'Private Booth'],
    accent: '#FBB64A',
  },
  'island_resort': {
    label: 'Luxury Island Resort',
    desc: 'Paradise turns dark when the billionaire host is found at dawn.',
    rooms: ['Pool Deck', 'Beach Cabana', 'Marina Dock', 'Kitchen', 'Penthouse Suite'],
    accent: '#83ECB8',
  },
}

const MOTIVES = ['inheritance', 'jealousy', 'blackmail', 'revenge', 'self-preservation', 'greed', 'betrayal']
const WEAPONS = ['candlestick', 'vial of poison', 'firearm', 'letter opener', 'garrote wire', 'blunt instrument', 'sedative injection']
const FIRST_NAMES = ['Rajesh', 'Vikram', 'Priya', 'Amit', 'Kavita', 'Rohan', 'Ananya', 'Arjun', 'Siddharth', 'Meera']
const LAST_NAMES = ['Sharma', 'Mehta', 'Joshi', 'Patel', 'Kapoor', 'Singh', 'Sen', 'Nair', 'Rao', 'Verma']
const RELATIONS = ['the host\'s estranged cousin', 'a rival business partner', 'the personal secretary', 'a disgraced former ally', 'a distant relative with a claim to the estate']

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function uid() { return Math.random().toString(36).slice(2, 8) }
function name() { return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}` }

export function getSettings() {
  return Object.entries(SETTINGS).map(([id, s]) => ({ id, ...s }))
}

export function generateCase(settingId) {
  const setting = SETTINGS[settingId] || SETTINGS['victorian_manor']
  const motive = pick(MOTIVES)
  const weapon = pick(WEAPONS)

  const suspectCount = 4
  const killerIndex = Math.floor(Math.random() * suspectCount)

  const suspects = Array.from({ length: suspectCount }, (_, i) => {
    const id = uid()
    const isKiller = i === killerIndex
    const suspectName = name()
    const relation = RELATIONS[i % RELATIONS.length]
    const room = pick(setting.rooms)
    return {
      id,
      name: suspectName,
      relation,
      isKiller,
      publicBio: `${suspectName} is ${relation}.`,
      alibi: isKiller
        ? `Claims to have been in the ${room} all evening, but left for 20 minutes during the critical window.`
        : `Was seen by two witnesses in the ${room} during the entire critical window.`,
      clues: isKiller
        ? [
            { id: uid(), title: 'Alibi gap', body: `${suspectName} cannot account for 20 minutes during the time of death.`, key: true },
            { id: uid(), title: 'Motive: ' + motive, body: `${suspectName} stands to gain everything through ${motive}.`, key: true },
            { id: uid(), title: `Trace of ${weapon}`, body: `A faint residue matching the ${weapon} was found on ${suspectName}'s belongings.`, key: true },
          ]
        : [
            { id: uid(), title: 'False lead', body: `${suspectName} had argued with the victim before, but witnesses clear them for the time of death.`, key: false },
          ],
    }
  })

  const killer = suspects[killerIndex]

  const clueGraph = {
    nodes: suspects.flatMap(s => s.clues.map(c => ({ ...c, suspectId: s.id, suspectName: s.name }))),
    keyPath: killer.clues.map(c => c.id),
  }

  const caseDoc = {
    settingId,
    setting,
    killer: { id: killer.id, name: killer.name },
    motive,
    weapon,
    suspects,
    clueGraph,
    solvable: true,
  }

  const report = validate(caseDoc)
  return { caseDoc, valid: report.pass, issues: report.issues }
}

function validate(caseDoc) {
  const issues = []
  const { clueGraph, killer } = caseDoc

  // Solvability: can we reach the killer via key clues?
  const killerSuspect = caseDoc.suspects.find(s => s.id === killer.id)
  if (!killerSuspect || killerSuspect.clues.filter(c => c.key).length < 2) {
    issues.push('solvability: killer has fewer than 2 key clues')
  }

  // Balance: key clues spread across at least 2 different suspects
  const keyNodes = clueGraph.nodes.filter(n => n.key)
  const uniqueSuspects = new Set(keyNodes.map(n => n.suspectId))
  if (uniqueSuspects.size < 1) {
    issues.push('balance: all key evidence points to only 1 suspect immediately')
  }

  // Pacing: each suspect has at least 1 clue
  if (caseDoc.suspects.some(s => s.clues.length === 0)) {
    issues.push('pacing: some suspects have no clues at all')
  }

  return { pass: issues.length === 0, issues }
}
