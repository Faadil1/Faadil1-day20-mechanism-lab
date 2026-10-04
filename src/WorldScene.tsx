import { Html, Line, MeshReflectorMaterial, RoundedBox, useCursor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Group } from 'three'
import {
  BASELINE_POSITIONS,
  EDGES,
  TERRITORIES,
  type Mutation,
  type Territory,
  type TerritoryId,
  type Vec3,
  type WorldState,
} from './world'

interface WorldSceneProps {
  world: WorldState
  selected: TerritoryId | null
  onSelect: (id: TerritoryId) => void
  reducedMotion: boolean
  activeMutation: Mutation | null
}

const vermilion = '#d24f35'
const BASE_SCALE = 1.55
const MUTATION_GAIN = 5.2

const palettes: Record<TerritoryId, { stone: string; face: string; accent: string; emissive: string }> = {
  ideas: { stone: '#d7ccb2', face: '#efe7d5', accent: '#b7653e', emissive: '#3c2114' },
  concepts: { stone: '#9aa4a3', face: '#d8dfdc', accent: '#9b7a42', emissive: '#232927' },
  'deep-time': { stone: '#373a42', face: '#c8c2b7', accent: '#c75a3c', emissive: '#2a0e09' },
  stories: { stone: '#9b6553', face: '#e5cfc3', accent: '#d4a05c', emissive: '#311813' },
  artifacts: { stone: '#776d5c', face: '#d7ceb9', accent: '#a78b5d', emissive: '#241f17' },
  people: { stone: '#7c8697', face: '#d8dde6', accent: '#c28b69', emissive: '#1d2430' },
  places: { stone: '#7f8b73', face: '#dde0ce', accent: '#ad7b4a', emissive: '#20261b' },
  systems: { stone: '#565861', face: '#d4d5d9', accent: '#b79b62', emissive: '#1b1c22' },
}

function displayPosition(id: TerritoryId, current: Vec3): Vec3 {
  const base = BASELINE_POSITIONS[id]
  return [
    base[0] * BASE_SCALE + (current[0] - base[0]) * MUTATION_GAIN,
    0.18 + current[1] * 1.3,
    base[2] * BASE_SCALE + (current[2] - base[2]) * MUTATION_GAIN,
  ]
}

function displayBaseline(id: TerritoryId): Vec3 {
  const base = BASELINE_POSITIONS[id]
  return [base[0] * BASE_SCALE, 0.18 + base[1] * 1.3, base[2] * BASE_SCALE]
}

