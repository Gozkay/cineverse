import { useScrollPosition } from '@/hooks/useScrollPosition'
import Herobg from "@/assets/images/hero-bg.webp";

function HeroBackground() {
  const { scrollY } = useScrollPosition()
  const parallaxY = scrollY * 0.15

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-slate-950" />
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${parallaxY}px)` }}
      >
        <img
          src={Herobg}
          alt="Cinematic background"
          className="h-full w-full object-cover object-center opacity-60"
        />
      </div>
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.80)' }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 0% 50%, rgba(88, 28, 135, 0.3), transparent),
            radial-gradient(ellipse 60% 40% at 100% 20%, rgba(139, 92, 246, 0.15), transparent),
            radial-gradient(ellipse 40% 30% at 50% 80%, rgba(236, 72, 153, 0.08), transparent)
          `
        }}
      />
      <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px] animate-blob" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[110px] animate-blob-slow" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-600/10 blur-[100px] animate-blob" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

export default HeroBackground
