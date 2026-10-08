export type Probe = 'strata' | 'route'
export type NodeId = 'threshold' | 'arcade' | 'gallery' | 'signal' | 'deep-time'
export type EdgeId = 't-a' | 'a-d' | 't-g' | 'g-d' | 'a-s' | 's-g' | 's-d'
export type Choice = 'KEEP' | 'PASS'
export type Stage = 'entry' | 'seek' | 'explore' | 'return' | 'reflect' | 'reveal' | 'end'
export type Signal = 'TRAVEL' | 'KEEP' | 'PASS' | 'RESTORE' | 'LEAVE_AS_IS'
export interface Edge {
  id: EdgeId
  from: NodeId
  to: NodeId
  cost: number
  available: boolean
  visibility: number
  deposit: number
}
export interface Snapshot {
  revision: number
  edges: Record<EdgeId, Edge>
}
export interface Receipt {
  id: string
  observationId: string
  signal: Signal
  at: NodeId
  ruleId: string
  before: Snapshot
  after: Snapshot
  consequence: string
  intention: 'UNKNOWN'
}
export interface Journey {
  probe: Probe
  stage: Stage
  current: NodeId
  visited: NodeId[]
  firstRoute: EdgeId[]
  traveled: EdgeId[]
  choices: Partial<Record<NodeId, Choice>>
  receipts: Receipt[]
  world: Snapshot
  revealedIndex: number
  finalChoice: 'RESTORE' | 'KEEP' | null
}
export interface Artifact {
  id: NodeId
  name: string
  label: string
  description: string
  detail: string
}
export const ARTIFACTS: Artifact[] = [
  { id: 'arcade', name: 'Looping postcard', label: '01 / Motion', description: 'A tiny moving image that travels further than its original page.', detail: 'The loop survived; the route between sender, recipient, and maker did not always travel with it. This specimen is original fiction for the experiment.' },
  { id: 'gallery', name: 'Handmade index', label: '02 / Links', description: 'Someone leaves a deliberately chosen door open for a stranger.', detail: 'A hand-picked link points to another person, another context, another possible next step. This specimen is original fiction for the experiment.' },
  { id: 'signal', name: 'An unsent note', label: '03 / People', description: 'A recommendation without a sender arrives without its story.', detail: 'The note remembers who suggested a journey. The destination alone cannot tell you how it began. This specimen is original fiction for the experiment.' },
]
export const NODES: { id: NodeId; name: string; x: number; y: number; z: number }[] = [
  { id: 'threshold', name: 'The Threshold', x: 100, y: 209, z: 0 },
  { id: 'arcade', name: 'The Loop', x: 288, y: 104, z: 1 },
  { id: 'gallery', name: 'The Index', x: 304, y: 320, z: 2 },
  { id: 'signal', name: 'The Signal', x: 530, y: 288, z: 3 },
  { id: 'deep-time', name: 'Deep Time', x: 764, y: 174, z: 4 },
]
const EDGES: Edge[] = [
  { id: 't-a', from: 'threshold', to: 'arcade', cost: 1, available: true, visibility: 1, deposit: 0 },
  { id: 'a-d', from: 'arcade', to: 'deep-time', cost: 1, available: true, visibility: 1, deposit: 0 },
  { id: 't-g', from: 'threshold', to: 'gallery', cost: 1.25, available: true, visibility: 1, deposit: 0 },
  { id: 'g-d', from: 'gallery', to: 'deep-time', cost: 1.5, available: true, visibility: 1, deposit: 0 },
  { id: 'a-s', from: 'arcade', to: 'signal', cost: 1.1, available: true, visibility: 1, deposit: 0 },
  { id: 's-g', from: 'signal', to: 'gallery', cost: 1.1, available: true, visibility: 1, deposit: 0 },
  { id: 's-d', from: 'signal', to: 'deep-time', cost: 2.2, available: true, visibility: 1, deposit: 0 },
]
const byId = (edges: Edge[]) => Object.fromEntries(edges.map(e => [e.id, e])) as Record<EdgeId, Edge>
const clone = (world: Snapshot): Snapshot => ({
  revision: world.revision,
  edges: Object.fromEntries(Object.entries(world.edges).map(([id, edge]) => [id, { ...edge }])) as Record<EdgeId, Edge>,
})
const safe = (n: number) => Math.round(n * 100) / 100
const routeFor = (id: NodeId): EdgeId => id === 'arcade' ? 'a-d' : id === 'gallery' ? 'g-d' : 's-d'
const alternateFor = (id: NodeId): EdgeId => id === 'arcade' ? 'g-d' : id === 'gallery' ? 'a-d' : 'a-d'

export const newJourney = (probe: Probe): Journey => ({
  probe, stage: 'entry', current: 'threshold', visited: ['threshold'],
  firstRoute: [], traveled: [], choices: {}, receipts: [],
  world: { revision: 0, edges: byId(EDGES.map(e => ({ ...e }))) },
  revealedIndex: 0, finalChoice: null,
})
export const startJourney = (state: Journey): Journey =>
  state.stage === 'entry' ? { ...state, stage: 'seek' } : state

export const connectedEdges = (world: Snapshot, node: NodeId) =>
  Object.values(world.edges).filter(e => e.from === node || e.to === node)

export const neighbor = (edge: Edge, node: NodeId): NodeId => edge.from === node ? edge.to : edge.from

