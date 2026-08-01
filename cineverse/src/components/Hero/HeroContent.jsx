import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroData from "@/data/heroData";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";
import { FaFilm, FaBook, FaDragon, FaMasksTheater } from "react-icons/fa6";
import { ROUTES } from "@/constants/routes";

const stagger = {
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
}

const categoryChips = [
  { label: "Movies", route: ROUTES.MOVIES, icon: FaFilm, grad: "from-red-500 to-orange-500" },
  { label: "Books", route: ROUTES.BOOKS, icon: FaBook, grad: "from-violet-500 to-fuchsia-500" },
  { label: "Manga", route: ROUTES.MANGA, icon: FaDragon, grad: "from-pink-500 to-rose-500" },
  { label: "Comics", route: ROUTES.COMICS, icon: FaMasksTheater, grad: "from-emerald-500 to-teal-500" },
]

function HeroContent() {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="max-w-2xl text-center lg:text-left relative z-10"
    >
      <motion.div
        variants={fadeUp}
        className="inline-flex items-center gap-2 mb-6 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs md:text-sm uppercase tracking-[3px] text-violet-300 backdrop-blur-sm"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
        {heroData.badge}
      </motion.div>

      <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
        <span className="text-white">{heroData.title.first}</span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
          {heroData.title.second}
        </span>
      </motion.h1>

      <motion.p variants={fadeUp} className="mt-6 md:mt-8 text-base md:text-lg leading-relaxed md:leading-8 text-gray-300 max-w-xl mx-auto lg:mx-0">
        {heroData.description}
      </motion.p>

      <HeroButtons />
      <HeroStats />

      <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center lg:justify-start gap-3">
        {categoryChips.map((chip) => (
          <Link
            key={chip.label}
            to={chip.route}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white"
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${chip.grad} transition-transform duration-300 group-hover:scale-110`}>
              <chip.icon className="text-[10px] text-white" />
            </span>
            {chip.label}
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default HeroContent;
