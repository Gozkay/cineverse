import heroData from "@/data/heroData";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";

function HeroContent() {
  return (
    <div className="max-w-2xl">
      <p className="mb-5 uppercase tracking-[4px] text-violet-400">
        {heroData.badge}
      </p>

      <h1 className="text-6xl font-black leading-tight">
        {heroData.title.first}

        <span className="block text-violet-500">
          {heroData.title.second}
        </span>
      </h1>

      <p className="mt-8 text-lg leading-8 text-gray-300">
        {heroData.description}
      </p>

      <HeroButtons />

      <HeroStats />
    </div>
  );
}

export default HeroContent;