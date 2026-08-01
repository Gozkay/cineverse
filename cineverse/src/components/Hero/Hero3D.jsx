import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function Sculpture() {
  const group = useRef()
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
    []
  )

  useFrame((state, delta) => {
    if (reduced || !group.current) return
    const g = group.current
    g.rotation.y += delta * 0.18
    g.rotation.x += delta * 0.04
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.35, 0.05)
    g.position.y = THREE.MathUtils.lerp(g.position.y, state.pointer.y * 0.25, 0.05)
  })

  const core = (
    <>
      <mesh>
        <torusKnotGeometry args={[1.15, 0.34, 220, 36]} />
        <MeshDistortMaterial
          color="#7c3aed"
          roughness={0.12}
          metalness={0.92}
          distort={0.32}
          speed={2}
          envMapIntensity={1.4}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0.4, 0]}>
        <torusGeometry args={[1.95, 0.022, 16, 128]} />
        <meshStandardMaterial color="#d946ef" roughness={0.15} metalness={0.9} envMapIntensity={1.6} />
      </mesh>
      <mesh rotation={[1.2, -0.3, 0.8]}>
        <torusGeometry args={[2.45, 0.014, 16, 128]} />
        <meshStandardMaterial color="#22d3ee" roughness={0.2} metalness={0.85} envMapIntensity={1.2} />
      </mesh>
    </>
  )

  return (
    <group ref={group}>
      {reduced ? core : <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>{core}</Float>}
      <Sparkles count={90} scale={[7, 7, 7]} size={2.6} speed={0.35} color="#c4b5fd" opacity={0.7} />
    </group>
  )
}

function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <Suspense fallback={null}>
        <Sculpture />
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 3, 4]} scale={[6, 2, 1]} color="#8b5cf6" />
          <Lightformer form="rect" intensity={2.4} position={[-4, -1, 2]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} color="#d946ef" />
          <Lightformer form="rect" intensity={2} position={[4, -1, 2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} color="#22d3ee" />
          <Lightformer form="circle" intensity={1.6} position={[0, -3, 1]} scale={[3, 3, 1]} color="#f0abfc" />
        </Environment>
      </Suspense>
    </Canvas>
  )
}

export default Hero3D
