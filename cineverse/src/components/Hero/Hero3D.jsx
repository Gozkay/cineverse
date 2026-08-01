import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Text } from '@react-three/drei'
import * as THREE from 'three'

function Wordmark() {
  const group = useRef()
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
    []
  )

  useFrame((state, delta) => {
    if (reduced || !group.current) return
    const g = group.current
    const t = state.clock.elapsedTime
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, Math.sin(t * 0.5) * 0.25, delta * 0.8)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, Math.sin(t * 0.35) * 0.06, delta * 0.8)
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.35, 0.05)
    g.position.y = THREE.MathUtils.lerp(g.position.y, state.pointer.y * 0.25, 0.05)
  })

  const core = (
    <Text
      font="/fonts/sora-800.woff"
      fontSize={0.95}
      letterSpacing={0.06}
      anchorX="center"
      anchorY="middle"
      color="#a78bfa"
      outlineWidth={0.05}
      outlineColor="#e879f9"
      colorRanges={[
        [0, '#8b5cf6'],
        [1, '#f0abfc'],
      ]}
    >
      CineVerse
    </Text>
  )

  return (
    <group ref={group}>
      {reduced ? core : <Float speed={2} rotationIntensity={0} floatIntensity={1.2}>{core}</Float>}
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
      <Suspense fallback={null}>
        <Wordmark />
      </Suspense>
    </Canvas>
  )
}

export default Hero3D