export function isReachable(world: Snapshot, from: NodeId, to: NodeId): boolean {
  const queue = [from]; const seen = new Set<NodeId>([from])
  while (queue.length) {
    const at = queue.shift()!
    if (at === to) return true
    for (const edge of connectedEdges(world, at)) {
      if (!edge.available) continue
      const next = neighbor(edge, at)
      if (!seen.has(next)) { seen.add(next); queue.push(next) }
    }
  }
  return false
}

export function travel(state: Journey, edgeId: EdgeId): Journey {
  if (!['seek', 'explore', 'return'].includes(state.stage)) return state
  const edge = state.world.edges[edgeId]
  if (!edge || !edge.available || (edge.from !== state.current && edge.to !== state.current)) return state
  const target = neighbor(edge, state.current)
  const arrivedFirst = state.stage === 'seek' && target === 'deep-time'
  const returned = state.stage === 'return' && target === 'deep-time'
  const stage: Stage = returned ? 'reflect' : arrivedFirst ? 'explore' : state.stage
  const visited = state.visited.includes(target) ? state.visited : [...state.visited, target]
  return {
    ...state, current: target, stage, visited,
    firstRoute: state.stage === 'seek' ? [...state.firstRoute, edgeId] : state.firstRoute,
    traveled: [...state.traveled, edgeId],
  }
}

function mutate(state: Journey, signal: Signal, at: NodeId, make: (world: Snapshot) => string): Journey {
  const before = clone(state.world)
  const after = clone(state.world)
  after.revision += 1
  const consequence = make(after)
  const receipt: Receipt = {
    id: 'mut-' + (state.receipts.length + 1),
    observationId: 'obs-' + (state.receipts.length + 1),
    signal, at, ruleId: signal === 'RESTORE' ? 'EXPLICIT_RESTORE' : signal === 'LEAVE_AS_IS' ? 'EXPLICIT_PRESERVE' : 'LOCAL_PATH_REWEIGHT_V1',
    before, after, consequence, intention: 'UNKNOWN',
  }
  return { ...state, world: after, receipts: [...state.receipts, receipt] }
}

export function chooseArtifact(state: Journey, artifactId: NodeId, choice: Choice): Journey {
  if (state.stage !== 'explore' || state.current !== artifactId || !['arcade', 'gallery', 'signal'].includes(artifactId) || state.choices[artifactId]) return state
  let next = mutate(state, choice, artifactId, world => {
    const primary = world.edges[routeFor(artifactId)]
    const alternative = world.edges[alternateFor(artifactId)]
    if (choice === 'KEEP') {
      primary.cost = safe(Math.max(0.45, primary.cost - 0.35))
      primary.deposit = safe(primary.deposit + 0.65)
      alternative.cost = safe(alternative.cost + 0.52)
      alternative.deposit = safe(alternative.deposit + 0.3)
    } else {
      primary.cost = safe(primary.cost + 0.68)
      primary.deposit = safe(primary.deposit + 0.5)
      alternative.cost = safe(Math.max(0.45, alternative.cost - 0.16))
      alternative.deposit = safe(alternative.deposit + 0.15)
    }
    for (const edge of Object.values(world.edges)) {
      edge.visibility = safe(Math.max(0.18, 1 - edge.deposit * 0.32))
      if (edge.cost > 2.6 && ['a-d', 'g-d', 's-d'].includes(edge.id)) edge.available = false
    }
    // A rule may never strand the archive; prefer a traversable path over a dramatic but broken one.
    if (!isReachable(world, artifactId, 'deep-time')) {
      for (const edge of Object.values(world.edges)) edge.available = true
    }
    return choice === 'KEEP'
      ? 'A nearby route was reinforced; another became more costly.'
      : 'One route grew less prominent; an alternative became easier.'
  })
  const choices = { ...state.choices, [artifactId]: choice }
  const count = Object.keys(choices).length
  next = { ...next, choices, stage: count >= 2 ? 'return' : 'explore' }
  return next
}

export function submitReflection(state: Journey): Journey {
  return state.stage === 'reflect' ? { ...state, stage: 'reveal', revealedIndex: 0 } : state
}
export const setRevealIndex = (state: Journey, index: number): Journey =>
  state.stage === 'reveal' ? { ...state, revealedIndex: Math.max(0, Math.min(state.receipts.length - 1, index)) } : state

export function decideEnding(state: Journey, decision: 'RESTORE' | 'KEEP'): Journey {
  if (state.stage !== 'reveal') return state
  if (decision === 'KEEP') return {
    ...mutate(state, 'LEAVE_AS_IS', state.current, () => 'The altered routes were deliberately preserved.'),
    finalChoice: decision, stage: 'end',
  }
  return {
    ...mutate(state, 'RESTORE', state.current, world => {
      for (const edge of EDGES) world.edges[edge.id] = { ...edge }
      return 'The original route costs and availability were restored.'
    }), finalChoice: decision, stage: 'end',
  }
}

export const routeChanged = (state: Journey): boolean => Object.values(state.world.edges).some(edge => {
  const initial = EDGES.find(e => e.id === edge.id)!
  return edge.available !== initial.available || Math.abs(edge.cost - initial.cost) > 0.01
})
export const exportReceipt = (state: Journey, answers: Record<string, string>) => ({
  study_version: 'V4-EXPERIENTIAL-KILL-TEST-001', evidence_class: 'LOCAL_BROWSER_SESSION', condition: state.probe,
  probe_is_not_an_historical_simulation: true, generated_at: new Date().toISOString(),
  first_route: state.firstRoute, traversed_edges: state.traveled, choices: state.choices,
  receipts: state.receipts, answers, final_action: state.finalChoice,
  disclaimer: 'No data were submitted to a server. Behavioral actions cannot prove intention.',
})
