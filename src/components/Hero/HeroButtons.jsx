import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import heroData from "@/data/heroData"
import { ROUTES } from "@/constants/routes"

function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap gap-5">
      <Link to={ROUTES.MOVIES}>
        <Button size="lg" className="px-8 py-6 text-lg bg-violet-600 hover:bg-violet-700 text-white border-none cursor-pointer">
          {heroData.buttons.primary}
        </Button>
      </Link>
      <Link to={ROUTES.REGISTER}>
        <Button 
          variant="outline" 
          size="lg" 
          className="px-8 py-6 text-lg border border-slate-700 bg-transparent text-white hover:bg-slate-800 cursor-pointer"
        >
          {heroData.buttons.secondary}
        </Button>
      </Link>
    </div>
  )
}

export default HeroButtons
