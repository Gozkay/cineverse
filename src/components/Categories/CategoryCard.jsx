import { motion } from "framer-motion";

function CategoryCard({ category }) {
  const Icon = category.icon;

  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.05,
      }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
    >
      <div
        className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r ${category.color} p-5`}
      >
        <Icon className="text-4xl text-white" />
      </div>

      <h2 className="text-2xl font-bold">
        {category.title}
      </h2>

      <p className="mt-2 text-gray-400">
        {category.count} Products
      </p>
    </motion.div>
  );
}

export default CategoryCard;