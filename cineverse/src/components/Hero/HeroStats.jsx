import heroData from "@/data/heroData";
import CountUp from "@/components/ui/CountUp";

const gradients = ["from-violet-400 to-fuchsia-400", "from-blue-400 to-cyan-400", "from-pink-400 to-rose-400", "from-emerald-400 to-teal-400"];

function parseStatNumber(str) {
  const match = str.match(/^(\d+)([Kk+]?.*)$/)
  if (!match) return { number: parseInt(str) || 0, suffix: '' }
  const num = parseInt(match[1])
  const suffix = match[2] || ''
  if (suffix.startsWith('K')) return { number: num * 1000, suffix: 'K+' }
  return { number: num, suffix }
}

function HeroStats() {
  return (
    <div className="mt-16 flex flex-wrap gap-8 md:gap-12 justify-center lg:justify-start">
      {heroData.stats.map((item, i) => {
        const { number, suffix } = parseStatNumber(item.number)
        return (
          <div key={item.label} className="text-center">
            <h2 className={`text-3xl font-bold bg-gradient-to-br ${gradients[i]} text-transparent bg-clip-text`}>
              <CountUp end={number} suffix={suffix} duration={2.5} />
            </h2>
            <p className="text-sm text-gray-400 mt-0.5 tracking-wide">{item.label}</p>
          </div>
        )
      })}
    </div>
  );
}

export default HeroStats;
