import { motion } from "framer-motion";
import { FaStar, FaUserCircle } from "react-icons/fa";
import PropTypes from 'prop-types';

function MovieReviews({ reviews }) {
  if (!reviews?.length) return null;

  return (
    <section className="mt-20">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-black">
          Reviews
        </h2>

        <p className="text-slate-400">
          What people are saying
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {reviews.slice(0, 4).map((review) => (
          <motion.div
            key={review.id}
            whileHover={{
              y: -5,
            }}
            className="
              rounded-3xl
              border
              border-slate-800
              bg-slate-900/50
              p-6
            "
          >
            {/* Header */}
            <div className="mb-5 flex items-center gap-4">
              <FaUserCircle
                size={45}
                className="text-slate-500"
              />

              <div>
                <h3 className="font-bold">
                  {review.author}
                </h3>

                {review.author_details?.rating && (
                  <div className="mt-1 flex items-center gap-1 text-yellow-400">
                    <FaStar />
                    {review.author_details.rating}/10
                  </div>
                )}
              </div>
            </div>

            {/* Review */}
            <p className="line-clamp-6 leading-7 text-slate-300">
              {review.content}
            </p>

            <button
              className="
                mt-5
                text-sm
                font-semibold
                text-violet-400
                hover:text-violet-300
              "
            >
              Read More →
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

MovieReviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      author: PropTypes.string,
      content: PropTypes.string,
      created_at: PropTypes.string,
      author_details: PropTypes.shape({
        rating: PropTypes.number,
      }),
    })
  ),
};

export default MovieReviews;