import Herobg from "@/assets/images/hero-bg.webp";

function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-slate-950" />
      <img
        src={Herobg}
        alt="Cinematic background"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
      />
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
