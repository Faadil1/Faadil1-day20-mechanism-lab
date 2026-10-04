import { Html, Line, useCursor } from '@react-three/drei'
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

function Archway() {
  return (
    <group position={[0, 0.12, 0.45]}>
      <mesh position={[-1.05, 0.9, 0]}>
        <boxGeometry args={[0.34, 1.8, 0.38]} />
        <meshStandardMaterial color="#bca77a" roughness={0.78} metalness={0.08} />
      </mesh>
      <mesh position={[1.05, 0.9, 0]}>
        <boxGeometry args={[0.34, 1.8, 0.38]} />
        <meshStandardMaterial color="#bca77a" roughness={0.78} metalness={0.08} />
      </mesh>
      <mesh position={[0, 1.75, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[1.05, 0.18, 12, 48, Math.PI]} />
        <meshStandardMaterial color="#bca77a" roughness={0.75} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.75, 64]} />
        <meshStandardMaterial color="#cec2a6" roughness={0.9} />
      </mesh>
    </group>
  )
}

function MonumentShape({ territory, active }: { territory: Territory; active: boolean }) {
  const material = <meshStandardMaterial color={active ? '#d65a3a' : '#d4c7aa'} roughness={0.72} metalness={0.06} />

  if (territory.shape === 'orb') {
    return (
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.48, 28, 28]} />
        {material}
      </mesh>
    )
  }
  if (territory.shape === 'ring') {
    return (
      <mesh position={[0, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.12, 16, 48]} />
        {material}
      </mesh>
    )
  }
  if (territory.shape === 'spire') {
    return (
      <mesh position={[0, 0.96, 0]}>
        <coneGeometry args={[0.42, 1.65, 5]} />
        {material}
      </mesh>
    )
  }
  if (territory.shape === 'book') {
    return (
      <group position={[0, 0.72, 0]} rotation={[0, 0.35, 0]}>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.16]}>
          <boxGeometry args={[0.45, 0.78, 0.12]} />
          {material}
        </mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, -0.16]}>
          <boxGeometry args={[0.45, 0.78, 0.12]} />
          {material}
        </mesh>
      </group>
    )
  }
  if (territory.shape === 'arch') {
    return (
      <group position={[0, 0.35, 0]} scale={0.52}>
        <mesh position={[-0.72, 0.65, 0]}>
          <boxGeometry args={[0.24, 1.3, 0.28]} />
          {material}
        </mesh>
        <mesh position={[0.72, 0.65, 0]}>
          <boxGeometry args={[0.24, 1.3, 0.28]} />
          {material}
        </mesh>
        <mesh position={[0, 1.3, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.72, 0.12, 10, 32, Math.PI]} />
          {material}
        </mesh>
      </group>
    )
  }
  return (
    <mesh position={[0, 0.8, 0]} rotation={[0.08, 0.28, -0.04]}>
      <boxGeometry args={[0.62, 1.35, 0.5]} />
      {material}
    </mesh>
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
  useCursor(hovered)

  useFrame(() => {
    if (!group.current) return
    targetVector.set(target[0], target[1], target[2])
    if (reducedMotion) group.current.position.copy(targetVector)
    else group.current.position.lerp(targetVector, 0.085)
  })

  return (
    <group
      ref={group}
      position={target}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(territory.id)
      }}
      scale={selected ? 1.08 : 1}
    >
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.72, 0.9, 0.14, 48]} />
        <meshStandardMaterial color={visited ? '#9e8a62' : '#87775a'} roughness={0.86} />
      </mesh>
      <MonumentShape territory={territory} active={active} />
      <pointLight color={active ? '#d65a3a' : '#bca77a'} intensity={active || selected ? 2.1 : 0.45} distance={2.4} />
      <Html center position={[0, 1.55, 0]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div className={`world-label ${selected ? 'is-selected' : ''}`}>{territory.name}</div>
      </Html>
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
            <mesh position={[0, 0.05, 0]}>
              <ringGeometry args={[0.48, 0.58, 32]} />
              <meshBasicMaterial color="#d5c7a6" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function CameraRig({ selected, world, reducedMotion }: { selected: TerritoryId | null; world: WorldState; reducedMotion: boolean }) {
  const look = useMemo(() => new THREE.Vector3(0, 0.35, 0), [])
  const desired = useMemo(() => new THREE.Vector3(0, 7.3, 10.4), [])
  const currentLook = useMemo(() => new THREE.Vector3(0, 0.35, 0), [])

  useFrame(({ camera }) => {
    const p = selected ? world.positions[selected] : ([0, 0, 0] as Vec3)
    desired.set(p[0] * 0.14, 7.25 + p[1] * 0.3, 10.4 + p[2] * 0.07)
    look.set(p[0] * 0.22, 0.35, p[2] * 0.22)
    if (reducedMotion) {
      camera.position.copy(desired)
      currentLook.copy(look)
    } else {
      camera.position.lerp(desired, 0.035)
      currentLook.lerp(look, 0.05)
    }
    camera.lookAt(currentLook)
  })
  return null
}

function Scene({ world, selected, onSelect, reducedMotion, activeMutation }: WorldSceneProps) {
  const activeIds = new Set(activeMutation?.changes.map((change) => change.territoryId) ?? [])

  return (
    <>
      <color attach="background" args={['#0d0c0a']} />
      <fog attach="fog" args={['#0d0c0a', 8, 19]} />
      <ambientLight intensity={0.9} color="#e8dec8" />
      <directionalLight position={[6, 10, 4]} intensity={2.6} color="#fff1cf" />
      <directionalLight position={[-8, 4, -5]} intensity={1.1} color="#768493" />
      <CameraRig selected={selected} world={world} reducedMotion={reducedMotion} />

      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7.7, 96]} />
        <meshStandardMaterial color="#181611" roughness={1} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.15, 2.18, 96]} />
        <meshBasicMaterial color="#6d6048" transparent opacity={0.58} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.1, 5.13, 96]} />
        <meshBasicMaterial color="#4d4435" transparent opacity={0.44} side={THREE.DoubleSide} />
      </mesh>

      <Archway />

      {EDGES.map(([a, b]) => {
        const from = world.positions[a]
        const to = world.positions[b]
        return (
          <Line
            key={`${a}-${b}`}
            points={[
              [from[0], 0.16, from[2]],
              [(from[0] + to[0]) / 2, 0.22, (from[2] + to[2]) / 2],
              [to[0], 0.16, to[2]],
            ]}
            color="#8f7c59"
            transparent
            opacity={0.48}
            lineWidth={1.25}
          />
        )
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
                [from[0], 0.36, from[2]],
                [to[0], 0.36, to[2]],
              ]}
              color="#d65a3a"
              transparent
              opacity={0.52}
              lineWidth={1}
              dashed
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
          active={activeIds.has(territory.id)}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

export function WorldScene(props: WorldSceneProps) {
  return (
    <Canvas camera={{ position: [0, 7.3, 10.4], fov: 42, near: 0.1, far: 60 }} dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <Scene {...props} />
    </Canvas>
  )
}
