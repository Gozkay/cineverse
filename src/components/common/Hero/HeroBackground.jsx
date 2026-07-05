import Herobg from "@/assets/images/hero-bg.png";

function HeroBackground() {
  return (
    /* This outer container now holds the base dark color */
    <div className="absolute inset-0 z-0 bg-slate-950 pointer-events-none">
      {/* The Background Image */}
      <img
        src={Herobg}
        alt="Hero Cinematic Background"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      
      {/* Standard CSS color overlays that bypass Tailwind compile bugs */}
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      />
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(46, 16, 101, 0.7), rgba(15, 23, 42, 0.4), rgba(0, 0, 0, 0.6))' 
        }}
      />
    </div>
  )
}

export default HeroBackground