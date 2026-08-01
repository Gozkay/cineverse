import { lazy, Suspense } from 'react'
import HeroBackground from './HeroBackground'
import HeroContent from './HeroContent'

const Hero3D = lazy(() => import('./Hero3D'))

function HeroFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-violet-600/40 to-fuchsia-600/40 blur-2xl md:h-56 md:w-56" />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      <HeroBackground />
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 h-80 w-80 rounded-full bg-fuchsia-600/8 blur-[100px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col lg:flex-row items-center justify-between gap-10 px-6 py-20 md:py-0">
        <div className="w-full lg:w-auto relative z-10">
          <HeroContent />
        </div>
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-25 pointer-events-none lg:static lg:z-auto lg:block lg:w-[460px] lg:h-[460px] lg:shrink-0 lg:opacity-100 lg:pointer-events-auto">
          <Suspense fallback={<HeroFallback />}>
            <div className="h-64 w-64 md:h-80 md:w-80 lg:h-[460px] lg:w-[460px]">
              <Hero3D />
            </div>
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export default Hero
