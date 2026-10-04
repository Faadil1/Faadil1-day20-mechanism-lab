import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { WorldScene } from './WorldScene'
import {
  TERRITORIES,
  TERRITORY_BY_ID,
  applyObservation,
  completeDeepTimeReturn,
  createInitialWorld,
  enterWorld,
  getUniqueVisitCount,
  totalWorldTravel,
  type TerritoryId,
} from './world'

const transition = { duration: 0.7, ease: [0.22, 0.8, 0.24, 1] as [number, number, number, number] }

export default function App() {
  const reduceMotion = useReducedMotion() ?? false
  const [world, setWorld] = useState(createInitialWorld)
  const [selected, setSelected] = useState<TerritoryId | null>(null)
  const [revealIndex, setRevealIndex] = useState(0)
  const focusedAt = useRef<number | null>(null)
  const uniqueVisits = getUniqueVisitCount(world)
  const selectedTerritory = selected ? TERRITORY_BY_ID[selected] : null
  const activeMutation = world.stage === 'reveal' ? world.mutations[Math.min(revealIndex, Math.max(0, world.mutations.length - 1))] ?? null : null
  const worldTravel = useMemo(() => totalWorldTravel(world), [world])

  const enter = () => {
    setWorld((current) => enterWorld(current))
    setSelected(null)
    focusedAt.current = null
  }

  const selectTerritory = (id: TerritoryId) => {
    const now = performance.now()

    if (world.stage === 'return') {
      setSelected(id)
      if (id === 'deep-time') setWorld((current) => completeDeepTimeReturn(current, id))
      focusedAt.current = now
      return
    }

    if (world.stage === 'reveal' || world.stage === 'enter') {
      setSelected(id)
      return
    }

    setWorld((current) => {
      let next = current
      if (selected && selected !== id && focusedAt.current !== null) {
        const dwellMs = now - focusedAt.current
        if (dwellMs >= 4200) next = applyObservation(next, selected, 'DWELL', dwellMs)
      }
      const kind = next.visits[id] > 0 ? 'RETURN' : 'VISIT'
      return applyObservation(next, id, kind)
    })
    setSelected(id)
    focusedAt.current = now
  }

  const reset = () => {
    setWorld(createInitialWorld())
    setSelected(null)
    setRevealIndex(0)
    focusedAt.current = null
  }

  return (
    <main className="app-shell">
      <div className="world-canvas" aria-hidden={world.stage === 'enter'}>
        <WorldScene
          world={world}
          selected={selected}
          onSelect={selectTerritory}
          reducedMotion={reduceMotion}
          activeMutation={activeMutation}
        />
      </div>

      <header className="topline">
        <div>
          <span className="eyebrow">DAY 20 / LIVING ATLAS</span>
          <strong>Living Compendium</strong>
        </div>
        <button className="quiet-button" onClick={reset}>Reset</button>
      </header>

      <AnimatePresence mode="wait">
        {world.stage === 'enter' && (
          <motion.section
            className="hero-layer"
            key="enter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <div className="hero-copy">
              <span className="eyebrow">A LIVING INFORMATION WORLD</span>
              <h1>A world that rearranges itself.</h1>
              <p>Enter without a map. Follow whatever draws you in.</p>
              <button className="primary-button" onClick={enter}>Enter the compendium</button>
            </div>
          </motion.section>
        )}

        {world.stage === 'explore' && (
          <motion.section
            className="stage-copy"
            key="explore"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <span className="eyebrow">EXPLORE</span>
            <h2>Follow what draws you in.</h2>
            <p>{Math.min(uniqueVisits, 4)} / 4 territories crossed</p>
          </motion.section>
        )}

        {world.stage === 'return' && (
          <motion.section
            className="return-copy"
            key="return"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ...transition, duration: 1.2 }}
          >
            <span className="eyebrow">ONE LAST TASK</span>
            <h2>Find Deep Time again.</h2>
            <p>Use the world as it is now.</p>
          </motion.section>
        )}
      </AnimatePresence>

      {world.stage !== 'enter' && world.stage !== 'reveal' && (
        <aside className="detail-panel" aria-live="polite">
          {selectedTerritory ? (
            <>
              <span className="eyebrow">{selectedTerritory.name}</span>
              <p>{selectedTerritory.deck}</p>
            </>
          ) : (
            <>
              <span className="eyebrow">LANDMARKS</span>
              <p>Select a territory in the world or use the accessible landmark list.</p>
            </>
          )}
        </aside>
      )}

      {world.stage !== 'enter' && world.stage !== 'reveal' && (
        <nav className="landmark-list" aria-label="Knowledge territories">
          {TERRITORIES.map((territory) => (
            <button
              key={territory.id}
              className={selected === territory.id ? 'is-active' : ''}
              onClick={() => selectTerritory(territory.id)}
            >
              <span>{territory.name}</span>
              <small>{world.visits[territory.id] > 0 ? 'visited' : 'unvisited'}</small>
            </button>
          ))}
        </nav>
      )}

      {world.stage === 'reveal' && (
        <motion.aside
          className="reveal-panel"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transition, duration: reduceMotion ? 0.18 : 1.1 }}
        >
          <span className="eyebrow">YOUR PERSONAL WORLD / CAUSAL REPLAY</span>
          <h2>The world did not end where it started.</h2>
          <div className="world-stat-row">
            <div><strong>{world.mutations.length}</strong><span>model updates</span></div>
            <div><strong>{worldTravel.toFixed(1)}</strong><span>world-units moved</span></div>
          </div>

          {activeMutation && (
            <div className="causal-card" key={activeMutation.id}>
              <div><span>OBSERVED</span><strong>{world.observations.find((o) => o.id === activeMutation.observationId)?.kind} → {TERRITORY_BY_ID[activeMutation.sourceTerritoryId].name}</strong></div>
              <div><span>MODEL</span><strong>Local affinity updated</strong></div>
              <div><span>CONSEQUENCE</span><strong>{activeMutation.changes.length} territories moved</strong></div>
              <div className="unknown"><span>INTENTION</span><strong>UNKNOWN</strong></div>
            </div>
          )}

          <div className="replay-controls">
            <button
              className="quiet-button"
              disabled={revealIndex <= 0}
              onClick={() => setRevealIndex((value) => Math.max(0, value - 1))}
            >
              Previous cause
            </button>
            <span>{world.mutations.length ? `${revealIndex + 1} / ${world.mutations.length}` : '0 / 0'}</span>
            <button
              className="quiet-button"
              disabled={revealIndex >= world.mutations.length - 1}
              onClick={() => setRevealIndex((value) => Math.min(world.mutations.length - 1, value + 1))}
            >
              Next cause
            </button>
          </div>

          <blockquote>Which part of this world was yours?</blockquote>
          <p className="final-line">We observed what you did. We never knew what you meant.</p>
          <button className="primary-button inverse" onClick={reset}>Walk it again</button>
        </motion.aside>
      )}
    </main>
  )
}
