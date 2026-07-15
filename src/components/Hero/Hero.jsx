import HeroBackground from "./HeroBackground"
import HeroContent from "./HeroContent"
import HeroFloatingCards from "./HeroFloatingCards"

function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      <HeroBackground />
      
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col lg:flex-row items-center justify-between gap-10 px-6 py-20 md:py-0">
        <div className="w-full lg:w-auto">
          <HeroContent />
        </div>
        <div className="hidden lg:block shrink-0">
          <HeroFloatingCards />
        </div>
      </div>
    </section>
  )
}

export default Hero
