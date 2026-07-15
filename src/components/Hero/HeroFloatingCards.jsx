import { motion } from "framer-motion";
import { FaFilm, FaBook, FaDragon, FaMasksTheater } from "react-icons/fa6";

const floatingCards = [
  {
    icon: FaFilm,
    title: "Movies",
    gradient: "from-red-500 to-orange-500",
    x: 0,
    y: -20,
    delay: 0,
  },
  {
    icon: FaBook,
    title: "Books",
    gradient: "from-violet-500 to-fuchsia-500",
    x: 100,
    y: 40,
    delay: 0.3,
  },
  {
    icon: FaDragon,
    title: "Manga",
    gradient: "from-pink-500 to-rose-500",
    x: -80,
    y: 60,
    delay: 0.6,
  },
  {
    icon: FaMasksTheater,
    title: "Comics",
    gradient: "from-emerald-500 to-teal-500",
    x: 60,
    y: -50,
    delay: 0.9,
  },
];

function HeroFloatingCards() {
  return (
    <div className="relative hidden lg:flex items-center justify-center w-96 h-96">
      {floatingCards.map((card) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: card.delay + 1 }}
          className="absolute"
          style={{ transform: `translate(${card.x}px, ${card.y}px)` }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: card.delay }}
            className="group flex items-center gap-3 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4 pr-6 shadow-2xl hover:border-white/20 transition-all duration-300"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
              <card.icon className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{card.title}</p>
              <p className="text-xs text-gray-500">Explore now</p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default HeroFloatingCards;
