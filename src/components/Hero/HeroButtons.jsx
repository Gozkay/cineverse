import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import heroData from "@/data/heroData"
import { ROUTES } from "@/constants/routes"

function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap gap-5 justify-center lg:justify-start">
      <Link to={ROUTES.MOVIES}>
        <Button
          size="lg"
          className="group relative px-8 py-6 text-lg font-semibold text-white border-none cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent_60%)]" />
          <span className="relative">{heroData.buttons.primary}</span>
        </Button>
      </Link>
      <Link to={ROUTES.REGISTER}>
        <Button
          variant="outline"
          size="lg"
          className="group relative px-8 py-6 text-lg border border-slate-600 bg-transparent text-white hover:bg-white/5 cursor-pointer rounded-xl overflow-hidden transition-all duration-300"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent_60%)]" />
          <span className="relative">{heroData.buttons.secondary}</span>
        </Button>
      </Link>
    </div>
  )
}

export default HeroButtons
