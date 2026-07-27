import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { motion } from "framer-motion";
import { FaPlay, FaStar, FaClock, FaCalendarAlt } from "react-icons/fa";

import { BACKDROP_BASE_URL } from "@/constants/tmdb";
import PropTypes from 'prop-types';

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
              h-[280px]
              cursor-pointer
              overflow-hidden
              rounded-3xl
              border
              border-slate-800
              shadow-[0_20px_80px_rgba(0,0,0,0.5)]
              sm:h-[420px]
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
            <div className="relative flex h-full flex-col items-center justify-center px-6 text-center sm:px-8">
              {/* Badge */}
              <span
                className="
                  mb-4
                  rounded-full
                  border
                  border-red-500/40
                  bg-red-500/15
                  px-4
                  py-1.5
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-red-300
                  backdrop-blur-md
                  sm:mb-6
                  sm:px-5
                  sm:py-2
                  sm:text-sm
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
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-red-600
                  text-3xl
                  text-white
                  shadow-2xl
                  sm:h-28
                  sm:w-28
                  sm:text-5xl
                "
              >
                <FaPlay className="ml-1.5 sm:ml-2" />
              </motion.div>

              <h2 className="mt-5 text-2xl font-black tracking-tight sm:mt-8 sm:text-5xl">
                Watch Trailer
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-4 sm:text-lg sm:leading-8">
                Experience the official trailer for{" "}
                <span className="font-bold text-white">
                  {movie.title}
                </span>{" "}
                in full HD.
              </p>
            </div>

            {/* Bottom Stats */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:bottom-6 sm:left-6 sm:gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-[11px] backdrop-blur-lg sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                <FaStar className="text-yellow-400" size={12} />
                <span>{movie.vote_average?.toFixed(1)}</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-[11px] backdrop-blur-lg sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                <FaClock className="text-cyan-400" size={12} />
                <span>{movie.runtime} mins</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-[11px] backdrop-blur-lg sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                <FaCalendarAlt className="text-green-400" size={12} />
                <span>{movie.release_date?.slice(0, 4)}</span>
              </div>
            </div>

            {/* Hover Text */}
            <div
              className="
                absolute
                bottom-4
                right-4
                hidden
                rounded-full
                bg-red-600
                px-4
                py-1.5
                text-xs
                font-semibold
                opacity-0
                transition-all
                duration-300
                group-hover:opacity-100
                group-hover:translate-y-0
                sm:bottom-6
                sm:right-6
                sm:block
                sm:px-5
                sm:py-2
                sm:text-sm
              "
            >
              ▶ Play Now
            </div>
          </motion.div>
        </DialogTrigger>

        {/* Trailer Modal */}
        <DialogContent className="max-w-[calc(100%-1rem)] overflow-hidden border-none bg-black p-0 sm:max-w-7xl">
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

MovieTrailer.propTypes = {
  movie: PropTypes.shape({
    backdrop_path: PropTypes.string,
    title: PropTypes.string,
    vote_average: PropTypes.number,
    runtime: PropTypes.number,
    release_date: PropTypes.string,
  }),
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      site: PropTypes.string,
      type: PropTypes.string,
      key: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

export default MovieTrailer;
