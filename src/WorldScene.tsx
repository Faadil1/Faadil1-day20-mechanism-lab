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

const ivory = '#e6dcc4'
const warmStone = '#b7a273'
const darkStone = '#18130d'
const brass = '#b79b62'
const vermilion = '#d24f35'

function createTerritoryTexture(territory: Territory) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 768
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const g = ctx.createLinearGradient(0, 0, 0, canvas.height)
  g.addColorStop(0, '#f2ead7')
  g.addColorStop(1, '#cfc09f')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = 'rgba(88,72,46,.42)'
  ctx.lineWidth = 2
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48)

  ctx.fillStyle = '#2c2419'
  ctx.font = '600 42px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText(territory.name.toUpperCase(), 256, 90)

  ctx.fillStyle = 'rgba(120,79,43,.18)'
  ctx.fillRect(54, 128, 404, 520)

  ctx.strokeStyle = '#8a724c'
  ctx.fillStyle = '#8a724c'
  ctx.lineWidth = 4

  if (territory.id === 'deep-time') {
    ctx.beginPath()
    ctx.moveTo(95, 610)
    ctx.lineTo(180, 320)
    ctx.lineTo(245, 470)
    ctx.lineTo(320, 260)
    ctx.lineTo(420, 610)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(330, 210, 28, 0, Math.PI * 2)
    ctx.stroke()
  } else if (territory.id === 'ideas') {
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath()
      ctx.arc(256, 390, 48 + i * 30, Math.PI * 0.12, Math.PI * 1.16)
      ctx.stroke()
    }
  } else if (territory.id === 'concepts') {
    const pts = [[150,260],[340,240],[255,405],[150,540],[355,555]]
    pts.forEach(([x,y], i) => {
      ctx.beginPath(); ctx.arc(x, y, 18 + (i % 2) * 7, 0, Math.PI * 2); ctx.fill()
    })
    for (let i = 0; i < pts.length - 1; i += 1) {
      ctx.beginPath(); ctx.moveTo(pts[i][0],pts[i][1]); ctx.lineTo(pts[i+1][0],pts[i+1][1]); ctx.stroke()
    }
  } else if (territory.id === 'people') {
    ctx.beginPath(); ctx.arc(256, 300, 72, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(126, 590); ctx.quadraticCurveTo(256, 370, 386, 590); ctx.stroke()
  } else if (territory.id === 'places') {
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath()
      ctx.moveTo(70, 580 - i * 58)
      ctx.bezierCurveTo(170, 450 - i * 25, 330, 580 - i * 38, 450, 410 - i * 18)
      ctx.stroke()
    }
  } else if (territory.id === 'systems') {
    for (let i = 0; i < 4; i += 1) {
      ctx.strokeRect(115 + i * 36, 230 + i * 48, 282 - i * 72, 320 - i * 64)
    }
  } else if (territory.id === 'stories') {
    ctx.beginPath(); ctx.moveTo(115, 240); ctx.bezierCurveTo(400, 220, 120, 455, 400, 560); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(115, 300); ctx.bezierCurveTo(360, 345, 160, 480, 385, 630); ctx.stroke()
  } else {
    for (let i = 0; i < 6; i += 1) {
      const x = 110 + (i % 3) * 120
      const y = 250 + Math.floor(i / 3) * 220
      ctx.fillRect(x, y, 58, 130 - (i % 2) * 25)
    }
  }

  ctx.fillStyle = '#3c3325'
  ctx.font = 'italic 24px Georgia'
  ctx.fillText(territory.deck.split('.')[0], 256, 700)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function Portal() {
  return (
    <group position={[0, 0.04, 0.45]}>
      {[0, 1, 2].map((i) => (
        <group key={i} scale={1 + i * 0.18} position={[0, 0, 0.08 * i]}>
          <RoundedBox args={[0.34, 2.65, 0.42]} radius={0.1} smoothness={5} position={[-1.22, 1.3, 0]}>
            <meshStandardMaterial color={i === 0 ? '#d4c49e' : '#786847'} roughness={0.62} metalness={0.14} />
          </RoundedBox>
          <RoundedBox args={[0.34, 2.65, 0.42]} radius={0.1} smoothness={5} position={[1.22, 1.3, 0]}>
            <meshStandardMaterial color={i === 0 ? '#d4c49e' : '#786847'} roughness={0.62} metalness={0.14} />
          </RoundedBox>
          <mesh position={[0, 2.58, 0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[1.22, 0.17, 16, 80, Math.PI]} />
            <meshStandardMaterial
              color={i === 0 ? '#d4c49e' : '#786847'}
              emissive={i === 0 ? '#5a4729' : '#18120a'}
              emissiveIntensity={0.55}
              roughness={0.58}
              metalness={0.18}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.0, 96]} />
        <meshStandardMaterial color="#4b412f" roughness={0.82} metalness={0.08} />
      </mesh>
      <pointLight position={[0, 2.6, 0]} color="#f5d995" intensity={3.2} distance={6} />
    </group>
  )
}

function Sculpture({ territory, active }: { territory: Territory; active: boolean }) {
  const materialColor = active ? vermilion : brass
  const material = <meshStandardMaterial color={materialColor} roughness={0.52} metalness={0.22} />

  if (territory.shape === 'orb') {
    return (
      <group position={[0, 0.75, -0.52]}>
        <mesh><sphereGeometry args={[0.34, 32, 32]} />{material}</mesh>
        <mesh scale={1.55}><torusGeometry args={[0.42, 0.035, 10, 64]} />{material}</mesh>
      </group>
    )
  }

  if (territory.shape === 'ring') {
    return (
      <group position={[0, 0.92, -0.54]} rotation={[0.3, 0.1, 0.1]}>
        <mesh><torusGeometry args={[0.42, 0.065, 14, 64]} />{material}</mesh>
        <mesh rotation={[Math.PI / 2, 0.35, 0]}><torusGeometry args={[0.3, 0.045, 12, 48]} />{material}</mesh>
      </group>
    )
  }

  if (territory.shape === 'spire') {
    return (
      <group position={[0, 0.74, -0.52]}>
        <mesh><coneGeometry args={[0.3, 1.5, 5]} />{material}</mesh>
        <mesh position={[0, 0.82, 0]}><sphereGeometry args={[0.08, 16, 16]} />{material}</mesh>
      </group>
    )
  }

  if (territory.shape === 'book') {
    return (
      <group position={[0, 0.8, -0.52]}>
        <mesh position={[-0.12, 0, 0]} rotation={[0, 0.18, 0.1]}><boxGeometry args={[0.34, 0.72, 0.08]} />{material}</mesh>
        <mesh position={[0.12, 0, 0]} rotation={[0, -0.18, -0.1]}><boxGeometry args={[0.34, 0.72, 0.08]} />{material}</mesh>
      </group>
    )
  }

  if (territory.shape === 'arch') {
    return (
      <group position={[0, 0.5, -0.52]} scale={0.56}>
        <mesh position={[-0.55, 0.58, 0]}><boxGeometry args={[0.18, 1.18, 0.18]} />{material}</mesh>
        <mesh position={[0.55, 0.58, 0]}><boxGeometry args={[0.18, 1.18, 0.18]} />{material}</mesh>
        <mesh position={[0, 1.14, 0]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.55, 0.09, 10, 40, Math.PI]} />{material}</mesh>
      </group>
    )
  }

  return (
    <group position={[0, 0.78, -0.52]}>
      <mesh rotation={[0.04, 0.28, -0.03]}><boxGeometry args={[0.4, 1.0, 0.28]} />{material}</mesh>
      <mesh position={[0.16, 0.26, 0.18]} rotation={[0.04, -0.14, 0.07]}><boxGeometry args={[0.28, 0.74, 0.18]} />{material}</mesh>
    </group>
  )
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
  const baseline = BASELINE_POSITIONS[territory.id]
  const rotationY = Math.atan2(-baseline[0], -baseline[2])
  useCursor(hovered)

  useFrame(() => {
    if (!group.current) return
    targetVector.set(target[0], target[1], target[2])
    if (reducedMotion) group.current.position.copy(targetVector)
    else group.current.position.lerp(targetVector, 0.075)
  })

  return (
    <group
      ref={group}
      position={target}
      rotation={[0, rotationY, 0]}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(territory.id)
      }}
      scale={selected ? 1.055 : 1}
    >
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.9, 1.18, 0.16, 64]} />
        <meshStandardMaterial color={visited ? '#7b6845' : '#554832'} roughness={0.78} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.7, 0.82, 0.12, 64]} />
        <meshStandardMaterial color="#9c875a" roughness={0.7} metalness={0.1} />
      </mesh>

      <RoundedBox args={[1.46, 1.98, 0.13]} radius={0.08} smoothness={5} position={[0, 1.18, 0]}>
        <meshStandardMaterial
          color={selected ? '#d7c59b' : '#8f7c57'}
          emissive={active ? vermilion : '#17110a'}
          emissiveIntensity={active ? 0.9 : 0.12}
          roughness={0.62}
          metalness={0.18}
        />
      </RoundedBox>

      {texture && (
        <mesh position={[0, 1.18, 0.075]}>
          <planeGeometry args={[1.22, 1.7]} />
          <meshStandardMaterial map={texture} roughness={0.88} metalness={0.02} />
        </mesh>
      )}

      <Sculpture territory={territory} active={active} />

      <pointLight
        position={[0, 1.35, 0.55]}
        color={active ? vermilion : '#f0d7a0'}
        intensity={active || selected ? 3.2 : visited ? 1.2 : 0.5}
        distance={3.8}
      />

      <Html center position={[0, 2.38, 0]} distanceFactor={8.2} style={{ pointerEvents: 'none' }}>
        <div className={`world-label ${selected ? 'is-selected' : ''}`}>
          <span>{territory.name}</span>
          {selected && <small>open territory</small>}
        </div>
      </Html>
    </group>
  )
}

