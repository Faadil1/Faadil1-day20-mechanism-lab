import { describe, expect, it } from 'vitest'
import {
  applyObservation,
  completeDeepTimeReturn,
  createInitialWorld,
  enterWorld,
  type TerritoryId,
  type WorldState,
} from './world'

function runSequence(sequence: TerritoryId[]): WorldState {
  let world = enterWorld(createInitialWorld())
  for (const id of sequence) world = applyObservation(world, id, world.visits[id] ? 'RETURN' : 'VISIT')
  return world
}

describe('Living Compendium canonical world model', () => {
  it('is deterministic for the same observation sequence', () => {
    const sequence: TerritoryId[] = ['deep-time', 'ideas', 'concepts', 'stories']
    const a = runSequence(sequence)
    const b = runSequence(sequence)
    expect(a.positions).toEqual(b.positions)
    expect(a.mutations).toEqual(b.mutations)
  })

  it('never upgrades behavior into known intention', () => {
    const world = runSequence(['ideas', 'concepts'])
    expect(world.observations.every((observation) => observation.intention === 'UNKNOWN')).toBe(true)
    expect(world.mutations.every((mutation) => mutation.intention === 'UNKNOWN')).toBe(true)
  })

  it('opens the Deep Time return task after four territories including Deep Time', () => {
    const world = runSequence(['deep-time', 'ideas', 'concepts', 'stories'])
    expect(world.stage).toBe('return')
  })

  it('reveals only when Deep Time is reached during the return task', () => {
    const world = runSequence(['deep-time', 'ideas', 'concepts', 'stories'])
    expect(completeDeepTimeReturn(world, 'ideas').stage).toBe('return')
    expect(completeDeepTimeReturn(world, 'deep-time').stage).toBe('reveal')
  })

  it('keeps every territory inside the bounded navigable world', () => {
    const world = runSequence(['deep-time', 'ideas', 'concepts', 'stories'])
    for (const position of Object.values(world.positions)) {
      expect(Math.abs(position[0])).toBeLessThanOrEqual(5.35)
      expect(Math.abs(position[2])).toBeLessThanOrEqual(5.25)
    }
  })
})
