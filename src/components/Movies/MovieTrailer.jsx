import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { motion } from "framer-motion";
import { FaPlay, FaStar, FaClock, FaCalendarAlt } from "react-icons/fa";

import { BACKDROP_BASE_URL } from "@/constants/tmdb";

function MovieTrailer({ movie, videos }) {
  const trailer = videos?.find(
    (video) =>
      video.site === "YouTube" &&
      (video.type === "Trailer" || video.type === "Teaser")
  );

  if (!trailer) return null;

  return (
    <section className="mt-20">
      <Dialog>
        <DialogTrigger asChild>
          <motion.div
            whileHover={{
              scale: 1.02,
              y: -4,
            }}
            transition={{ duration: 0.35 }}
            className="
              group
              relative
              h-[420px]
              cursor-pointer
              overflow-hidden
              rounded-3xl
              border
              border-slate-800
              shadow-[0_20px_80px_rgba(0,0,0,0.5)]
            "
          >
            {/* Background */}
            <img
              src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`}
              alt={movie.title}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-125
                group-hover:rotate-1
              "
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/65" />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-black/30 to-slate-950" />

            {/* Small Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Content */}
            <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
              {/* Badge */}
              <span
                className="
                  mb-6
                  rounded-full
                  border
                  border-red-500/40
                  bg-red-500/15
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  uppercase
                  tracking-widest
                  text-red-300
                  backdrop-blur-md
                "
              >
                Official Trailer
              </span>

              {/* Animated Play Button */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 0 0 rgba(239,68,68,.4)",
                    "0 0 45px rgba(239,68,68,.9)",
                    "0 0 0 rgba(239,68,68,.4)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="
                  flex
                  h-28
                  w-28
                  items-center
                  justify-center
                  rounded-full
                  bg-red-600
                  text-5xl
                  text-white
                  shadow-2xl
                "
              >
                <FaPlay className="ml-2" />
              </motion.div>

              <h2 className="mt-8 text-5xl font-black tracking-tight">
                Watch Trailer
              </h2>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Experience the official trailer for{" "}
                <span className="font-bold text-white">
                  {movie.title}
                </span>{" "}
                in full HD.
              </p>
            </div>

            {/* Bottom Stats */}
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 backdrop-blur-lg">
                <FaStar className="text-yellow-400" />
                <span>{movie.vote_average?.toFixed(1)}</span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 backdrop-blur-lg">
                <FaClock className="text-cyan-400" />
                <span>{movie.runtime} mins</span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 backdrop-blur-lg">
                <FaCalendarAlt className="text-green-400" />
                <span>{movie.release_date?.slice(0, 4)}</span>
              </div>
            </div>

            {/* Hover Text */}
            <div
              className="
                absolute
                bottom-6
                right-6
                rounded-full
                bg-red-600
                px-5
                py-2
                text-sm
                font-semibold
                opacity-0
                transition-all
                duration-300
                group-hover:opacity-100
                group-hover:translate-y-0
              "
            >
              ▶ Play Now
            </div>
          </motion.div>
        </DialogTrigger>

        {/* Trailer Modal */}
        <DialogContent className="max-w-7xl overflow-hidden border-none bg-black p-0">
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default MovieTrailer;