function Bridge({ from, to, active }: { from: Vec3; to: Vec3; active: boolean }) {
  const curve = useMemo(() => {
    const a = new THREE.Vector3(from[0], 0.34, from[2])
    const b = new THREE.Vector3(to[0], 0.34, to[2])
    const mid = new THREE.Vector3((from[0] + to[0]) / 2, 0.46, (from[2] + to[2]) / 2)
    return new THREE.CatmullRomCurve3([a, mid, b])
  }, [from, to])

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 36, 0.07, 8, false]} />
        <meshStandardMaterial color="#55472f" roughness={0.55} metalness={0.32} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 36, 0.018, 8, false]} />
        <meshStandardMaterial
          color={active ? '#ff8a68' : '#d8b971'}
          emissive={active ? vermilion : '#5e4524'}
          emissiveIntensity={active ? 2.3 : 0.72}
          roughness={0.35}
          metalness={0.34}
        />
      </mesh>
    </group>
  )
}

function DistantAtlas() {
  const towers = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2
      const radius = 10.2 + ((i * 7) % 5) * 0.42
      const h = 1.8 + ((i * 13) % 7) * 0.5
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        h,
        w: 0.34 + ((i * 5) % 4) * 0.12,
        r: -angle + Math.PI / 2,
      }
    })
  }, [])

  return (
    <group>
      {towers.map((tower, i) => (
        <group key={i} position={[tower.x, tower.h / 2 - 0.05, tower.z]} rotation={[0, tower.r, 0]}>
          <mesh>
            <boxGeometry args={[tower.w, tower.h, 0.26]} />
            <meshStandardMaterial color={i % 4 === 0 ? '#665a45' : '#30291f'} roughness={0.82} metalness={0.08} />
          </mesh>
          {i % 3 === 0 && (
            <mesh position={[0, tower.h * 0.15, 0.14]}>
              <planeGeometry args={[tower.w * 0.55, tower.h * 0.55]} />
              <meshBasicMaterial color="#c7ab71" transparent opacity={0.22} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

function GhostBaseline() {
  return (
    <group>
      {TERRITORIES.map((territory) => {
        const p = BASELINE_POSITIONS[territory.id]
        return (
          <group key={`ghost-${territory.id}`} position={p}>
            <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.68, 0.75, 48]} />
              <meshBasicMaterial color="#dac9a0" transparent opacity={0.28} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function CameraRig({
  selected,
  world,
  reducedMotion,
}: {
  selected: TerritoryId | null
  world: WorldState
  reducedMotion: boolean
}) {
  const look = useMemo(() => new THREE.Vector3(0, 1.15, -0.5), [])
  const desired = useMemo(() => new THREE.Vector3(0, 3.25, 11.6), [])
  const currentLook = useMemo(() => new THREE.Vector3(0, 1.15, -0.5), [])

  useFrame(({ camera }) => {
    const p = selected ? world.positions[selected] : ([0, 0, 0] as Vec3)

    if (world.stage === 'reveal') {
      desired.set(0.2, 5.4, 13.2)
      look.set(0, 0.9, -0.5)
    } else if (world.stage === 'return') {
      desired.set(0, 3.4, 11.2)
      look.set(0, 1.0, -1.3)
    } else if (selected) {
      desired.set(p[0] * 0.24, 3.05 + p[1] * 0.22, 10.7 + p[2] * 0.1)
      look.set(p[0] * 0.48, 1.1, p[2] * 0.48)
    } else {
      desired.set(0, 3.25, 11.6)
      look.set(0, 1.15, -0.5)
    }

    if (reducedMotion) {
      camera.position.copy(desired)
      currentLook.copy(look)
    } else {
      camera.position.lerp(desired, 0.032)
      currentLook.lerp(look, 0.045)
    }
    camera.lookAt(currentLook)
  })

  return null
}

function Scene({ world, selected, onSelect, reducedMotion, activeMutation }: WorldSceneProps) {
  const activeIds = new Set(activeMutation?.changes.map((change) => change.territoryId) ?? [])
  const activeSource = activeMutation?.sourceTerritoryId ?? null

  return (
    <>
      <color attach="background" args={['#090b10']} />
      <fog attach="fog" args={['#090b10', 9, 25]} />

      <ambientLight intensity={0.42} color="#d9d4c5" />
      <hemisphereLight intensity={0.75} color="#aeb9c8" groundColor="#1b120a" />
      <directionalLight position={[5, 9, 7]} intensity={3.1} color="#f8ddb1" castShadow />
      <directionalLight position={[-8, 4, -4]} intensity={1.35} color="#66758d" />

      <CameraRig selected={selected} world={world} reducedMotion={reducedMotion} />

      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <MeshReflectorMaterial
          blur={[420, 120]}
          resolution={512}
          mixBlur={0.75}
          mixStrength={0.55}
          roughness={0.88}
          metalness={0.08}
          color={darkStone}
          mirror={0.15}
          depthScale={0.2}
          minDepthThreshold={0.5}
          maxDepthThreshold={1.35}
        />
      </mesh>

      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.15, 2.18, 128]} />
        <meshBasicMaterial color="#9b855c" transparent opacity={0.42} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.45, 5.49, 128]} />
        <meshBasicMaterial color="#67583f" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>

      <DistantAtlas />
      <Portal />

      {EDGES.map(([a, b]) => {
        const from = world.positions[a]
        const to = world.positions[b]
        const isActive = activeSource === a || activeSource === b || activeIds.has(a) || activeIds.has(b)
        return <Bridge key={`${a}-${b}`} from={from} to={to} active={isActive} />
      })}

      {world.stage === 'reveal' && <GhostBaseline />}

      {world.stage === 'reveal' &&
        TERRITORIES.map((territory) => {
          const from = BASELINE_POSITIONS[territory.id]
          const to = world.positions[territory.id]
          return (
            <Line
              key={`vector-${territory.id}`}
              points={[
                [from[0], 0.42, from[2]],
                [to[0], 0.42, to[2]],
              ]}
              color={vermilion}
              transparent
              opacity={0.72}
              lineWidth={1.2}
              dashed
              dashScale={2}
            />
          )
        })}

      {TERRITORIES.map((territory) => (
        <TerritoryMonument
          key={territory.id}
          territory={territory}
          target={world.positions[territory.id]}
          selected={selected === territory.id}
          visited={world.visits[territory.id] > 0}
          active={activeIds.has(territory.id) || activeSource === territory.id}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
        />
      ))}

      <pointLight position={[0, 5.5, -7]} color="#c4cfff" intensity={2.0} distance={16} />
    </>
  )
}

export function WorldScene(props: WorldSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 3.25, 11.6], fov: 38, near: 0.1, far: 80 }}
      dpr={[1, 1.65]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows
    >
      <Scene {...props} />
    </Canvas>
  )
}
