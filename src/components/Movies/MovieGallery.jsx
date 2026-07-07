import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { motion } from "framer-motion";

function MovieGallery({ images }) {
  if (!images?.backdrops?.length) return null;

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black">
          Gallery
        </h2>

        <p className="text-slate-400">
          Official movie stills
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {images.backdrops.slice(0, 6).map((image) => (
          <motion.div
            key={image.file_path}
            whileHover={{
              scale: 1.03,
            }}
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-800
              cursor-pointer
            "
          >
            <img
              src={`${IMAGE_BASE_URL}${image.file_path}`}
              className="
                h-60
                w-full
                object-cover
                transition
                duration-500
                hover:scale-110
              "
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default MovieGallery;