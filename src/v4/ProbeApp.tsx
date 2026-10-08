import { useMemo, useState } from 'react'
import {
  ARTIFACTS, NODES, connectedEdges, neighbor,
  chooseArtifact, decideEnding, exportReceipt, newJourney,
  routeChanged, setRevealIndex, startJourney, submitReflection, travel,
  type Edge, type NodeId, type Probe, type Snapshot,
} from './engine'

const nodeLookup = Object.fromEntries(NODES.map(n => [n.id, n])) as Record<NodeId, (typeof NODES)[number]>
const startingProbe: Probe = new URLSearchParams(window.location.search).get('probe') === 'route' ? 'route' : 'strata'

function linkPath(edge: Edge) {
  const a = nodeLookup[edge.from], b = nodeLookup[edge.to]
  const offset = edge.id === 'a-d' ? -45 : edge.id === 'g-d' ? 38 : edge.id === 's-d' ? 16 : 0
  const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2 + offset
  return `M${a.x},${a.y} Q${midX},${midY} ${b.x},${b.y}`
}

function Atlas({ world, probe, current, onGo, interactive }: {
  world: Snapshot; probe: Probe; current: NodeId; onGo: (id: Edge['id']) => void; interactive: boolean
}) {
  const edges = Object.values(world.edges)
  return (
    <div className={`atlas-area ${probe === 'strata' ? 'geological' : 'topological'}`}>
      <svg viewBox="0 0 860 440" role="img" aria-label={probe === 'strata' ? 'Sediment cross-section containing five destinations connected by traversable paths' : 'Route map with five destinations and traversable connections'} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="earth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d6ae86"/><stop offset=".54" stopColor="#7e463b"/><stop offset="1" stopColor="#301c25"/></linearGradient>
          <linearGradient id="goldpath" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff2bf"/><stop offset="1" stopColor="#e4a45a"/></linearGradient>
          <pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12L12 0" stroke="#f7bf90" strokeOpacity=".24" strokeWidth="1"/></pattern>
          <filter id="glow"><feGaussianBlur stdDeviation="4"/></filter>
        </defs>
        {probe === 'strata' ? (
          <g aria-hidden="true">
            <path d="M0 0H860V440H0Z" fill="url(#earth)"/>
            {Array.from({ length: 8 }, (_, i) => {
              const z = i * 45 + 20
              const edgeDeposit = Object.values(world.edges)[i % Object.values(world.edges).length]?.deposit ?? 0
              const depth = Math.min(34, edgeDeposit * 26)
              return <path key={i} d={`M0 ${z + 25} C170 ${z - 19 - depth}, 340 ${z + 61 + depth}, 510 ${z + 12} S760 ${z + 40 - depth},860 ${z + 20}L860 ${z + 35}C690 ${z + 65},500 ${z + 15 + depth},300 ${z + 57} S80 ${z + 28},0 ${z + 44}Z`} fill={['#b16c58','#a05c4f','#dda77b','#794a4d','#c18365','#713b43','#e0b184','#613441'][i]} fillOpacity=".67" stroke="#e9af80" strokeOpacity=".27" strokeWidth="1"/>
            })}
            <path d="M0 410L125 376 230 419 380 383 480 440H0Z" fill="#2a1a24" opacity=".78"/>
          </g>
        ) : (
          <g aria-hidden="true">
            <rect x="0" y="0" width="860" height="440" fill="#ede3d0"/>
            {Array.from({ length: 13 },(_,i)=><line key={i} x1={i*72} y1="0" x2={i*72} y2="440" stroke="#cbbca3" strokeOpacity=".28"/>)}
            {Array.from({ length: 9 },(_,i)=><line key={i} x1="0" y1={i*58} x2="860" y2={i*58} stroke="#cbbca3" strokeOpacity=".28"/>)}
            <circle cx="420" cy="214" r="174" stroke="#b79d80" strokeOpacity=".3" fill="none"/>
            <circle cx="420" cy="214" r="285" stroke="#b79d80" strokeOpacity=".22" fill="none"/>
          </g>
        )}
        {edges.map(edge => {
          const path = linkPath(edge)
          const canUse = edge.available && (edge.from === current || edge.to === current) && interactive
          const prominence = edge.available ? edge.visibility : .18
          return <g key={edge.id} opacity={prominence} aria-hidden="true">
            {probe === 'strata' && <path d={path} fill="none" stroke="#ffb576" strokeWidth={12+edge.deposit*5} strokeOpacity=".22" filter="url(#glow)"/>}
            <path d={path} fill="none" stroke={probe === 'strata' ? '#2f2028' : '#968772'} strokeWidth={edge.available ? 13 : 10} strokeOpacity={probe === 'strata' ? '.85' : '.23'} strokeDasharray={edge.available ? undefined : '7 9'}/>
            <path d={path} fill="none" stroke={probe === 'strata' ? 'url(#goldpath)' : '#80573e'} strokeWidth={Math.max(2.2, 5.4 - edge.cost*.65)} strokeDasharray={edge.available ? undefined : '7 9'} strokeOpacity={edge.available ? '.94' : '.55'}/>
            {canUse && <path d={path} fill="none" stroke={probe === 'strata' ? '#fff3b5' : '#ac5435'} strokeWidth="2" strokeDasharray="2 11" className="passage-pulse"/>}
          </g>
        })}
        {NODES.map(n => {
          const selected = n.id === current
          const anchor = n.id === 'deep-time'
          return <g key={n.id} transform={`translate(${n.x} ${n.y})`} aria-hidden="true">
            {selected && <circle r="27" fill="none" stroke={probe === 'strata' ? '#fff1b3' : '#a24a33'} strokeWidth="2" strokeDasharray="2 5"/>}
            <circle r={anchor ? 19 : 15} fill={probe === 'strata' ? '#271d26' : '#ede3d0'} stroke={probe === 'strata' ? '#f2c68c' : '#80583d'} strokeWidth={anchor ? 4 : 2}/>
            {anchor ? <path d="M0-11L7 0 0 11 -7 0Z" fill="#d46e48"/> : <circle r="4.5" fill={probe === 'strata' ? '#eab17b' : '#8a4633'}/>}
            <rect x={anchor ? -62 : -56} y={-48} rx="2" width={anchor ? 124 : 112} height="21" fill={probe === 'strata' ? '#29212b' : '#eee6d6'} fillOpacity=".87"/>
            <text y="-33" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="700" letterSpacing="1.5" fill={probe === 'strata' ? '#fff0d3' : '#46382e'}>{n.name.toUpperCase()}</text>
          </g>
        })}
        {probe === 'strata' && <text x="32" y="414" letterSpacing="4" fontSize="10" fill="#e9c3a0" opacity=".72">STRATA / REV {String(world.revision).padStart(2,'0')}</text>}
        {probe === 'route' && <text x="32" y="414" letterSpacing="4" fontSize="10" fill="#826e60" opacity=".72">ROUTE REGISTER / REV {String(world.revision).padStart(2,'0')}</text>}
      </svg>
    </div>
  )
}

