// Replace your current import with this relative path:
import heroBg from "../../assets/images/hero-bg.png"

function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <img
        src={heroBg}
        alt="Hero Background"
        className="h-full w-full object-cover"
      />
      {/* Dark overlays to keep text readable */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-950/60 via-black/30 to-black/60" />
    </div>
  )
}

export default HeroBackground