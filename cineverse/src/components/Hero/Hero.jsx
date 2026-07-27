import HeroBackground from "./HeroBackground"
import HeroContent from "./HeroContent"
import HeroFloatingCards from "./HeroFloatingCards"

function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      <HeroBackground />
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 h-80 w-80 rounded-full bg-fuchsia-600/8 blur-[100px]" />
      
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
