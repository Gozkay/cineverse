import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { motion } from "framer-motion";

function MovieGallery({ images }) {
  if (!images?.backdrops?.length) return null;

  return (
    <section className="mt-20 border-t border-white/5 pt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-black">
          <span className="text-white">Movie</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Gallery</span>
        </h2>
        <p className="mt-1 text-sm text-slate-500">Official movie stills</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {images.backdrops.slice(0, 6).map((image, i) => (
          <motion.div
            key={image.file_path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
            className="overflow-hidden rounded-2xl ring-1 ring-white/5 bg-slate-900/40 cursor-pointer transition-all duration-300 hover:ring-violet-500/40"
          >
            <img
              src={`${IMAGE_BASE_URL}${image.file_path}`}
              alt="Movie still"
              className="h-60 w-full object-cover transition duration-500 hover:scale-110"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default MovieGallery;
