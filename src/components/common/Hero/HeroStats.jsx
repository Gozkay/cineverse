import heroData from "@/data/heroData";

function HeroStats() {
  return (
    <div className="mt-16 flex flex-wrap gap-12">
      {heroData.stats.map((item) => (
        <div key={item.label}>
          <h2 className="text-3xl font-bold text-violet-400">
            {item.number}
          </h2>

          <p className="text-gray-300">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default HeroStats;