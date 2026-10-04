export type TerritoryId =
  | 'ideas'
  | 'concepts'
  | 'deep-time'
  | 'stories'
  | 'artifacts'
  | 'people'
  | 'places'
  | 'systems'

export type Vec3 = [number, number, number]
export type Stage = 'enter' | 'explore' | 'return' | 'reveal'
export type ObservationKind = 'VISIT' | 'RETURN' | 'DWELL'

export interface Territory {
  id: TerritoryId
  name: string
  deck: string
  shape: 'arch' | 'orb' | 'spire' | 'ring' | 'book' | 'monolith'
  signal: [number, number, number]
}

export interface Observation {
  id: string
  kind: ObservationKind
  territoryId: TerritoryId
  dwellMs: number
  intention: 'UNKNOWN'
}

export interface PositionChange {
  territoryId: TerritoryId
  before: Vec3
  after: Vec3
  distance: number
}

export interface Mutation {
  id: string
  observationId: string
  ruleId: 'BEHAVIOR_UPDATES_LOCAL_AFFINITY'
  sourceTerritoryId: TerritoryId
  changes: PositionChange[]
  intention: 'UNKNOWN'
}

export interface WorldState {
  stage: Stage
  positions: Record<TerritoryId, Vec3>
  visits: Record<TerritoryId, number>
  observations: Observation[]
  mutations: Mutation[]
}

export const TERRITORIES: Territory[] = [
  { id: 'ideas', name: 'Ideas', deck: 'Patterns before they become systems.', shape: 'arch', signal: [0.92, 0.68, 0.34] },
  { id: 'concepts', name: 'Concepts', deck: 'Structures that make abstract things navigable.', shape: 'ring', signal: [0.85, 0.9, 0.28] },
  { id: 'deep-time', name: 'Deep Time', deck: 'Long horizons, slow causes, accumulated consequence.', shape: 'spire', signal: [0.76, 0.72, 0.1] },
  { id: 'stories', name: 'Stories', deck: 'Sequences that let meaning travel between people.', shape: 'book', signal: [0.5, 0.44, 0.92] },
  { id: 'artifacts', name: 'Artifacts', deck: 'Objects that preserve a decision after its maker leaves.', shape: 'monolith', signal: [0.34, 0.7, 0.56] },
  { id: 'people', name: 'People', deck: 'Traces of judgment, care, influence, and memory.', shape: 'orb', signal: [0.28, 0.3, 1] },
  { id: 'places', name: 'Places', deck: 'Context made spatial enough to return to.', shape: 'arch', signal: [0.22, 0.48, 0.72] },
  { id: 'systems', name: 'Systems', deck: 'Rules that keep acting after the first choice.', shape: 'ring', signal: [1, 0.82, 0.18] },
]

export const TERRITORY_BY_ID = Object.fromEntries(TERRITORIES.map((t) => [t.id, t])) as Record<TerritoryId, Territory>

export const BASELINE_POSITIONS: Record<TerritoryId, Vec3> = {
  ideas: [-4.25, 0.2, 0.4],
  concepts: [-2.55, 0.2, -3.0],
  'deep-time': [0.15, 0.25, -4.6],
  stories: [3.15, 0.2, -2.75],
  artifacts: [4.45, 0.25, 0.2],
  people: [3.0, 0.15, 3.15],
  places: [-0.4, 0.2, 4.45],
  systems: [-3.65, 0.2, 2.75],
}

export const EDGES: Array<[TerritoryId, TerritoryId]> = [
  ['ideas', 'concepts'],
  ['ideas', 'systems'],
  ['concepts', 'deep-time'],
  ['concepts', 'artifacts'],
  ['deep-time', 'stories'],
  ['stories', 'people'],
  ['stories', 'artifacts'],
  ['artifacts', 'people'],
  ['people', 'places'],
  ['places', 'systems'],
  ['systems', 'ideas'],
  ['systems', 'concepts'],
]

const copyPosition = (p: Vec3): Vec3 => [p[0], p[1], p[2]]
const copyPositions = (positions: Record<TerritoryId, Vec3>) =>
  Object.fromEntries(Object.entries(positions).map(([id, p]) => [id, copyPosition(p as Vec3)])) as Record<TerritoryId, Vec3>

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const round = (value: number) => Math.round(value * 1000) / 1000

