import { motion } from "framer-motion";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroFloatingCards from "./HeroFloatingCards";

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">

      <HeroBackground />

      <div className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6">

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
  );
}

export default Hero;