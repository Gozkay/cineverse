import { Button } from "@/components/ui/button"
import heroData from "@/data/heroData"

function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap gap-5">
      <Button size="lg" className="px-8 py-6 text-lg bg-violet-600 hover:bg-violet-700 text-white border-none">
        {heroData.buttons.primary}
      </Button>
      <Button 
        variant="outline" 
        size="lg" 
        className="px-8 py-6 text-lg border border-slate-700 bg-transparent text-white hover:bg-slate-800"
      >
        {heroData.buttons.secondary}
      </Button>
    </div>
  )
}

export default HeroButtons