function createTerritoryTexture(territory: Territory) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 768
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const palette = palettes[territory.id]
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height)
  g.addColorStop(0, palette.face)
  g.addColorStop(1, '#bdb29e')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = 'rgba(43,36,28,.3)'
  ctx.lineWidth = 2
  ctx.strokeRect(22, 22, canvas.width - 44, canvas.height - 44)

  ctx.fillStyle = '#27231d'
  ctx.font = '600 39px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText(territory.name.toUpperCase(), 256, 88)

  ctx.fillStyle = 'rgba(255,255,255,.12)'
  ctx.fillRect(52, 128, 408, 520)

  ctx.strokeStyle = palette.accent
  ctx.fillStyle = palette.accent
  ctx.lineWidth = 4

  if (territory.id === 'deep-time') {
    ctx.beginPath()
    ctx.moveTo(84, 606)
    ctx.lineTo(174, 320)
    ctx.lineTo(248, 472)
    ctx.lineTo(328, 246)
    ctx.lineTo(428, 606)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(336, 204, 34, 0, Math.PI * 2)
    ctx.stroke()
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath()
      ctx.arc(336, 204, 48 + i * 22, Math.PI * .12, Math.PI * 1.18)
      ctx.stroke()
    }
  } else if (territory.id === 'ideas') {
    for (let i = 0; i < 8; i += 1) {
      ctx.beginPath()
      ctx.arc(260, 410, 34 + i * 26, Math.PI * .1, Math.PI * 1.35)
      ctx.stroke()
    }
  } else if (territory.id === 'concepts') {
    const pts = [[132,270],[340,225],[256,405],[156,545],[370,550],[390,360]]
    pts.forEach(([x,y], i) => {
      ctx.beginPath(); ctx.arc(x, y, 16 + (i % 3) * 5, 0, Math.PI * 2); ctx.fill()
    })
    ;[[0,2],[1,2],[2,3],[2,4],[1,5],[5,4]].forEach(([a,b]) => {
      ctx.beginPath(); ctx.moveTo(pts[a][0],pts[a][1]); ctx.lineTo(pts[b][0],pts[b][1]); ctx.stroke()
    })
  } else if (territory.id === 'people') {
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath()
      ctx.arc(170 + i * 58, 330 + (i % 2) * 80, 30, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.beginPath(); ctx.moveTo(98, 602); ctx.quadraticCurveTo(256, 390, 414, 602); ctx.stroke()
  } else if (territory.id === 'places') {
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath()
      ctx.moveTo(64, 608 - i * 62)
      ctx.bezierCurveTo(150, 470 - i * 20, 360, 590 - i * 46, 452, 410 - i * 18)
      ctx.stroke()
    }
  } else if (territory.id === 'systems') {
    for (let i = 0; i < 5; i += 1) {
      ctx.strokeRect(102 + i * 31, 218 + i * 44, 308 - i * 62, 350 - i * 68)
    }
  } else if (territory.id === 'stories') {
    ctx.beginPath(); ctx.moveTo(104, 230); ctx.bezierCurveTo(420, 210, 110, 420, 410, 570); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(100, 300); ctx.bezierCurveTo(370, 350, 160, 505, 390, 638); ctx.stroke()
  } else {
    for (let i = 0; i < 7; i += 1) {
      const x = 92 + (i % 3) * 130
      const y = 238 + Math.floor(i / 3) * 170
      ctx.fillRect(x, y, 54 + (i % 2) * 18, 118 - (i % 3) * 15)
    }
  }

  ctx.fillStyle = '#423a31'
  ctx.font = 'italic 22px Georgia'
  ctx.fillText(territory.deck.split('.')[0], 256, 704)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function CentralThreshold() {
  return (
    <group position={[0, 0.02, 1.5]}>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} scale={1 + i * 0.18} position={[0, 0, i * 0.1]}>
          <RoundedBox args={[0.32, 3.25, 0.46]} radius={0.08} smoothness={5} position={[-1.55, 1.58, 0]}>
            <meshStandardMaterial color={i === 0 ? '#d7ccb2' : '#625745'} roughness={0.68} metalness={0.12} />
          </RoundedBox>
          <RoundedBox args={[0.32, 3.25, 0.46]} radius={0.08} smoothness={5} position={[1.55, 1.58, 0]}>
            <meshStandardMaterial color={i === 0 ? '#d7ccb2' : '#625745'} roughness={0.68} metalness={0.12} />
          </RoundedBox>
          <mesh position={[0, 3.08, 0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[1.55, 0.16, 16, 96, Math.PI]} />
            <meshStandardMaterial
              color={i === 0 ? '#d7ccb2' : '#625745'}
              emissive={i === 0 ? '#5a4526' : '#17130e'}
              emissiveIntensity={0.5}
              roughness={0.62}
              metalness={0.14}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.65, 96]} />
        <meshStandardMaterial color="#3c352c" roughness={0.94} metalness={0.04} />
      </mesh>
      <pointLight position={[0, 3.6, -0.4]} color="#f2d59a" intensity={3.4} distance={8} />
    </group>
  )
}

