import { motion } from "framer-motion"
import HeroBackground from "./HeroBackground"
import HeroContent from "./HeroContent"
import HeroFloatingCards from "./HeroFloatingCards"

function Hero() {
  return (
    /* Removed bg-slate-950 class from here */
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      <HeroBackground />
      
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