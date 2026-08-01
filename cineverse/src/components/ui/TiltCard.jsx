import { useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

function TiltCard({ children, className = '', maxTilt = 10, initial, animate, transition }) {
  const glareRef = useRef(null)
  const canTilt = useMemo(
    () => typeof window !== 'undefined' &&
      !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches &&
      window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches,
    []
  )

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 22 })
  const sy = useSpring(py, { stiffness: 180, damping: 22 })
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt])

  const handleMove = (e) => {
    if (!canTilt) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    px.set(x)
    py.set(y)
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.14), transparent 55%)`
      glareRef.current.style.opacity = '1'
    }
  }

  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <motion.div
      className={`${className} will-change-transform`}
      initial={initial}
      animate={animate}
      transition={transition}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 transition-opacity duration-300"
      />
    </motion.div>
  )
}

export default TiltCard