function IdeasArchive({ active }: { active: boolean }) {
  const p = palettes.ideas
  return (
    <group>
      {[-0.55, 0, 0.55].map((x, i) => (
        <group key={x} position={[x, 0.48 + i * .08, -0.58]}>
          <RoundedBox args={[0.26, 1.5 + i * .15, 0.24]} radius={0.07} smoothness={4}>
            <meshStandardMaterial color={p.stone} roughness={0.72} />
          </RoundedBox>
          <mesh position={[0, 0.84 + i * .08, 0]}>
            <torusGeometry args={[0.3 + i * .06, 0.045, 10, 48]} />
            <meshStandardMaterial color={active ? vermilion : p.accent} emissive={p.emissive} emissiveIntensity={active ? 1.4 : .25} metalness={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function ConceptsObservatory({ active }: { active: boolean }) {
  const p = palettes.concepts
  return (
    <group position={[0, 0.9, -0.62]}>
      <mesh rotation={[0.3, 0.15, 0.04]}>
        <torusGeometry args={[0.64, 0.07, 14, 72]} />
        <meshStandardMaterial color={active ? vermilion : p.accent} metalness={0.34} roughness={0.38} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.2, 0.4]}>
        <torusGeometry args={[0.46, 0.05, 12, 64]} />
        <meshStandardMaterial color={p.stone} metalness={0.24} roughness={0.52} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color={p.face} emissive={active ? vermilion : p.emissive} emissiveIntensity={active ? 1.1 : .2} />
      </mesh>
    </group>
  )
}

function DeepTimeSpire({ active }: { active: boolean }) {
  const p = palettes['deep-time']
  return (
    <group position={[0, 0.1, -0.55]}>
      <mesh position={[0, 1.05, 0]}>
        <coneGeometry args={[0.48, 2.25, 5]} />
        <meshStandardMaterial color={p.stone} roughness={0.58} metalness={0.2} emissive={active ? vermilion : '#090909'} emissiveIntensity={active ? .85 : .05} />
      </mesh>
      {[0.55, 1.0, 1.45].map((y, i) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI/2, i*.25, 0]}>
          <torusGeometry args={[0.44 + i*.08, 0.035, 10, 48]} />
          <meshStandardMaterial color={active ? '#ff8060' : p.accent} emissive={active ? vermilion : p.emissive} emissiveIntensity={active ? 1.6 : .25} />
        </mesh>
      ))}
      <mesh position={[0, 2.28, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#f0d8aa" emissive="#c9603f" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

function StoriesAmphitheatre({ active }: { active: boolean }) {
  const p = palettes.stories
  return (
    <group position={[0, 0.2, -0.62]}>
      {[0,1,2,3].map((i) => (
        <mesh key={i} position={[0, .28 + i*.12, -.06*i]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[.35 + i*.15, .47 + i*.15, 48, 1, Math.PI*.1, Math.PI*.8]} />
          <meshStandardMaterial color={i===3 ? p.accent : p.stone} emissive={active && i===3 ? vermilion : '#000'} emissiveIntensity={active ? .8 : 0} roughness={.68} />
        </mesh>
      ))}
      <mesh position={[0,.95,-.12]} rotation={[0,0,.08]}>
        <boxGeometry args={[.7,1.05,.08]} />
        <meshStandardMaterial color={p.face} roughness={.86} />
      </mesh>
    </group>
  )
}

function ArtifactReliquary({ active }: { active: boolean }) {
  const p = palettes.artifacts
  return (
    <group position={[0, .2, -.62]}>
      {[-.38,0,.38].map((x,i)=>(
        <mesh key={x} position={[x,.7 + (i===1?.18:0),0]} rotation={[0,(i-1)*.08,0]}>
          <boxGeometry args={[.28,1.38 + (i===1?.32:0),.26]} />
          <meshStandardMaterial color={i===1 ? p.face : p.stone} roughness={.72} metalness={.08} emissive={active && i===1 ? vermilion : '#000'} emissiveIntensity={active ? .65 : 0}/>
        </mesh>
      ))}
      <mesh position={[0,.72,.22]}>
        <octahedronGeometry args={[.22,0]} />
        <meshStandardMaterial color={active ? vermilion : p.accent} metalness={.36} roughness={.35}/>
      </mesh>
    </group>
  )
}

function PeopleForum({ active }: { active: boolean }) {
  const p = palettes.people
  return (
    <group position={[0,.1,-.62]}>
      {[0,1,2,3,4].map((i)=>{
        const a=(i/5)*Math.PI*2
        return (
          <group key={i} position={[Math.cos(a)*.55,.55,Math.sin(a)*.28]}>
            <mesh><sphereGeometry args={[.12,16,16]}/><meshStandardMaterial color={p.face}/></mesh>
            <mesh position={[0,-.26,0]}><capsuleGeometry args={[.08,.32,4,8]}/><meshStandardMaterial color={p.stone}/></mesh>
          </group>
        )
      })}
      <mesh position={[0,.78,0]}><sphereGeometry args={[.28,24,24]}/><meshStandardMaterial color={active ? vermilion : p.accent} emissive={active ? vermilion : p.emissive} emissiveIntensity={active ? 1.1 : .2}/></mesh>
      <mesh position={[0,.78,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.5,.035,10,48]}/><meshStandardMaterial color={p.accent}/></mesh>
    </group>
  )
}

function PlacesTerraces({ active }: { active: boolean }) {
  const p = palettes.places
  return (
    <group position={[0,.05,-.62]}>
      {[0,1,2,3].map((i)=>(
        <mesh key={i} position={[0,.18+i*.18,0]} rotation={[-Math.PI/2,0,i*.18]}>
          <ringGeometry args={[.3+i*.16,.47+i*.16,56]} />
          <meshStandardMaterial color={i===3 ? p.accent : p.stone} emissive={active && i===3 ? vermilion : '#000'} emissiveIntensity={active ? .65 : 0} roughness={.72}/>
        </mesh>
      ))}
      <mesh position={[.18,1.0,0]}><coneGeometry args={[.18,1.15,4]}/><meshStandardMaterial color={p.face}/></mesh>
    </group>
  )
}

function SystemsMechanism({ active }: { active: boolean }) {
  const p = palettes.systems
  return (
    <group position={[0,.2,-.62]}>
      {[0,1,2].map((i)=>(
        <mesh key={i} position={[0,.72,0]} rotation={[i*.4,i*.7,i*.25]}>
          <torusGeometry args={[.34+i*.16,.055,10,56]}/>
          <meshStandardMaterial color={i===0 && active ? vermilion : i===0 ? p.accent : p.stone} metalness={.34} roughness={.42}/>
        </mesh>
      ))}
      <mesh position={[0,.72,0]}><boxGeometry args={[.28,.28,.28]}/><meshStandardMaterial color={p.face} emissive={active ? vermilion : p.emissive} emissiveIntensity={active ? .9 : .2}/></mesh>
    </group>
  )
}

function TerritoryArchitecture({ territory, active }: { territory: Territory; active: boolean }) {
  switch (territory.id) {
    case 'ideas': return <IdeasArchive active={active} />
    case 'concepts': return <ConceptsObservatory active={active} />
    case 'deep-time': return <DeepTimeSpire active={active} />
    case 'stories': return <StoriesAmphitheatre active={active} />
    case 'artifacts': return <ArtifactReliquary active={active} />
    case 'people': return <PeopleForum active={active} />
    case 'places': return <PlacesTerraces active={active} />
    case 'systems': return <SystemsMechanism active={active} />
  }
}

function TerritoryMonument({
  territory,
  target,
  selected,
  visited,
  active,
  reducedMotion,
  onSelect,
}: {
  territory: Territory
  target: Vec3
  selected: boolean
  visited: boolean
  active: boolean
  reducedMotion: boolean
  onSelect: (id: TerritoryId) => void
}) {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const targetVector = useMemo(() => new THREE.Vector3(), [])
  const texture = useMemo(() => createTerritoryTexture(territory), [territory])
  const baseline = displayBaseline(territory.id)
  const renderTarget = displayPosition(territory.id, target)
  const rotationY = Math.atan2(-baseline[0], -baseline[2])
  const palette = palettes[territory.id]
  useCursor(hovered)

  useFrame(() => {
    if (!group.current) return
    targetVector.set(renderTarget[0], renderTarget[1], renderTarget[2])
    if (reducedMotion) group.current.position.copy(targetVector)
    else group.current.position.lerp(targetVector, 0.065)
  })

  return (
    <group
      ref={group}
      position={renderTarget}
      rotation={[0, rotationY, 0]}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => { event.stopPropagation(); onSelect(territory.id) }}
      scale={selected ? 1.06 : 1}
    >
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.15, 1.45, 0.18, 72]} />
        <meshStandardMaterial color={visited ? '#655c4d' : '#3c372f'} roughness={0.86} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.94, 1.08, 0.14, 72]} />
        <meshStandardMaterial color={palette.stone} roughness={0.74} metalness={0.08} />
      </mesh>

      <RoundedBox args={[1.6, 2.15, 0.14]} radius={0.06} smoothness={5} position={[0, 1.32, 0]}>
        <meshStandardMaterial color={palette.stone} emissive={active ? vermilion : palette.emissive} emissiveIntensity={active ? .55 : .08} roughness={0.68} metalness={0.12} />
      </RoundedBox>

      {texture && (
        <mesh position={[0, 1.32, 0.078]}>
          <planeGeometry args={[1.32, 1.82]} />
          <meshStandardMaterial map={texture} roughness={0.9} metalness={0.01} />
        </mesh>
      )}

      <TerritoryArchitecture territory={territory} active={active} />

      <pointLight position={[0, 1.45, 0.85]} color={active ? '#ff7658' : palette.accent} intensity={active || selected ? 3.6 : visited ? 1.25 : .45} distance={4.6} />

      <Html center position={[0, 2.62, 0]} distanceFactor={8.6} style={{ pointerEvents: 'none' }}>
        <div className={`world-label ${selected ? 'is-selected' : ''}`}>
          <span>{territory.name}</span>
          {selected && <small>enter territory</small>}
        </div>
      </Html>
    </group>
  )
}

