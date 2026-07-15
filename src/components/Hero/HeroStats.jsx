import heroData from "@/data/heroData";

function HeroStats() {
  const gradientColors = ["from-violet-400 to-fuchsia-400", "from-blue-400 to-cyan-400", "from-pink-400 to-rose-400", "from-emerald-400 to-teal-400"];

  return (
    <div className="mt-16 flex flex-wrap gap-8 md:gap-12 justify-center lg:justify-start">
      {heroData.stats.map((item, i) => (
        <div key={item.label} className="text-center">
          <h2 className={`text-3xl font-bold bg-gradient-to-br ${gradientColors[i]} text-transparent bg-clip-text`}>
            {item.number}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5 tracking-wide">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default HeroStats;
