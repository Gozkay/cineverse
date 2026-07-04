import { motion } from "framer-motion"
import HeroBackground from "./HeroBackground"
import HeroContent from "./HeroContent"
import HeroFloatingCards from "./HeroFloatingCards"

function Hero() {
  return (
    /* We add relative and z-0 to establish the container bounds */
    <section className="relative z-0 flex min-h-screen items-center overflow-hidden">
      <HeroBackground />
      
      {/* We add relative and z-10 here so text sits ON TOP of the image */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroContent />
        </motion.div>
        <HeroFloatingCards />
      </div>
    </section>
  )
}

export default Hero