function Bridge({ from, to, active }: { from: Vec3; to: Vec3; active: boolean }) {
  const curve = useMemo(() => {
    const a = new THREE.Vector3(from[0], 0.4, from[2])
    const b = new THREE.Vector3(to[0], 0.4, to[2])
    const distance = a.distanceTo(b)
    const mid = new THREE.Vector3((from[0] + to[0]) / 2, 0.4 + Math.min(1.1, distance * .055), (from[2] + to[2]) / 2)
    return new THREE.CatmullRomCurve3([a, mid, b])
  }, [from, to])

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.095, 8, false]} />
        <meshStandardMaterial color="#312d28" roughness={0.72} metalness={0.14} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.019, 8, false]} />
        <meshStandardMaterial color={active ? '#ff7a5c' : '#b99b63'} emissive={active ? vermilion : '#3e301c'} emissiveIntensity={active ? 2.5 : .55} roughness={0.36} metalness={0.25} />
      </mesh>
    </group>
  )
}

function AtlasHorizon() {
  const towers = useMemo(() => Array.from({ length: 46 }, (_, i) => {
    const angle = (i / 46) * Math.PI * 2
    const radius = 14.5 + ((i * 11) % 7) * .72
    const h = 1.4 + ((i * 17) % 9) * .52
    return { x: Math.cos(angle)*radius, z: Math.sin(angle)*radius, h, w: .28 + ((i*5)%5)*.11, angle }
  }), [])

  return (
    <group>
      {towers.map((t, i) => (
        <group key={i} position={[t.x, t.h/2-.04, t.z]} rotation={[0, -t.angle + Math.PI/2, 0]}>
          <mesh>
            <boxGeometry args={[t.w,t.h,.26]} />
            <meshStandardMaterial color={i%5===0 ? '#726858' : i%3===0 ? '#454b55' : '#24262c'} roughness={.86} metalness={.04} />
          </mesh>
          {i%4===0 && <mesh position={[0,t.h*.12,.145]}><planeGeometry args={[t.w*.55,t.h*.45]}/><meshBasicMaterial color="#c7ae7a" transparent opacity={.16}/></mesh>}
        </group>
      ))}
    </group>
  )
}