export default function App() {
  const [journey, setJourney] = useState(() => newJourney(startingProbe))
  const [answers, setAnswers] = useState<Record<string,string>>({changed:'',cause:'',meaning:'',benefit:''})
  const [showBefore, setShowBefore] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [copyState, setCopyState] = useState('')
  const [expandedHelp, setExpandedHelp] = useState(false)

  const phase = journey.stage
  const artifact = ARTIFACTS.find(a => a.id === journey.current)
  const hasChoice = artifact && !!journey.choices[artifact.id]
  const choicesDone = Object.keys(journey.choices).length
  const activeReceipt = journey.receipts[journey.revealedIndex]
  const visibleWorld = phase === 'reveal' && activeReceipt ? (showBefore ? activeReceipt.before : activeReceipt.after) : journey.world
  const available = connectedEdges(journey.world, journey.current)
  const stageText: Record<string,string> = {
    entry: 'A passage into the archive.',
    seek: 'First, find the archive.',
    explore: 'Discover two fragments.',
    return: 'Return to Deep Time.',
    reflect: 'Before we show you the record.',
    reveal: 'Excavate the route you made.',
    end: 'A route can be rewritten.',
  }
  const instruction = phase === 'seek'
    ? 'Travel to Deep Time. Notice the route you take.'
    : phase === 'explore'
      ? 'Visit two different fragments and decide whether to keep or pass each one.'
      : phase === 'return'
        ? 'Find your way back to Deep Time using the routes available now.'
        : phase === 'reflect'
          ? 'A few questions, before the explanation. There are no right answers.'
          : phase === 'reveal'
            ? 'Select a layer, then lift it to compare the world before and after.'
            : phase === 'end'
              ? 'The final decision changed the navigable world again.'
              : 'A short interactive study of navigation, discovery, and return.'
  const isNavigating = ['seek','explore','return'].includes(phase)

  const go = (id: Edge['id']) => {
    setJourney(s => travel(s,id))
    setDetailOpen(false)
  }
  const handleCopy = async () => {
    const payload = JSON.stringify(exportReceipt(journey,answers),null,2)
    try { await navigator.clipboard.writeText(payload); setCopyState('Copied. Paste the record into your study notes.') }
    catch { setCopyState('Clipboard unavailable. Use your browser copy options or inspect the session in this tab.') }
  }
  const reset = () => {
    setJourney(newJourney(startingProbe))
    setAnswers({changed:'',cause:'',meaning:'',benefit:''})
    setShowBefore(false); setDetailOpen(false); setCopyState('')
  }

  const progress = useMemo(() => phase === 'seek' ? 1 : phase === 'explore' ? 2 : phase === 'return' ? 3 : phase === 'reflect' ? 4 : phase === 'reveal' ? 5 : phase === 'end' ? 6 : 0, [phase])

  return (
    <main className={`v4-shell ${journey.probe}`}>
      <header className="v4-header">
        <div className="v4-brand"><span>DAY 20 / RESEARCH STUDY</span><strong>{journey.probe === 'strata' ? 'Sediment Atlas' : 'The Route Register'}</strong></div>
        <div className="v4-header-right"><span className="v4-probe-label">CONDITION {journey.probe === 'strata' ? 'A' : 'B'}</span><button type="button" className="v4-ghost" onClick={reset}>Start over</button></div>
      </header>
      <section className="v4-stage" aria-live="polite">
        <div className="v4-intro"><div className="v4-meta">FIELD NOTE / {String(progress).padStart(2,'0')} OF 06</div><h1>{stageText[phase]}</h1><p>{instruction}</p></div>
        <div className="v4-progress" aria-hidden="true">{Array.from({length:6},(_,i)=><span key={i} className={i < progress ? 'done' : ''}/>)}</div>
      </section>
      <div className="v4-landscape">
        <Atlas world={visibleWorld} probe={journey.probe} current={journey.current} onGo={go} interactive={isNavigating}/>
        {phase === 'entry' && <div className="v4-entry-overlay"><div className="v4-entry-content"><div className="v4-meta">AN ORIGINAL EXPERIMENT / NO WEBGL REQUIRED</div><h2>Follow a trail into the archive.</h2><p>Travel to an archive, discover fragments, and find your way back. No account. Study responses are not uploaded.</p><button className="v4-primary" onClick={() => setJourney(startJourney)}>Begin journey <span aria-hidden="true">↗</span></button></div></div>}
      </div>

      <div className="v4-bottom">
        <div className="v4-location">
          <span className="v4-meta">CURRENT LOCATION</span>
          <h2>{nodeLookup[journey.current].name}</h2>
          <p>{journey.current === 'deep-time' ? 'The archive stays here, even when the roads change.' : artifact ? artifact.description : 'Two possible ways into the atlas. Which will you remember?'}</p>
        </div>
        <section className="v4-actions" aria-label="Journey actions">
          {isNavigating && (
            <>
              <div className="v4-section-title"><span>AVAILABLE PASSAGES</span><span>{available.filter(e=>e.available).length} open</span></div>
              <div className="v4-path-list">
                {available.map(edge => <button key={edge.id} type="button" onClick={() => go(edge.id)} disabled={!edge.available} className="v4-route-button">
                  <span>{edge.available ? '↗' : '×'}</span>
                  <strong>{nodeLookup[neighbor(edge,journey.current)].name}</strong>
                  <small>{edge.available ? 'Route cost ' + edge.cost.toFixed(2) : 'Covered'}</small>
                </button>)}
              </div>
              {phase === 'explore' && artifact && !hasChoice && (
                <div className="v4-artifact">
                  <span className="v4-meta">{artifact.label} / ORIGINAL STUDY SPECIMEN</span>
                  <h3>{artifact.name}</h3>
                  <p>{artifact.description}</p>
                  <button className="v4-inline" onClick={()=>setDetailOpen(!detailOpen)} aria-expanded={detailOpen}>{detailOpen ? 'Close specimen' : 'Inspect specimen'} ↗</button>
                  {detailOpen && <p className="v4-detail">{artifact.detail}</p>}
                  <div className="v4-choice-actions">
                    <button type="button" onClick={()=>{setJourney(s=>chooseArtifact(s,artifact.id,'KEEP'));setDetailOpen(false)}}>Keep this trace</button>
                    <button type="button" onClick={()=>{setJourney(s=>chooseArtifact(s,artifact.id,'PASS'));setDetailOpen(false)}}>Pass it by</button>
                  </div>
                </div>
              )}
              {phase === 'explore' && <p className="v4-note">Fragments decided: {choicesDone} / 2. Revisiting a place is allowed.</p>}
              {phase === 'return' && <p className="v4-note">Your destination has not moved. Every available passage is listed above.</p>}
            </>
          )}
          {phase === 'reflect' && (
            <form className="v4-reflection" onSubmit={e=>{e.preventDefault();setJourney(submitReflection)}}>
              {([
                ['changed','What, if anything, changed during your journey?'],
                ['cause','What do you think caused those changes?'],
                ['meaning','What information, if any, do you think the experience used?'],
                ['benefit','Did the change help you, hinder you, or both?'],
              ] as [string,string][]).map(([key,label])=><label key={key}>{label}<textarea value={answers[key] ?? ''} onChange={e=>setAnswers(v=>({...v,[key]:e.target.value}))} rows={2} placeholder="Your own words (optional)"/></label>)}
              <button type="submit" className="v4-primary">Continue to the record →</button>
              <p className="v4-note">Your answers stay in this browser tab unless you explicitly copy the session record.</p>
            </form>
          )}
          {phase === 'reveal' && (
            <div className="v4-reveal">
              <span className="v4-meta">HISTORICAL SNAPSHOTS / REAL SESSION STATE</span>
              <h3>Lift a layer.</h3>
              {activeReceipt && <>
                <label htmlFor="layers">Layer {journey.revealedIndex+1} of {journey.receipts.length}</label>
                <input id="layers" type="range" min="0" max={Math.max(0,journey.receipts.length-1)} step="1" value={journey.revealedIndex} onChange={e=>{setJourney(s=>setRevealIndex(s,Number(e.target.value)));setShowBefore(false)}}/>
                <div className="v4-compare" role="group" aria-label="Compare states">
                  <button className={showBefore ? 'active' : ''} onClick={()=>setShowBefore(true)}>Before</button>
                  <button className={!showBefore ? 'active' : ''} onClick={()=>setShowBefore(false)}>After</button>
                </div>
                <dl className="v4-receipt">
                  <div><dt>OBSERVED</dt><dd>{activeReceipt.signal} / {nodeLookup[activeReceipt.at].name}</dd></div>
                  <div><dt>RULE</dt><dd>{activeReceipt.ruleId}</dd></div>
                  <div><dt>CONSEQUENCE</dt><dd>{activeReceipt.consequence}</dd></div>
                  <div><dt>INTENTION</dt><dd>UNKNOWN</dd></div>
                </dl>
              </>}
              <p className="v4-note">The before and after maps use recorded state snapshots. No visual change is presented as evidence of what you meant.</p>
              <div className="v4-choice-actions"><button onClick={()=>setJourney(s=>decideEnding(s,'RESTORE'))}>Restore original routes</button><button onClick={()=>setJourney(s=>decideEnding(s,'KEEP'))}>Keep this terrain</button></div>
            </div>
          )}
          {phase === 'end' && <div className="v4-end">
            <span className="v4-meta">THE LAST DECISION IS PART OF THE RECORD</span>
            <h3>{journey.finalChoice === 'RESTORE' ? 'The old routes are back.' : 'This terrain remains.'}</h3>
            <p>Your choice changed the state again. That action is explicit. Your earlier reasons remain unknown.</p>
            <p className="v4-note">{routeChanged(journey) ? 'The graph still differs from the starting routes.' : 'The starting route costs and availability are restored.'}</p>
            <button className="v4-primary" onClick={handleCopy}>Copy local session evidence</button>
            <button className="v4-inline" onClick={reset}>Start a new journey ↗</button>
            {copyState && <p role="status">{copyState}</p>}
          </div>}
          {phase === 'seek' && <p className="v4-note">Your first route will be recorded for later comparison.</p>}
          {phase === 'entry' && <p className="v4-note">Use the passage controls to travel. All navigation is keyboard accessible.</p>}
        </section>
      </div>
      <footer className="v4-footer"><span>DAY 20 / MECHANISM EXPERIMENT — NOT A FINAL EXPERIENCE</span><button className="v4-inline" type="button" onClick={()=>setExpandedHelp(v=>!v)} aria-expanded={expandedHelp}>About this study {expandedHelp ? '−' : '+'}</button></footer>
      {expandedHelp && <p className="v4-about">This local test compares two visual representations of the same deterministic route mechanism. The archive content is original fiction, not a historical claim. Interactions are not submitted to a server. This surface uses SVG and does not require WebGL.</p>}
    </main>
  )
}
