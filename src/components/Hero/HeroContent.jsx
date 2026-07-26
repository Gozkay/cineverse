import heroData from "@/data/heroData";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";

function HeroContent() {
  return (
    <div className="max-w-2xl text-center lg:text-left relative z-10">
      <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs md:text-sm uppercase tracking-[3px] text-violet-300 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
        {heroData.badge}
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
        <span className="text-white">{heroData.title.first}</span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
          {heroData.title.second}
        </span>
      </h1>

      <p className="mt-6 md:mt-8 text-base md:text-lg leading-relaxed md:leading-8 text-gray-300 max-w-xl mx-auto lg:mx-0">
        {heroData.description}
      </p>

      <HeroButtons />
      <HeroStats />
    </div>
  );
}

export default HeroContent;
