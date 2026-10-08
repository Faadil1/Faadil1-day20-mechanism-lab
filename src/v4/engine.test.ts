import { describe, expect, it } from 'vitest'
import {
  chooseArtifact, connectedEdges, decideEnding, isReachable, newJourney,
  neighbor, routeChanged, setRevealIndex, startJourney, submitReflection, travel,
  type EdgeId, type Journey, type Probe,
} from './engine'

function move(state: Journey, edgeId: EdgeId) { return travel(state, edgeId) }

function toExplore(probe: Probe = 'strata') {
  let s = startJourney(newJourney(probe))
  s = move(s, 't-a')
  s = move(s, 'a-d')
  return s
}
function toReturn(probe: Probe = 'strata') {
  let s = toExplore(probe)
  s = move(s, 'a-d')
  s = chooseArtifact(s, 'arcade', 'PASS')
  s = move(s, 'a-s')
  s = chooseArtifact(s, 'signal', 'KEEP')
  return s
}
function findPath(state: Journey, destination: Journey['current']): EdgeId[] {
  const queue: {node: Journey['current']; edges: EdgeId[]}[] = [{node:state.current,edges:[]}]
  const seen=new Set([state.current])
  while(queue.length) {
    const {node,edges}=queue.shift()!
    if(node===destination)return edges
    for(const edge of connectedEdges(state.world,node)) {
      if(!edge.available)continue
      const next=neighbor(edge,node)
      if(!seen.has(next)){seen.add(next);queue.push({node:next,edges:[...edges,edge.id]})}
    }
  }
  return []
}

describe('V4 paired experiential probe — canonical causal engine', () => {
  it('starts with the same graph and artifacts for both visual conditions', () => {
    const a=newJourney('strata'), b=newJourney('route')
    expect(a.world).toEqual(b.world)
    expect(a.current).toBe('threshold')
    expect(b.current).toBe('threshold')
  })

  it('requires actual connected travel and records the first route to Deep Time', () => {
    let s=startJourney(newJourney('strata'))
    expect(move(s,'a-d')).toBe(s)
    s=move(s,'t-a')
    expect(s.stage).toBe('seek')
    s=move(s,'a-d')
    expect(s.stage).toBe('explore')
    expect(s.firstRoute).toEqual(['t-a','a-d'])
    expect(s.current).toBe('deep-time')
  })

  it('only permits a decision at the currently visited artifact and only once per artifact', () => {
    let s=toExplore()
    const untouched=chooseArtifact(s,'gallery','KEEP')
    expect(untouched).toBe(s)
    s=move(s,'a-d')
    s=chooseArtifact(s,'arcade','PASS')
    expect(s.receipts).toHaveLength(1)
    expect(chooseArtifact(s,'arcade','KEEP')).toBe(s)
    expect(s.choices.arcade).toBe('PASS')
  })

  it('gives each material event exact immutable before/after snapshots and UNKNOWN intention', () => {
    let s=toExplore()
    s=move(s,'a-d')
    s=chooseArtifact(s,'arcade','PASS')
    const r=s.receipts[0]
    expect(r.before.revision).toBe(0)
    expect(r.after.revision).toBe(1)
    expect(r.before.edges['a-d'].cost).toBe(1)
    expect(r.after.edges['a-d'].cost).toBeGreaterThan(1)
    expect(r.intention).toBe('UNKNOWN')
    expect(s.world).toEqual(r.after)
  })

  it('offers an actually changed but reachable return route after two distinct choices', () => {
    const s=toReturn()
    expect(s.stage).toBe('return')
    expect(Object.keys(s.choices)).toHaveLength(2)
    expect(routeChanged(s)).toBe(true)
    expect(isReachable(s.world,s.current,'deep-time')).toBe(true)
    expect(s.receipts).toHaveLength(2)
  })

  it('allows successful return and asks for uncoached reflection before the receipt reveal', () => {
    let s=toReturn()
    const edges=findPath(s,'deep-time')
    expect(edges.length).toBeGreaterThan(0)
    for(const id of edges)s=move(s,id)
    expect(s.current).toBe('deep-time')
    expect(s.stage).toBe('reflect')
    expect(s.receipts.every(r=>r.intention==='UNKNOWN')).toBe(true)
    s=submitReflection(s)
    expect(s.stage).toBe('reveal')
    expect(s.receipts[0].before).not.toEqual(s.receipts[0].after)
    expect(setRevealIndex(s,999).revealedIndex).toBe(1)
  })

  it('restores the original graph only through a recorded explicit decision', () => {
    let s=toReturn()
    for(const id of findPath(s,'deep-time'))s=move(s,id)
    s=submitReflection(s)
    s=decideEnding(s,'RESTORE')
    expect(s.stage).toBe('end')
    expect(s.finalChoice).toBe('RESTORE')
    expect(s.receipts.at(-1)?.signal).toBe('RESTORE')
    expect(s.receipts.at(-1)?.ruleId).toBe('EXPLICIT_RESTORE')
    expect(routeChanged(s)).toBe(false)
  })

  it('preserving a changed world records a real no-op before/after, rather than pretending it changed', () => {
    let s=toReturn()
    for(const id of findPath(s,'deep-time'))s=move(s,id)
    s=decideEnding(submitReflection(s),'KEEP')
    expect(s.stage).toBe('end')
    expect(s.finalChoice).toBe('KEEP')
    expect(s.receipts.at(-1)?.after.edges).toEqual(s.receipts.at(-1)?.before.edges)
    expect(routeChanged(s)).toBe(true)
  })

  it('same human action sequence has identical consequences independent of renderer', () => {
    const a=toReturn('strata'), b=toReturn('route')
    expect(a.world).toEqual(b.world)
    expect(a.receipts).toEqual(b.receipts)
    expect(a.firstRoute).toEqual(b.firstRoute)
  })
})
