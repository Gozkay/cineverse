import { Button } from "@/components/ui/button";
import heroData from "@/data/heroData";

function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap gap-5">
      <Button
        size="lg"
        className="px-8 py-6 text-lg"
      >
        {heroData.buttons.primary}
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="px-8 py-6 text-lg"
      >
        {heroData.buttons.secondary}
      </Button>
    </div>
  );
}

export default HeroButtons;