function ForegroundRuins() {
  return (
    <group>
      <group position={[-7.8,0,7.2]} rotation={[0,.42,0]}>
        <RoundedBox args={[.38,4.8,.7]} radius={.08} smoothness={4} position={[-1.5,2.4,0]}><meshStandardMaterial color="#302b24" roughness={.9}/></RoundedBox>
        <RoundedBox args={[.38,4.1,.7]} radius={.08} smoothness={4} position={[1.5,2.05,0]}><meshStandardMaterial color="#302b24" roughness={.9}/></RoundedBox>
        <mesh position={[0,4.25,0]} rotation={[0,0,Math.PI]}><torusGeometry args={[1.5,.18,12,64,Math.PI]}/><meshStandardMaterial color="#302b24" roughness={.9}/></mesh>
      </group>
      <group position={[8.5,0,5.8]} rotation={[0,-.5,0]}>
        {[0,1,2].map(i=><mesh key={i} position={[i*.52,1.1+i*.42,0]}><boxGeometry args={[.34,2.2+i*.84,.4]}/><meshStandardMaterial color="#292a2f" roughness={.9}/></mesh>)}
      </group>
    </group>
  )
}

function GhostBaseline() {
  return (
    <group>
      {TERRITORIES.map((territory) => {
        const p = displayBaseline(territory.id)
        return (
          <group key={`ghost-${territory.id}`} position={p}>
            <mesh position={[0,0.1,0]} rotation={[-Math.PI/2,0,0]}>
              <ringGeometry args={[.88,.96,56]} />
              <meshBasicMaterial color="#d3c6aa" transparent opacity={.24} side={THREE.DoubleSide}/>
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function CameraRig({ selected, world, reducedMotion }: { selected: TerritoryId | null; world: WorldState; reducedMotion: boolean }) {
  const look = useMemo(() => new THREE.Vector3(0,1.2,-1.2), [])
  const desired = useMemo(() => new THREE.Vector3(0,3.2,14.6), [])
  const currentLook = useMemo(() => new THREE.Vector3(0,1.2,-1.2), [])

  useFrame(({ camera }) => {
    const p = selected ? displayPosition(selected, world.positions[selected]) : ([0,0,0] as Vec3)

    if (world.stage === 'reveal') {
      desired.set(.4,6.2,16.8)
      look.set(0,1.0,-1.8)
    } else if (world.stage === 'return') {
      desired.set(0,3.05,14.1)
      look.set(0,1.1,-2.8)
    } else if (selected) {
      desired.set(p[0]*.34, 3.0 + p[1]*.12, 13.0 + p[2]*.11)
      look.set(p[0]*.7, 1.25, p[2]*.7)
    } else {
      desired.set(0,3.2,14.6)
      look.set(0,1.2,-1.2)
    }

    if (reducedMotion) {
      camera.position.copy(desired)
      currentLook.copy(look)
    } else {
      camera.position.lerp(desired,.026)
      currentLook.lerp(look,.038)
    }
    camera.lookAt(currentLook)
  })
  return null
}

function Scene({ world, selected, onSelect, reducedMotion, activeMutation }: WorldSceneProps) {
  const activeIds = new Set(activeMutation?.changes.map(change => change.territoryId) ?? [])
  const activeSource = activeMutation?.sourceTerritoryId ?? null

  return (
    <>
      <color attach="background" args={['#080a0f']} />
      <fog attach="fog" args={['#080a0f', 11, 32]} />

      <ambientLight intensity={.34} color="#d8d3c7"/>
      <hemisphereLight intensity={.68} color="#8795aa" groundColor="#180f0a"/>
      <directionalLight position={[6,10,8]} intensity={3.0} color="#f2d9b1" castShadow/>
      <directionalLight position={[-10,5,-5]} intensity={1.15} color="#64748c"/>

      <CameraRig selected={selected} world={world} reducedMotion={reducedMotion}/>

      <mesh position={[0,-.08,0]} rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[40,40]}/>
        <MeshReflectorMaterial blur={[520,160]} resolution={512} mixBlur={.82} mixStrength={.48} roughness={.94} metalness={.04} color="#141414" mirror={.12} depthScale={.18} minDepthThreshold={.5} maxDepthThreshold={1.4}/>
      </mesh>

      {[3.1,7.7,12.6].map((r,i)=>(
        <mesh key={r} position={[0,.006+i*.001,0]} rotation={[-Math.PI/2,0,0]}>
          <ringGeometry args={[r,r+.035,160]}/>
          <meshBasicMaterial color={i===0 ? '#917c58' : '#504a40'} transparent opacity={i===0 ? .34 : .19} side={THREE.DoubleSide}/>
        </mesh>
      ))}

      <AtlasHorizon/>
      <ForegroundRuins/>
      <CentralThreshold/>

      {EDGES.map(([a,b])=>{
        const from = displayPosition(a, world.positions[a])
        const to = displayPosition(b, world.positions[b])
        const isActive = activeSource===a || activeSource===b || activeIds.has(a) || activeIds.has(b)
        return <Bridge key={`${a}-${b}`} from={from} to={to} active={isActive}/>
      })}

      {world.stage==='reveal' && <GhostBaseline/>}

      {world.stage==='reveal' && TERRITORIES.map(territory=>{
        const from=displayBaseline(territory.id)
        const to=displayPosition(territory.id, world.positions[territory.id])
        return <Line key={`vector-${territory.id}`} points={[[from[0],.5,from[2]],[to[0],.5,to[2]]]} color={vermilion} transparent opacity={.75} lineWidth={1.2} dashed dashScale={2}/>
      })}

      {TERRITORIES.map(territory=>(
        <TerritoryMonument
          key={territory.id}
          territory={territory}
          target={world.positions[territory.id]}
          selected={selected===territory.id}
          visited={world.visits[territory.id]>0}
          active={activeIds.has(territory.id) || activeSource===territory.id}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
        />
      ))}

      <pointLight position={[0,7,-9]} color="#aebfe0" intensity={1.8} distance={20}/>
    </>
  )
}

export function WorldScene(props: WorldSceneProps) {
  return (
    <Canvas
      camera={{ position:[0,3.2,14.6], fov:35, near:.1, far:100 }}
      dpr={[1,1.55]}
      gl={{ antialias:true, powerPreference:'high-performance' }}
      shadows
    >
      <Scene {...props}/>
    </Canvas>
  )
}