const similarity = (a: Territory, b: Territory) => {
  const distance = (Math.abs(a.signal[0] - b.signal[0]) + Math.abs(a.signal[1] - b.signal[1]) + Math.abs(a.signal[2] - b.signal[2])) / 3
  return 1 - distance
}

const observationStrength: Record<ObservationKind, number> = {
  VISIT: 0.16,
  RETURN: 0.24,
  DWELL: 0.2,
}

export const createInitialWorld = (): WorldState => ({
  stage: 'enter',
  positions: copyPositions(BASELINE_POSITIONS),
  visits: {
    ideas: 0,
    concepts: 0,
    'deep-time': 0,
    stories: 0,
    artifacts: 0,
    people: 0,
    places: 0,
    systems: 0,
  },
  observations: [],
  mutations: [],
})

export const enterWorld = (state: WorldState): WorldState => ({ ...state, stage: 'explore' })

export function applyObservation(
  state: WorldState,
  territoryId: TerritoryId,
  kind: ObservationKind,
  dwellMs = 0,
): WorldState {
  if (state.stage !== 'explore') return state

  const source = TERRITORY_BY_ID[territoryId]
  const observationId = `obs-${String(state.observations.length + 1).padStart(2, '0')}`
  const observation: Observation = {
    id: observationId,
    kind,
    territoryId,
    dwellMs: Math.max(0, Math.round(dwellMs)),
    intention: 'UNKNOWN',
  }

  const positions = copyPositions(state.positions)
  const strength = observationStrength[kind] * (kind === 'DWELL' ? clamp(dwellMs / 6500, 0.65, 1.35) : 1)
  const sourcePosition = positions[territoryId]
  const changes: PositionChange[] = []

  for (const territory of TERRITORIES) {
    const before = copyPosition(positions[territory.id])
    let [x, y, z] = before

    if (territory.id === territoryId) {
      const centerPull = 0.03 + strength * 0.08
      x += (0 - x) * centerPull
      z += (0 - z) * centerPull
      y = clamp(y + 0.03 + strength * 0.08, 0.15, 0.72)
    } else {
      const affinity = similarity(source, territory)
      const dx = sourcePosition[0] - x
      const dz = sourcePosition[2] - z
      const pull = strength * Math.max(0, affinity - 0.38) * 0.72
      const push = strength * Math.max(0, 0.36 - affinity) * 0.24
      x += dx * pull - dx * push
      z += dz * pull - dz * push
      y = clamp(y + pull * 0.09, 0.12, 0.68)
    }

    const after: Vec3 = [round(clamp(x, -5.35, 5.35)), round(y), round(clamp(z, -5.25, 5.25))]
    positions[territory.id] = after
    const distance = Math.hypot(after[0] - before[0], after[1] - before[1], after[2] - before[2])
    if (distance >= 0.012) {
      changes.push({ territoryId: territory.id, before, after, distance: round(distance) })
    }
  }

  const visits = { ...state.visits }
  if (kind === 'VISIT' || kind === 'RETURN') visits[territoryId] += 1
  const uniqueVisits = Object.values(visits).filter((count) => count > 0).length
  const nextStage: Stage = uniqueVisits >= 4 && visits['deep-time'] > 0 ? 'return' : 'explore'

  const mutation: Mutation = {
    id: `mut-${String(state.mutations.length + 1).padStart(2, '0')}`,
    observationId,
    ruleId: 'BEHAVIOR_UPDATES_LOCAL_AFFINITY',
    sourceTerritoryId: territoryId,
    changes,
    intention: 'UNKNOWN',
  }

  return {
    ...state,
    stage: nextStage,
    positions,
    visits,
    observations: [...state.observations, observation],
    mutations: [...state.mutations, mutation],
  }
}

export function completeDeepTimeReturn(state: WorldState, territoryId: TerritoryId): WorldState {
  if (state.stage !== 'return' || territoryId !== 'deep-time') return state
  return { ...state, stage: 'reveal' }
}

export const getUniqueVisitCount = (state: WorldState) => Object.values(state.visits).filter((count) => count > 0).length

export const totalWorldTravel = (state: WorldState) =>
  state.mutations.flatMap((mutation) => mutation.changes).reduce((sum, change) => sum + change.distance, 0)
